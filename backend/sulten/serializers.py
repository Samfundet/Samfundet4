from root.utils.mixins import CustomBaseSerializer
from samfundet.serializers import UserSerializer
from sulten.models import FoodPreference, FoodCategory, MenuItem, Menu, Table, Reservation, Booking
from rest_framework import serializers


class FoodPreferenceSerializer(CustomBaseSerializer):

    class Meta:
        model = FoodPreference
        fields = '__all__'


class FoodCategorySerializer(CustomBaseSerializer):

    class Meta:
        model = FoodCategory
        fields = '__all__'


class MenuItemSerializer(CustomBaseSerializer):
    food_preferences = FoodPreferenceSerializer(many=True)

    class Meta:
        model = MenuItem
        fields = '__all__'


class MenuSerializer(CustomBaseSerializer):
    menu_items = MenuItemSerializer(many=True)

    class Meta:
        model = Menu
        fields = '__all__'


class TableSerializer(CustomBaseSerializer):

    class Meta:
        model = Table
        fields = '__all__'


class ReservationSerializer(CustomBaseSerializer):

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
