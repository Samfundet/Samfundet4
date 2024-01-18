from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly

from sulten.models import (Menu, MenuItem, FoodCategory, FoodPreference)
from sulten.serializers import (MenuSerializer, MenuItemSerializer, FoodCategorySerializer, FoodPreferenceSerializer)


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
