from __future__ import annotations

from typing import Any, cast
from urllib.parse import urlencode
from collections.abc import Mapping

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BaseAuthentication

from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.exceptions import ImproperlyConfigured
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from root.constants import Environment
from root.custom_classes.billig_service import BilligService

from samfundet.serializers import BilligEventSerializer, BilligPriceGroupSerializer, BilligTicketGroupSerializer
from samfundet.models.billig import BilligEvent, BilligPriceGroup, BilligTicketGroup
from samfundet.routing.frontend_routes import BILLIG_STATUS, BILLIG_HANDLEKURV


def parse_cart_rows(data: Mapping[str, Any]) -> list[tuple[int, int]]:
    cart_rows = []
    for key, value in data.items():
        if not key.startswith('price_') or not key.endswith('_count'):
            continue
        try:
            price_group_id = int(key[len('price_') : -len('_count')])
            count = int(value)
        except (TypeError, ValueError):
            continue
        if count > 0:
            cart_rows.append((price_group_id, count))
    return cart_rows


def has_unknown_price_groups(cart_rows: list[tuple[int, int]]) -> bool:
    submitted_ids = {price_group_id for price_group_id, _ in cart_rows}
    known_ids = set(BilligPriceGroup.objects.filter(id__in=submitted_ids).values_list('id', flat=True))
    return submitted_ids != known_ids


def should_fake_purchase_fail(
    *,
    cart_rows: list[tuple[int, int]],
    membercard: str | None,
    email: str | None,
    has_unknown_price_group: bool,
) -> bool:
    return (
        not cart_rows
        or (email is None and membercard is None)
        or has_unknown_price_group
        or bool(email and 'fail' in email.lower())
        or bool(membercard and (membercard.endswith('0000') or not membercard.isdigit()))
    )


def build_frontend_callback_url(path: str) -> str:
    frontend_base_url = getattr(settings, 'BILLIG_FRONTEND_BASE_URL', '').strip()
    if not frontend_base_url:
        raise ImproperlyConfigured('BILLIG_FRONTEND_BASE_URL must be configured for Billig callbacks')

    return f'{frontend_base_url.rstrip("/")}{path}'


class BilligEventReadOnlyModelViewSet(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = BilligEventSerializer
    queryset = BilligEvent.objects.all()


class BilligPriceGroupReadOnlyModelViewSet(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = BilligPriceGroupSerializer
    queryset = BilligPriceGroup.objects.all()


class BilligTicketGroupReadOnlyModelViewSet(ReadOnlyModelViewSet):
    serializer_class = BilligTicketGroupSerializer
    queryset = BilligTicketGroup.objects.all()


class BilligEventTicketsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, event_id: int) -> Response:
        can_purchase, reason = BilligService.can_purchase_tickets(event_id)
        if not can_purchase:
            return Response({'error': reason}, status=status.HTTP_400_BAD_REQUEST)

        ticket_groups = BilligService.get_ticket_groups_for_event(event_id)
        return Response(ticket_groups)


@method_decorator(csrf_exempt, name='dispatch')
class BilligPurchaseSuccessView(APIView):
    authentication_classes: list[type[BaseAuthentication]] = []
    permission_classes = [AllowAny]

    def get(self, request: Request) -> HttpResponseRedirect:
        tickets = request.GET.get('tickets', '').strip()
        status_path = BILLIG_STATUS.replace('<tickets>', tickets)
        status_url = build_frontend_callback_url(status_path)
        return HttpResponseRedirect(status_url)


@method_decorator(csrf_exempt, name='dispatch')
class BilligPurchaseFailureView(APIView):
    authentication_classes: list[type[BaseAuthentication]] = []
    permission_classes = [AllowAny]

    def get(self, request: Request) -> HttpResponseRedirect:
        query_string = urlencode(request.GET.dict())
        failure_url = build_frontend_callback_url(BILLIG_HANDLEKURV)
        if query_string:
            failure_url = f'{failure_url}?{query_string}'
        return HttpResponseRedirect(failure_url)


class BilligPurchaseFailureDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        bsession = str(request.GET.get('bsession', '')).strip()
        if not bsession:
            return Response({'error': 'Missing bsession'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(BilligService.get_payment_error_context(bsession))


@method_decorator(csrf_exempt, name='dispatch')
class BilligDevPayView(APIView):
    authentication_classes: list[type[BaseAuthentication]] = []
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response | HttpResponseRedirect:
        if settings.ENV != Environment.DEV:
            return Response({'error': 'Fake Billig pay is only available in development'}, status=status.HTTP_404_NOT_FOUND)

        request_data = cast(Mapping[str, Any], request.data)
        raw_membercard, raw_email = BilligService.get_contact_fields(request_data)
        membercard = raw_membercard or None
        email = raw_email or None
        cart_rows = parse_cart_rows(request_data)
        has_unknown_price_group = has_unknown_price_groups(cart_rows)
        should_fail = should_fake_purchase_fail(
            cart_rows=cart_rows,
            membercard=membercard,
            email=email,
            has_unknown_price_group=has_unknown_price_group,
        )
        failure_message = 'Some error occurred.'

        if should_fail:
            error_id = BilligService.create_fake_payment_error(
                message=failure_message,
                cart_rows=cart_rows,
                membercard=membercard,
                email=email,
                persist_cart=bool(cart_rows) and not has_unknown_price_group,
            )
            failure_url = request.build_absolute_uri(reverse('samfundet:purchase_failure'))
            return HttpResponseRedirect(f'{failure_url}?bsession={error_id}')

        success_url = request.build_absolute_uri(reverse('samfundet:purchase_success'))
        tickets = ','.join(
            BilligService.create_fake_purchase(
                cart_rows=cart_rows,
                membercard=membercard,
                email=email,
            )
        )
        return HttpResponseRedirect(f'{success_url}?{urlencode({"tickets": tickets})}')
