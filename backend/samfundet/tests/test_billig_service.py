from __future__ import annotations

from typing import Any
from datetime import UTC

import pytest
from freezegun import freeze_time

from django.utils import timezone

from root.custom_classes.billig_service import BilligService

from samfundet.models.billig import (
    BilligEvent,
    BilligTicket,
    BilligPurchase,
    BilligPriceGroup,
    BilligTicketCard,
    BilligTicketGroup,
)


def create_event(
    *,
    event_id: int,
    sale_from: timezone.datetime,
    sale_to: timezone.datetime,
    hidden: bool = False,
) -> BilligEvent:
    return BilligEvent.objects.create(
        id=event_id,
        name=f'Event {event_id}',
        sale_from=sale_from,
        sale_to=sale_to,
        hidden=hidden,
    )


def create_ticket_group(
    *,
    group_id: int,
    event: BilligEvent,
    num: int = 50,
    num_sold: int = 10,
) -> BilligTicketGroup:
    return BilligTicketGroup.objects.create(
        id=group_id,
        event=event,
        name=f'Group {group_id}',
        num=num,
        num_sold=num_sold,
        ticket_limit=None,
        is_theater_ticket_group=False,
    )


def create_price_group(
    *,
    price_group_id: int,
    ticket_group: BilligTicketGroup,
    netsale: bool = True,
) -> BilligPriceGroup:
    return BilligPriceGroup.objects.create(
        id=price_group_id,
        ticket_group=ticket_group,
        name=f'Price group {price_group_id}',
        price=100,
        membership_needed=False,
        can_be_put_on_card=True,
        netsale=netsale,
    )


def test_can_purchase_tickets_returns_not_found() -> None:
    assert BilligService.can_purchase_tickets(999_999) == (False, 'Event not found')


@pytest.mark.parametrize(
    ('hidden', 'sale_from', 'sale_to', 'num', 'num_sold', 'expected'),
    [
        (True, '2026-01-01 12:00:00', '2026-01-01 14:00:00', 10, 0, (False, 'Event is hidden')),
        (False, '2026-01-01 13:00:01', '2026-01-01 14:00:00', 10, 0, (False, 'Ticket sale has not started yet')),
        (False, '2026-01-01 12:00:00', '2026-01-01 12:59:59', 10, 0, (False, 'Ticket sale has ended')),
        (False, '2026-01-01 12:00:00', '2026-01-01 14:00:00', 10, 10, (False, 'Event is sold out')),
        (False, '2026-01-01 13:00:00', '2026-01-01 13:00:00', 10, 0, (True, None)),
    ],
)
@freeze_time('2026-01-01 12:00:00')
def test_can_purchase_tickets_refusals_and_boundaries(
    *,
    hidden: bool,
    sale_from: str,
    sale_to: str,
    num: int,
    num_sold: int,
    expected: tuple[bool, str | None],
) -> None:
    event = create_event(
        event_id=100,
        sale_from=timezone.datetime.fromisoformat(sale_from).replace(tzinfo=UTC),
        sale_to=timezone.datetime.fromisoformat(sale_to).replace(tzinfo=UTC),
        hidden=hidden,
    )
    create_ticket_group(group_id=101, event=event, num=num, num_sold=num_sold)

    assert BilligService.can_purchase_tickets(event.id) == expected


@pytest.mark.parametrize(
    ('data', 'expected'),
    [
        ({'membercard': '123', 'cardnumber': '456', 'email': 'a@example.com'}, ('123', 'a@example.com')),
        ({}, ('', '')),
        ({'membercard': ' 123 ', 'email': ' a@example.com '}, ('123', 'a@example.com')),
    ],
)
def test_get_contact_fields(data: dict[str, Any], expected: tuple[str, str]) -> None:
    assert BilligService.get_contact_fields(data) == expected


def test_get_ticket_groups_for_unknown_event_returns_empty_list() -> None:
    assert BilligService.get_ticket_groups_for_event(999_999) == []


def test_get_ticket_groups_excludes_offline_prices_and_empty_groups(fixture_billig_event: BilligEvent) -> None:
    visible_group = create_ticket_group(group_id=700, event=fixture_billig_event)
    create_price_group(price_group_id=7000, ticket_group=visible_group)
    create_price_group(price_group_id=7001, ticket_group=visible_group, netsale=False)
    hidden_group = create_ticket_group(group_id=701, event=fixture_billig_event)
    create_price_group(price_group_id=7010, ticket_group=hidden_group, netsale=False)

    result = BilligService.get_ticket_groups_for_event(fixture_billig_event.id)

    assert [group['id'] for group in result] == [visible_group.id]
    assert [price_group['id'] for price_group in result[0]['price_groups']] == [7000]


def test_get_ticket_groups_pins_frontend_contract(
    fixture_billig_event: BilligEvent,
    fixture_billig_ticket_group: BilligTicketGroup,
    fixture_billig_price_group: BilligPriceGroup,
) -> None:
    result = BilligService.get_ticket_groups_for_event(fixture_billig_event.id)

    assert len(result) == 1
    assert set(result[0]) == {'id', 'name', 'is_sold_out', 'is_almost_sold_out', 'ticket_limit', 'price_groups'}
    assert result[0]['ticket_limit'] is None


def test_create_fake_purchase_with_known_membercard(
    fixture_billig_ticket_group: BilligTicketGroup,
    fixture_billig_price_group: BilligPriceGroup,
    fixture_billig_ticket_card: BilligTicketCard,
) -> None:
    ticket_refs = BilligService.create_fake_purchase(
        cart_rows=[(fixture_billig_price_group.id, 2)],
        membercard=str(fixture_billig_ticket_card.card),
        email=None,
    )

    tickets = list(BilligTicket.objects.order_by('id'))
    assert ticket_refs == [f'{ticket.id}12345' for ticket in tickets]
    assert BilligPurchase.objects.count() == 2
    assert len(tickets) == 2
    assert all(ticket.on_card for ticket in tickets)
    assert {ticket.purchase.owner_member_id for ticket in tickets} == {fixture_billig_ticket_card.owner_member_id}
    fixture_billig_ticket_group.refresh_from_db()
    assert fixture_billig_ticket_group.num_sold == 12


def test_create_fake_purchase_handles_unknown_membercard(fixture_billig_price_group: BilligPriceGroup) -> None:
    BilligService.create_fake_purchase(
        cart_rows=[(fixture_billig_price_group.id, 1)],
        membercard='999999',
        email=None,
    )

    ticket = BilligTicket.objects.get()
    assert ticket.on_card is False
    assert ticket.purchase.owner_member_id is None


def test_create_fake_purchase_sets_email_and_continues_ids(fixture_billig_price_group: BilligPriceGroup) -> None:
    first_refs = BilligService.create_fake_purchase(
        cart_rows=[(fixture_billig_price_group.id, 1)],
        membercard=None,
        email='buyer@example.com',
    )
    second_refs = BilligService.create_fake_purchase(
        cart_rows=[(fixture_billig_price_group.id, 1)],
        membercard=None,
        email='buyer@example.com',
    )

    assert BilligPurchase.objects.filter(owner_email='buyer@example.com').count() == 2
    assert int(second_refs[0][:-5]) == int(first_refs[0][:-5]) + 1


def test_create_fake_payment_error_persists_cart(fixture_billig_price_group: BilligPriceGroup) -> None:
    error_id = BilligService.create_fake_payment_error(
        message='Payment failed',
        cart_rows=[(fixture_billig_price_group.id, 2)],
        membercard='100001',
        email='buyer@example.com',
        persist_cart=True,
    )

    assert len(error_id) == 32
    int(error_id, 16)
    assert BilligService.get_payment_error_context(error_id) == {
        'found': True,
        'retry_possible': True,
        'message': 'Payment failed',
        'owner_cardno': '100001',
        'owner_email': 'buyer@example.com',
        'cart_rows': [{'price_group': fixture_billig_price_group.id, 'number_of_tickets': 2}],
        'event_id': fixture_billig_price_group.ticket_group.event_id,
    }


def test_get_payment_error_context_for_unknown_error() -> None:
    assert BilligService.get_payment_error_context('missing') == {
        'found': False,
        'retry_possible': False,
        'message': 'An unknown payment error occurred.',
    }


def test_get_payment_error_context_without_cart_is_not_retryable() -> None:
    error_id = BilligService.create_fake_payment_error(
        message='Do not retry',
        cart_rows=[],
        membercard=None,
        email='buyer@example.com',
        persist_cart=False,
    )

    context = BilligService.get_payment_error_context(error_id)
    assert context['found'] is True
    assert context['retry_possible'] is False
    assert context['cart_rows'] == []
    assert context['event_id'] is None


def test_get_payment_error_context_omits_event_for_mixed_cart(fixture_billig_event: BilligEvent) -> None:
    first_group = create_ticket_group(group_id=710, event=fixture_billig_event)
    first_price = create_price_group(price_group_id=7100, ticket_group=first_group)
    other_event = create_event(
        event_id=711,
        sale_from=timezone.now(),
        sale_to=timezone.now() + timezone.timedelta(days=1),
    )
    second_group = create_ticket_group(group_id=711, event=other_event)
    second_price = create_price_group(price_group_id=7110, ticket_group=second_group)
    error_id = BilligService.create_fake_payment_error(
        message='Mixed cart',
        cart_rows=[(first_price.id, 1), (second_price.id, 1)],
        membercard=None,
        email='buyer@example.com',
        persist_cart=True,
    )

    context = BilligService.get_payment_error_context(error_id)
    assert context['retry_possible'] is True
    assert context['event_id'] is None
