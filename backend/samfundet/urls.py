# imports
from rest_framework import routers

from django.urls import path, include

from . import views
# End: imports -----------------------------------------------------------------

router = routers.DefaultRouter()

urlpatterns = [
    path('api/', include(router.urls)),
    path('api2/test', views.Test.as_view()),
]
