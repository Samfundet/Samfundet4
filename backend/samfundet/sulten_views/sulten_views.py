from __future__ import annotations

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, DjangoModelPermissionsOrAnonReadOnly

from django.utils import timezone

from samfundet.models.general import Menu, Table, Venue, MenuItem, Reservation, FoodCategory, FoodPreference
from samfundet.serializer.sulten_serializers import (
    MenuSerializer,
    TableSerializer,
    MenuItemSerializer,
    ReservationSerializer,
    FoodCategorySerializer,
    FoodPreferenceSerializer,
    ReservationCheckSerializer,
)


class MenuView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = MenuSerializer
    queryset = Menu.objects.all()


class MenuItemView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all()


class FoodCategoryView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = FoodCategorySerializer
    queryset = FoodCategory.objects.all()


class FoodPreferenceView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = FoodPreferenceSerializer
    queryset = FoodPreference.objects.all()


class TableView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = TableSerializer
    queryset = Table.objects.all()


class ReservationCreateView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()


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
                        'error_en': 'Unfortunately, reservations must be made at least one day in advance.',
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )
            venue = self.request.query_params.get('venue', Venue.objects.get(slug='lyche').id)
            available_tables = Reservation.fetch_available_times_for_date(
                venue=venue,
                seating=serializer.validated_data['guest_count'],
                date=serializer.validated_data['reservation_date'],
            )
            return Response(available_tables, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
