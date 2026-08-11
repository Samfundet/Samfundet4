from __future__ import annotations

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, DjangoModelPermissionsOrAnonReadOnly

from django.utils import timezone

from root.constants import WebFeatures
from root.custom_classes.permission_classes import FeatureEnabled

from samfundet.models.general import Menu, Table, MenuItem, Reservation, FoodCategory, FoodPreference
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
    feature_key = WebFeatures.SULTEN
    permission_classes = (
        DjangoModelPermissionsOrAnonReadOnly,
        FeatureEnabled,
    )
    serializer_class = MenuSerializer
    queryset = Menu.objects.all()


class MenuItemView(ModelViewSet):
    feature_key = WebFeatures.SULTEN
    permission_classes = (
        DjangoModelPermissionsOrAnonReadOnly,
        FeatureEnabled,
    )
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all()


class FoodCategoryView(ModelViewSet):
    feature_key = WebFeatures.SULTEN
    permission_classes = (
        DjangoModelPermissionsOrAnonReadOnly,
        FeatureEnabled,
    )
    serializer_class = FoodCategorySerializer
    queryset = FoodCategory.objects.all()


class FoodPreferenceView(ModelViewSet):
    feature_key = WebFeatures.SULTEN
    permission_classes = (
        DjangoModelPermissionsOrAnonReadOnly,
        FeatureEnabled,
    )
    serializer_class = FoodPreferenceSerializer
    queryset = FoodPreference.objects.all()


class TableView(ModelViewSet):
    feature_key = WebFeatures.SULTEN
    permission_classes = (
        DjangoModelPermissionsOrAnonReadOnly,
        FeatureEnabled,
    )
    serializer_class = TableSerializer
    queryset = Table.objects.all()


class ReservationCreateView(CreateAPIView):
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
            available_tables = Reservation.fetch_available_times_for_date(
                slug='lyche',
                seating=serializer.validated_data['guest_count'],
                date=serializer.validated_data['reservation_date'],
            )
            return Response(available_tables, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
