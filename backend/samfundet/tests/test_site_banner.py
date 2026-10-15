from __future__ import annotations

from typing import TYPE_CHECKING
from datetime import timedelta

from rest_framework import status

from django.urls import reverse
from django.utils import timezone

from root.utils import routes

from samfundet.models.general import User
from samfundet.models.site_banner import SiteBanner

if TYPE_CHECKING:
    from rest_framework.test import APIClient


def banner_payload() -> dict:
    start_at = timezone.now()
    return {
        'text_nb': 'Viktig melding',
        'text_en': 'Important message',
        'url': '/events/',
        'new_tab': False,
        'start_at': start_at.isoformat(),
        'end_at': (start_at + timedelta(hours=1)).isoformat(),
    }


class TestSiteBannerCreate:
    def test_anonymous_user_is_rejected(self, fixture_rest_client: APIClient):
        response = fixture_rest_client.post(reverse(routes.samfundet__site_banners_list), banner_payload())

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert not SiteBanner.objects.exists()

    def test_user_without_permission_is_rejected(self, fixture_rest_client: APIClient, fixture_user: User):
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = fixture_rest_client.post(reverse(routes.samfundet__site_banners_list), banner_payload())

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert not SiteBanner.objects.exists()

    def test_superuser_can_create_banner(self, fixture_rest_client: APIClient, fixture_superuser: User):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        response = fixture_rest_client.post(reverse(routes.samfundet__site_banners_list), banner_payload())

        assert response.status_code == status.HTTP_201_CREATED
        assert SiteBanner.objects.filter(text_nb='Viktig melding', text_en='Important message').exists()

    def test_end_time_must_be_after_start_time(self, fixture_rest_client: APIClient, fixture_superuser: User):
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        payload = banner_payload()
        payload['end_at'] = payload['start_at']

        response = fixture_rest_client.post(reverse(routes.samfundet__site_banners_list), payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()['end_at'] == ['End time must be after start time.']
        assert not SiteBanner.objects.exists()

    def test_end_time_is_required(self, fixture_rest_client: APIClient, fixture_superuser: User):
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        payload = banner_payload()
        del payload['end_at']

        response = fixture_rest_client.post(reverse(routes.samfundet__site_banners_list), payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()['end_at'] == ['This field is required.']
        assert not SiteBanner.objects.exists()
