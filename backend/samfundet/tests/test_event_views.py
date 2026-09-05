from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

from rest_framework import status

from django.urls import reverse

from root.utils import routes

from samfundet.models.event import Event

if TYPE_CHECKING:
    from rest_framework.test import APIClient

CLONE_FIELDS = {
    'id',
    'title_nb',
    'title_en',
    'description_long_nb',
    'description_long_en',
    'description_short_nb',
    'description_short_en',
    'start_dt',
    'end_dt',
    'category',
    'host',
    'location',
    'capacity',
    'age_restriction',
    'ticket_type',
    'custom_tickets',
    'spotify_uri',
    'youtube_link',
    'youtube_embed',
    'facebook_link',
    'soundcloud_link',
    'instagram_link',
    'x_link',
    'lastfm_link',
    'vimeo_link',
    'general_link',
    'image',
    'visibility_from_dt',
    'visibility_to_dt',
}


@pytest.mark.django_db
class TestEventCloneView:
    def test_clone_returns_only_cloneable_fields(self, fixture_rest_client: APIClient, fixture_event: Event):
        url = reverse(routes.samfundet__event_clone, kwargs={'pk': fixture_event.id})

        response = fixture_rest_client.get(path=url)

        assert response.status_code == status.HTTP_200_OK
        assert set(response.json().keys()) == CLONE_FIELDS

    def test_clone_missing_event_returns_404(self, fixture_rest_client: APIClient):
        url = reverse(routes.samfundet__event_clone, kwargs={'pk': 999_999})

        response = fixture_rest_client.get(path=url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
