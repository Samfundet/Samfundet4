from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly, AllowAny
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from samfundet.models.general import Venue
from sulten.models import Menu, MenuItem, FoodCategory, FoodPreference, Table, Reservation, Booking
from sulten.serializers import MenuItemSerializer, MenuSerializer, FoodCategorySerializer, FoodPreferenceSerializer, TableSerializer, \
    ReservationCheckSerializer, \
    BookingSerializer
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone


class MenuView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly, )
    serializer_class = MenuSerializer
    queryset = Menu.objects.all()


class MenuItemView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly, )
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all()


class FoodCategoryView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly, )
    serializer_class = FoodCategorySerializer
    queryset = FoodCategory.objects.all()


class FoodPreferenceView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly, )
    serializer_class = FoodPreferenceSerializer
    queryset = FoodPreference.objects.all()


class TableView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly, )
    serializer_class = TableSerializer
    queryset = Table.objects.all()


class BookingView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly, )
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()


class ReservationCheckAvailabilityView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ReservationCheckSerializer

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['reservation_date'] <= timezone.now().date():
                return Response(
                    {
                        'error_nb': 'Reservasjoner må dessverre opprettes minst én dag i forveien.',
                        'error_en': 'Unfortunately, reservations must be made at least one day in advance.'
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE
                )
            venue = self.request.query_params.get('venue', Venue.objects.get(slug='lyche').id)
            available_tables = Reservation.fetch_available_times_for_date(
                venue=venue,
                seating=serializer.validated_data['guest_count'],
                date=serializer.validated_data['reservation_date'],
            )
            return Response(available_tables, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
