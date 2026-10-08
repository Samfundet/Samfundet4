from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

from rest_framework import status

from django.urls import reverse

from root.utils import routes

from samfundet.serializers import EventSerializer
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
    @pytest.mark.parametrize('embed', [False, True])
    def test_clone_preserves_youtube_settings(self, fixture_rest_client: APIClient, fixture_event: Event, *, embed: bool):
        fixture_event.youtube_link = 'https://youtu.be/dQw4w9WgXcQ'
        fixture_event.youtube_embed = embed
        fixture_event.save()

        response = fixture_rest_client.get(reverse(routes.samfundet__event_clone, kwargs={'pk': fixture_event.id}))

        assert response.status_code == status.HTTP_200_OK
        assert response.json()['youtube_embed'] is embed
        assert response.json()['youtube_link'] == fixture_event.youtube_link

    def test_clone_returns_only_cloneable_fields(self, fixture_rest_client: APIClient, fixture_event: Event):
        url = reverse(routes.samfundet__event_clone, kwargs={'pk': fixture_event.id})

        response = fixture_rest_client.get(path=url)

        assert response.status_code == status.HTTP_200_OK
        assert set(response.json().keys()) == CLONE_FIELDS

    def test_clone_missing_event_returns_404(self, fixture_rest_client: APIClient):
        url = reverse(routes.samfundet__event_clone, kwargs={'pk': 999_999})

        response = fixture_rest_client.get(path=url)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestEventSocialMedia:
    @pytest.mark.parametrize('embed', [True, False])
    def test_create_event_with_social_media(self, fixture_rest_client: APIClient, fixture_superuser, fixture_event: Event, *, embed: bool):
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        fields = [
            'title_nb',
            'title_en',
            'description_long_nb',
            'description_long_en',
            'description_short_nb',
            'description_short_en',
            'start_dt',
            'end_dt',
            'visibility_from_dt',
            'visibility_to_dt',
            'host',
            'location',
            'age_restriction',
        ]
        payload = {field: getattr(fixture_event, field) for field in fields}
        payload.update(image_id=fixture_event.image_id, youtube_link='https://youtu.be/dQw4w9WgXcQ', youtube_embed=embed)

        response = fixture_rest_client.post(reverse(routes.samfundet__events_list), data=payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED, response.data
        created = Event.objects.get(pk=response.data['id'])
        assert created.youtube_embed is embed
        assert created.youtube_link == payload['youtube_link']
        created.delete()

    def test_embed_defaults_to_false(self, fixture_event: Event):
        assert EventSerializer(fixture_event).data['youtube_embed'] is False

    @pytest.mark.parametrize('embed', [True, False])
    def test_update_embed_setting(self, fixture_event: Event, *, embed: bool):
        serializer = EventSerializer(
            fixture_event,
            data={'youtube_link': 'https://youtu.be/dQw4w9WgXcQ', 'youtube_embed': embed},
            partial=True,
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()
        fixture_event.refresh_from_db()

        assert fixture_event.youtube_embed is embed
        assert fixture_event.youtube_link == 'https://youtu.be/dQw4w9WgXcQ'

    def test_rejects_legacy_embed_url(self, fixture_event: Event):
        serializer = EventSerializer(fixture_event, data={'youtube_embed': 'https://youtu.be/dQw4w9WgXcQ'}, partial=True)
        assert not serializer.is_valid()
        assert 'youtube_embed' in serializer.errors
