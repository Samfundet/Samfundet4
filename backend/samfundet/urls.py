# imports
from rest_framework import routers

from django.urls import path, include

from . import views
# End: imports -----------------------------------------------------------------

router = routers.DefaultRouter()
router.register('events', views.EventView, 'events')

urlpatterns = [
    path('api/', include(router.urls)),
]
