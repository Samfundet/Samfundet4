# imports
from rest_framework import routers

from django.urls import path, include

from . import views
# End: imports -----------------------------------------------------------------

router = routers.DefaultRouter()
router.register('events', views.EventView, 'events')
router.register('venues', views.VenueView, 'venues')
router.register('gangs', views.GangView, 'gangs')
router.register('information', views.InformationPageView, 'information')
router.register('user-preference', views.UserPreferenceView, 'user_preference')
router.register('profile', views.ProfileView, 'profile')
router.register('menu', views.MenuView, 'menu')
router.register('menu-items', views.MenuItemView, 'menu_items')
router.register('food-preference', views.FoodPreferenceView, 'food_preference')
router.register('food-category', views.FoodCategoryView, 'food_category')

app_name = 'samfundet'

urlpatterns = [
    path('api/', include(router.urls)),
    path('csrf/', views.CsrfView.as_view(), name='csrf'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('groups/', views.AllGroupsView.as_view(), name='groups'),
    path('users/', views.AllUsersView.as_view(), name='users'),
    path('permissions/', views.AllPermissionsView.as_view(), name='permissions'),
]
