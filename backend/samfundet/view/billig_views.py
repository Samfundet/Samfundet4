from __future__ import annotations

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from root.custom_classes.billig_service import BilligService

from samfundet.serializers import BilligEventSerializer, BilligPriceGroupSerializer, BilligTicketGroupSerializer
from samfundet.models.billig import BilligEvent, BilligPriceGroup, BilligTicketGroup

# These will probably be depricated when we actually connect to Billig.
# They are mainly for aiding in development


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


# logger = logging.getLogger(__name__)


# Billig payment URL
BILLIG_PAYMENT_URL = 'https://billettsalg.samfundet.no/pay'

# Frontend URL for redirects after purchase
FRONTEND_URL = 'https://your-frontend-domain.com'

# Callback URLs to be registered with Billig
BILLIG_CALLBACK_SUCCESS_URL = 'https://your-api-domain.com/api/billig/callback/success/'
BILLIG_CALLBACK_FAILURE_URL = 'https://your-api-domain.com/api/billig/callback/failure/'


###                        ###
###   BILLIG INTEGRATION   ###
###                        ###


class BilligPurchaseView(APIView):
    """
    API view to initiate a Billig ticket purchase.

    This endpoint validates purchase data and returns information needed
    for redirecting to Billig's payment page.

    HTTP Methods:
        POST: Validate and prepare purchase data

    Request Body:
        event_id (int): Billig event ID
        ticket_type (str): 'card' or 'paper'
        price_group_X (int): Number of tickets for price group X
        membercard (str, optional): Member card number (required for card tickets)
        email (str, optional): Email (required for paper tickets)

    Returns:
        200 OK: {
            "success": true,
            "form_data": { ... },
            "payment_url": "https://billettsalg.samfundet.no/pay"
        }
        400 Bad Request: { "error": "Error message" }
    """

    permission_classes = [AllowAny]

    def post(self, request, format=None):
        event_id = request.data.get('event_id')
        if not event_id:
            return Response({'error': 'Missing event_id'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate event
        # can_purchase, reason = BilligService.can_purchase_tickets(event_id)
        # if not can_purchase:
        #     return Response({'error': reason}, status=status.HTTP_400_BAD_REQUEST)

        can_purchase, reason = True, None

        # Validate purchase data
        is_valid, error = BilligService.validate_purchase_data(request.data)
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare purchase data
        form_data = BilligService.prepare_purchase_data(request.data, event_id)

        # TODO: add prod, staging and dev URL to settings
        return Response(
            {
                'success': True,
                'form_data': form_data,
                'payment_url':  # settings.
                BILLIG_PAYMENT_URL,
            }
        )


class BilligEventTicketsView(APIView):
    """
    API view to get ticket information for an event.

    This endpoint returns details about available tickets for an event.

    HTTP Methods:
        GET: Get ticket information for an event

    URL Parameters:
        event_id (int): Billig event ID

    Returns:
        200 OK: List of ticket groups with price groups
        400 Bad Request: { "error": "Error message" }
    """

    permission_classes = [AllowAny]  # Add this line

    def get(self, request, event_id, format=None):
        # Validate event
        can_purchase, reason = BilligService.can_purchase_tickets(event_id)
        if not can_purchase:
            return Response({'error': reason}, status=status.HTTP_400_BAD_REQUEST)

        # Get ticket groups
        ticket_groups = BilligService.get_ticket_groups_for_event(event_id)

        return Response(ticket_groups)


# @method_decorator(csrf_exempt, name='dispatch')
# class BilligPurchaseSuccessView(APIView):
#     """
#     Handle successful Billig ticket purchases.

#     This view handles callbacks from Billig after a successful purchase.
#     It processes the callback and redirects to a frontend success page.

#     HTTP Methods:
#         GET: Handle callback from Billig

#     Query Parameters:
#         tickets (str): Ticket information
#         event_id (int): Billig event ID
#         (other parameters from Billig)

#     Returns:
#         302 Found: Redirect to frontend success page
#     """

#     permission_classes = [AllowAny]

#     def get(self, request, format=None):
#         # Process successful purchase
#         BilligService.process_success_callback(request.GET.dict())

#         # Redirect to frontend success page
#         tickets = request.GET.get('tickets', '')
#         return redirect(f'{settings.FRONTEND_URL}/purchase/success/{tickets}')


# @method_decorator(csrf_exempt, name='dispatch')
# class BilligPurchaseFailureView(APIView):
#     """
#     Handle failed Billig ticket purchases.

#     This view handles callbacks from Billig after a failed purchase.
#     It processes the callback and redirects to a frontend error page.

#     HTTP Methods:
#         GET: Handle callback from Billig

#     Query Parameters:
#         error (str): Error information
#         event_id (int): Billig event ID
#         (other parameters from Billig)

#     Returns:
#         302 Found: Redirect to frontend error page
#     """

#     permission_classes = [AllowAny]

#     def get(self, request, format=None):
#         # Process failed purchase
#         BilligService.process_failure_callback(request.GET.dict())

#         # Redirect to frontend error page
#         error = request.GET.get('error', 'unknown')
#         return redirect(f'{settings.FRONTEND_URL}/purchase/error/{error}')


@method_decorator(csrf_exempt, name='dispatch')
class BilligPurchaseSuccessView(APIView):
    """
    Handle successful Billig ticket purchases.

    This view handles callbacks from Billig after a successful purchase.
    It processes the callback and returns a success response.

    HTTP Methods:
        GET: Handle callback from Billig

    Query Parameters:
        tickets (str): Ticket information
        event_id (int): Billig event ID
        (other parameters from Billig)

    Returns:
        200 OK: {"status": "success", "tickets": [ticket info]}
    """

    permission_classes = [AllowAny]

    def get(self, request, format=None):
        # Process successful purchase
        callback_data = request.GET.dict()
        BilligService.process_success_callback(callback_data)

        # Return success response
        tickets = request.GET.get('tickets', '')
        return Response({'status': 'success', 'tickets': tickets, 'message': 'Purchase completed successfully'}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class BilligPurchaseFailureView(APIView):
    """
    Handle failed Billig ticket purchases.

    This view handles callbacks from Billig after a failed purchase.
    It processes the callback and returns an error response.

    HTTP Methods:
        GET: Handle callback from Billig

    Query Parameters:
        error (str): Error information
        event_id (int): Billig event ID
        (other parameters from Billig)

    Returns:
        400 Bad Request: {"status": "error", "error": [error details]}
    """

    permission_classes = [AllowAny]

    def get(self, request, format=None):
        # Process failed purchase
        callback_data = request.GET.dict()
        BilligService.process_failure_callback(callback_data)

        # Return error response
        error = request.GET.get('error', 'unknown')
        return Response({'status': 'error', 'error': error, 'message': 'Purchase failed'}, status=status.HTTP_400_BAD_REQUEST)
