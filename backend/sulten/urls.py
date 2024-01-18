from sulten import views
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()

router.register('menu', views.MenuView, 'menu')
router.register('menu-items', views.MenuItemView, 'menu_items')
router.register('food-preference', views.FoodPreferenceView, 'food_preference')
router.register('food-category', views.FoodCategoryView, 'food_category')

urlpatterns = [
    path('api/', include(router.urls)),
]
