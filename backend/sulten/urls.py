from rest_framework import routers
from django.urls import path, include

from sulten import views

router = routers.DefaultRouter()

router.register('menu', views.MenuView, 'menu')
router.register('menu-items', views.MenuItemView, 'menu_items')
router.register('food-preference', views.FoodPreferenceView, 'food_preference')
router.register('food-category', views.FoodCategoryView, 'food_category')
router.register('booking', views.BookingView, 'booking')
router.register('table', views.TableView, 'table')

urlpatterns = [
    path('api/', include(router.urls)),
    path('check-reservation/', views.ReservationCheckAvailabilityView.as_view(), name='check_reservation'),
]
