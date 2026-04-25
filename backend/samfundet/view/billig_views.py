from __future__ import annotations

from urllib.parse import urlencode

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from root.constants import Environment
from root.custom_classes.billig_service import BilligService

from samfundet.models.billig import BilligEvent, BilligPriceGroup, BilligTicketGroup
from samfundet.serializers import BilligEventSerializer, BilligPriceGroupSerializer, BilligTicketGroupSerializer

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


class BilligPurchaseView(APIView):
    """
    Validate a Billig purchase request and return the form payload expected by /pay.
    """

    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            event_id = int(request.data.get('event_id'))
        except (TypeError, ValueError):
            return Response({'error': 'Missing or invalid event_id'}, status=status.HTTP_400_BAD_REQUEST)

        event = BilligService.get_event_with_tickets(event_id)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        can_purchase, reason = BilligService.can_purchase_tickets(event_id)
        if not can_purchase:
            return Response({'error': reason}, status=status.HTTP_400_BAD_REQUEST)

        is_valid, error = BilligService.validate_purchase_data(request.data, event=event)
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)

        form_data = BilligService.prepare_purchase_data(request.data, event=event)

        return Response(
            {
                'success': True,
                'form_data': form_data,
                'payment_url': settings.BILLIG_PAYMENT_URL,
            }
        )


class BilligEventTicketsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, event_id, format=None):
        can_purchase, reason = BilligService.can_purchase_tickets(event_id)
        if not can_purchase:
            return Response({'error': reason}, status=status.HTTP_400_BAD_REQUEST)

        ticket_groups = BilligService.get_ticket_groups_for_event(event_id)
        return Response(ticket_groups)


@method_decorator(csrf_exempt, name='dispatch')
class BilligPurchaseSuccessView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        callback_data = request.GET.dict()

        return Response(
            {
                'success': True,
                'message': 'Billig payment callback received.',
                'callback_data': callback_data,
            }
        )


@method_decorator(csrf_exempt, name='dispatch')
class BilligPurchaseFailureView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        callback_data = request.GET.dict()
        return Response(
            {
                'success': False,
                'message': 'Billig payment failure callback received.',
                'callback_data': callback_data,
            }
        )


@method_decorator(csrf_exempt, name='dispatch')
class BilligDevPayView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        if settings.ENV != Environment.DEV:
            return Response({'error': 'Fake Billig pay is only available in development'}, status=status.HTTP_404_NOT_FOUND)

        membercard, email = BilligService.get_contact_fields(request.data)
        membercard = membercard or None
        email = email or None
        cart_rows: list[tuple[int, int]] = []
        ticket_count = 0

        for key, value in request.data.items():
            if not key.startswith('price_') or not key.endswith('_count'):
                continue
            try:
                price_group_id = int(key[len('price_') : -len('_count')])
                count = int(value)
            except (TypeError, ValueError):
                continue
            if count > 0:
                cart_rows.append((price_group_id, count))
                ticket_count += count

        should_fail = ticket_count == 0 or (email is None and membercard is None)
        failure_message = 'Some error occurred.'
        if email and 'fail' in email.lower():
            should_fail = True
            failure_message = 'Some error occurred.'
        if membercard and membercard.endswith('0000'):
            should_fail = True
            failure_message = 'Some error occurred.'
        if membercard and not membercard.isdigit():
            should_fail = True
            failure_message = 'Some error occurred.'

        if should_fail:
            error_id = BilligService.create_fake_payment_error(
                message=failure_message,
                cart_rows=cart_rows,
                membercard=membercard,
                email=email,
                persist_cart=bool(cart_rows),
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
