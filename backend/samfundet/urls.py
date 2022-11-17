# imports
from rest_framework import routers

from django.urls import path, include

from . import views
from .dapps.gangs import views as gang_views
# End: imports -----------------------------------------------------------------

router = routers.DefaultRouter()
router.register('events', views.EventView, 'events')
router.register('venues', views.VenueView, 'venues')

router.register('gangs', gang_views.GangView, 'gangs')

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
