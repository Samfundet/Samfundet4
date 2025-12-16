from __future__ import annotations

import pytest

from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from root.constants import WebFeatures
from root.custom_classes.permission_classes import FeatureEnabled

factory = APIRequestFactory()


# Test data
class ImagesView(APIView):
    feature_key = 'images'
    permission_classes = [AllowAny, FeatureEnabled]

    def get(self, request):
        return Response({'ok': True})


class NoViewApi(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'ok': True})


@pytest.fixture
def view():
    return ImagesView.as_view()


@pytest.fixture
def no_key_view():
    return NoViewApi.as_view()


def test_allows_when_feature_enabled(settings, view):
    settings.CP_ENABLED = {WebFeatures.IMAGES}
    response = view(factory.get('/test'))
    assert response.status_code == status.HTTP_200_OK


def test_denies_when_feature_disabled(settings, view):
    settings.CP_ENABLED = set()
    response = view(factory.get('/test'))
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_allows_when_feature_key_missing(settings, no_key_view):
    settings.CP_ENABLED = set()
    response = no_key_view(factory.get('/test'))
    assert response.status_code == status.HTTP_200_OK


def test_toogle_feature(settings, view):
    settings.CP_ENABLED = set()
    response1 = view(factory.get('/test'))
    assert response1.status_code == status.HTTP_403_FORBIDDEN

    settings.CP_ENABLED = {WebFeatures.IMAGES}
    response2 = view(factory.get('/test'))
    assert response2.status_code == status.HTTP_200_OK
