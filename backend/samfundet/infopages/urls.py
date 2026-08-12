from __future__ import annotations

from rest_framework.routers import DefaultRouter

from django.urls import path, include

from samfundet.infopages.views.admin import AdminInformationPageViewSet
from samfundet.infopages.views.public import PublicInformationPageViewSet

# NOTE: no 'api/' prefix here. This module is included from samfundet/urls.py, which is itself
# mounted under 'api/' in root/urls.py.
public_router = DefaultRouter()
public_router.register('information-pages', PublicInformationPageViewSet, basename='information-pages')

admin_router = DefaultRouter()
admin_router.register('information-pages', AdminInformationPageViewSet, basename='admin-information-pages')

urlpatterns = [
    path('', include(public_router.urls)),
    path('admin/', include(admin_router.urls)),
]
