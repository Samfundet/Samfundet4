from __future__ import annotations

from rest_framework import serializers

from root.utils.mixins import FullCleanSerializer, CustomBaseSerializer

from samfundet.serializers import UserSerializer
from samfundet.models.general import Menu, Table, Booking, MenuItem, Reservation, FoodCategory, FoodPreference


class TableSerializer(CustomBaseSerializer):
    class Meta:
        model = Table
        fields = '__all__'


class ReservationSerializer(FullCleanSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'


class ReservationCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['guest_count', 'occasion', 'reservation_date']


class BookingSerializer(serializers.ModelSerializer):
    tables = TableSerializer(many=True)
    user = UserSerializer(many=True)

    class Meta:
        model = Booking
        fields = '__all__'


class FoodCategorySerializer(CustomBaseSerializer):
    class Meta:
        model = FoodCategory
        fields = ['id', 'name_nb', 'name_en']


class FoodPreferenceSerializer(CustomBaseSerializer):
    class Meta:
        model = FoodPreference
        fields = '__all__'


class MenuItemSerializer(CustomBaseSerializer):
    food_preferences = FoodPreferenceSerializer(many=True, read_only=True)  # Todo make this work with post
    food_category = FoodCategorySerializer(read_only=True)

    class Meta:
        model = MenuItem
        fields = '__all__'


class MenuSerializer(CustomBaseSerializer):
    menu_items = MenuItemSerializer(many=True)

    class Meta:
        model = Menu
        fields = '__all__'
