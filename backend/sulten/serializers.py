from root.utils.mixins import CustomBaseSerializer

from sulten.models import (FoodPreference, FoodCategory, MenuItem, Menu)


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
