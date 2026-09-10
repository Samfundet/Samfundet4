from __future__ import annotations

from typing import TYPE_CHECKING, Any
from urllib.parse import parse_qs, urlparse

import pytest

from rest_framework import status

from django.test import override_settings
from django.urls import reverse
from django.core.exceptions import ImproperlyConfigured

from root.utils import routes
from root.constants import Environment

from samfundet.serializers import BilligEventSerializer, BilligTicketGroupSerializer
from samfundet.models.billig import BilligEvent, BilligTicket, BilligPurchase, BilligPriceGroup, BilligTicketCard, BilligTicketGroup
from samfundet.view.billig_views import (
    parse_cart_rows,
    has_unknown_price_groups,
    should_fake_purchase_fail,
    build_frontend_callback_url,
)

if TYPE_CHECKING:
    from rest_framework.test import APIClient
    from rest_framework.response import Response


@pytest.mark.parametrize(
    ('data', 'expected'),
    [
        ({'price_12_count': '2'}, [(12, 2)]),
        ({'price_bad_count': '2'}, []),
        ({'price_12_count': 'bad'}, []),
        ({'price_12_count': '0', 'price_13_count': '-1'}, []),
        ({'email': 'buyer@example.com'}, []),
    ],
)
def test_parse_cart_rows(data: dict[str, Any], expected: list[tuple[int, int]]) -> None:
    assert parse_cart_rows(data) == expected


@pytest.mark.parametrize(
    ('cart_rows', 'membercard', 'email', 'unknown', 'expected'),
    [
        ([], '12345', None, False, True),
        ([(1, 1)], None, None, False, True),
        ([(1, 1)], '12345', None, True, True),
        ([(1, 1)], None, 'please-fail@example.com', False, True),
        ([(1, 1)], '120000', None, False, True),
        ([(1, 1)], 'not-a-card', None, False, True),
        ([(1, 1)], '12345', None, False, False),
        ([(1, 1)], None, 'buyer@example.com', False, False),
    ],
)
def test_should_fake_purchase_fail(
    *,
    cart_rows: list[tuple[int, int]],
    membercard: str | None,
    email: str | None,
    unknown: bool,
    expected: bool,
) -> None:
    assert (
        should_fake_purchase_fail(
            cart_rows=cart_rows,
            membercard=membercard,
            email=email,
            has_unknown_price_group=unknown,
        )
        is expected
    )


def test_has_unknown_price_groups(fixture_billig_price_group: BilligPriceGroup) -> None:
    assert has_unknown_price_groups([(fixture_billig_price_group.id, 1)]) is False
    assert has_unknown_price_groups([(fixture_billig_price_group.id, 1), (999_999, 1)]) is True


@override_settings(BILLIG_FRONTEND_BASE_URL='https://frontend.example/')
def test_build_frontend_callback_url_uses_explicit_setting() -> None:
    assert build_frontend_callback_url('/callback/') == 'https://frontend.example/callback/'


@override_settings(BILLIG_FRONTEND_BASE_URL='', CORS_ALLOWED_ORIGINS=['https://cors.example/'])
def test_build_frontend_callback_url_requires_explicit_setting() -> None:
    with pytest.raises(ImproperlyConfigured, match='BILLIG_FRONTEND_BASE_URL'):
        build_frontend_callback_url('/callback/')


@override_settings(BILLIG_PAYMENT_URL='https://billig.example/pay')
def test_billig_event_serializer_contract(fixture_billig_event: BilligEvent) -> None:
    fixture_billig_event.ticket_fee = 25
    data = BilligEventSerializer(fixture_billig_event).data

    assert data['payment_url'] == 'https://billig.example/pay'
    assert data['ticket_fee'] == 25


def test_billig_ticket_group_serializer_contract(
    fixture_billig_ticket_group: BilligTicketGroup,
    fixture_billig_price_group: BilligPriceGroup,
) -> None:
    data = BilligTicketGroupSerializer(fixture_billig_ticket_group).data

    assert set(data) == {
        'id',
        'name',
        'is_sold_out',
        'is_almost_sold_out',
        'is_theater_ticket_group',
        'ticket_limit',
        'price_groups',
    }
    assert data['is_theater_ticket_group'] is False
    assert data['ticket_limit'] is None
    assert 'ticket_fee' not in data['price_groups'][0]


def test_event_tickets_returns_public_ticket_groups(
    fixture_rest_client: APIClient,
    fixture_billig_event: BilligEvent,
    fixture_billig_ticket_group: BilligTicketGroup,
    fixture_billig_price_group: BilligPriceGroup,
) -> None:
    response: Response = fixture_rest_client.get(reverse(routes.samfundet__event_tickets, args=[fixture_billig_event.id]))

    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]['id'] == fixture_billig_ticket_group.id


def test_event_tickets_returns_exact_hidden_reason(fixture_rest_client: APIClient, fixture_billig_event: BilligEvent) -> None:
    fixture_billig_event.hidden = True
    fixture_billig_event.save(update_fields=['hidden'])

    response: Response = fixture_rest_client.get(reverse(routes.samfundet__event_tickets, args=[fixture_billig_event.id]))

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {'error': 'Event is hidden'}


def test_event_tickets_rejects_unknown_event(fixture_rest_client: APIClient) -> None:
    response: Response = fixture_rest_client.get(reverse(routes.samfundet__event_tickets, args=[999_999]))

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {'error': 'Event not found'}


def test_dev_pay_membercard_success(
    fixture_rest_client: APIClient,
    fixture_billig_ticket_group: BilligTicketGroup,
    fixture_billig_price_group: BilligPriceGroup,
    fixture_billig_ticket_card: BilligTicketCard,
) -> None:
    response: Response = fixture_rest_client.post(
        reverse(routes.samfundet__purchase_dev_pay),
        data={
            f'price_{fixture_billig_price_group.id}_count': '1',
            'membercard': str(fixture_billig_ticket_card.card),
        },
    )

    assert response.status_code == status.HTTP_302_FOUND
    location = response['Location']
    assert urlparse(location).path == reverse(routes.samfundet__purchase_success)
    ticket_ref = parse_qs(urlparse(location).query)['tickets'][0]
    ticket = BilligTicket.objects.get()
    assert ticket_ref == f'{ticket.id}12345'
    assert ticket.on_card is True
    assert BilligPurchase.objects.get().owner_member_id == fixture_billig_ticket_card.owner_member_id
    fixture_billig_ticket_group.refresh_from_db()
    assert fixture_billig_ticket_group.num_sold == 11


def test_dev_pay_empty_cart_creates_non_retryable_error(fixture_rest_client: APIClient) -> None:
    response: Response = fixture_rest_client.post(
        reverse(routes.samfundet__purchase_dev_pay),
        data={'email': 'buyer@example.com'},
    )

    assert response.status_code == status.HTTP_302_FOUND
    bsession = parse_qs(urlparse(response['Location']).query)['bsession'][0]
    error_response: Response = fixture_rest_client.get(
        reverse(routes.samfundet__purchase_failure_data),
        data={'bsession': bsession},
    )
    assert error_response.json()['found'] is True
    assert error_response.json()['retry_possible'] is False


def test_dev_pay_unknown_price_group_creates_non_retryable_error(fixture_rest_client: APIClient) -> None:
    response: Response = fixture_rest_client.post(
        reverse(routes.samfundet__purchase_dev_pay),
        data={'price_999999_count': '1', 'email': 'buyer@example.com'},
    )

    assert response.status_code == status.HTTP_302_FOUND
    bsession = parse_qs(urlparse(response['Location']).query)['bsession'][0]
    error_response: Response = fixture_rest_client.get(
        reverse(routes.samfundet__purchase_failure_data),
        data={'bsession': bsession},
    )
    assert error_response.json()['retry_possible'] is False
    assert BilligTicket.objects.count() == 0


def test_dev_pay_failure_round_trip_restores_cart(
    fixture_rest_client: APIClient,
    fixture_billig_price_group: BilligPriceGroup,
) -> None:
    response: Response = fixture_rest_client.post(
        reverse(routes.samfundet__purchase_dev_pay),
        data={f'price_{fixture_billig_price_group.id}_count': '2', 'email': 'fail@example.com'},
    )

    assert response.status_code == status.HTTP_302_FOUND
    bsession = parse_qs(urlparse(response['Location']).query)['bsession'][0]
    error_response: Response = fixture_rest_client.get(
        reverse(routes.samfundet__purchase_failure_data),
        data={'bsession': bsession},
    )
    assert error_response.json()['retry_possible'] is True
    assert error_response.json()['cart_rows'] == [{'price_group': fixture_billig_price_group.id, 'number_of_tickets': 2}]


@override_settings(ENV=Environment.PROD)
def test_dev_pay_is_disabled_in_production(fixture_rest_client: APIClient) -> None:
    response: Response = fixture_rest_client.post(reverse(routes.samfundet__purchase_dev_pay), data={})

    assert response.status_code == status.HTTP_404_NOT_FOUND


@override_settings(BILLIG_FRONTEND_BASE_URL='https://frontend.example')
def test_purchase_success_redirect_target(fixture_rest_client: APIClient) -> None:
    response: Response = fixture_rest_client.get(
        reverse(routes.samfundet__purchase_success),
        data={'tickets': '1234512345,6789012345'},
    )

    assert response.status_code == status.HTTP_302_FOUND
    assert response['Location'] == 'https://frontend.example/arrangement/billetter/status/1234512345,6789012345/'


@override_settings(BILLIG_FRONTEND_BASE_URL='https://frontend.example')
def test_purchase_failure_redirect_preserves_session(fixture_rest_client: APIClient) -> None:
    response: Response = fixture_rest_client.get(
        reverse(routes.samfundet__purchase_failure),
        data={'bsession': 'abc123'},
    )

    assert response.status_code == status.HTTP_302_FOUND
    assert response['Location'] == 'https://frontend.example/arrangement/billetter/handlekurv/?bsession=abc123'


def test_purchase_failure_data_requires_session(fixture_rest_client: APIClient) -> None:
    response: Response = fixture_rest_client.get(reverse(routes.samfundet__purchase_failure_data))

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {'error': 'Missing bsession'}


def test_purchase_failure_data_handles_unknown_session(fixture_rest_client: APIClient) -> None:
    response: Response = fixture_rest_client.get(
        reverse(routes.samfundet__purchase_failure_data),
        data={'bsession': 'missing'},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        'found': False,
        'retry_possible': False,
        'message': 'An unknown payment error occurred.',
    }


@override_settings(BILLIG_FRONTEND_BASE_URL='https://frontend.example')
def test_dev_pay_success_round_trip(
    fixture_rest_client: APIClient,
    fixture_billig_price_group: BilligPriceGroup,
    fixture_billig_ticket_card: BilligTicketCard,
) -> None:
    pay_response: Response = fixture_rest_client.post(
        reverse(routes.samfundet__purchase_dev_pay),
        data={
            f'price_{fixture_billig_price_group.id}_count': '1',
            'membercard': str(fixture_billig_ticket_card.card),
        },
    )
    callback_response: Response = fixture_rest_client.get(pay_response['Location'])

    ticket_ref = parse_qs(urlparse(pay_response['Location']).query)['tickets'][0]
    assert callback_response.status_code == status.HTTP_302_FOUND
    assert callback_response['Location'] == f'https://frontend.example/arrangement/billetter/status/{ticket_ref}/'
