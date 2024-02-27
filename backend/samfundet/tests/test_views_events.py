from __future__ import annotations

from typing import TYPE_CHECKING

from django.urls import reverse
from rest_framework import status
from guardian.shortcuts import assign_perm

from root.utils import routes, permissions

from samfundet.models.event import Event
from samfundet.models.general import (
    User,
    Image,
    Gang,
)
from samfundet.models.model_choices import (EventAgeRestriction, EventCategory, EventStatus)
from samfundet.serializers import UserSerializer

if TYPE_CHECKING:
    from rest_framework.test import APIClient
    from rest_framework.response import Response


class TestEventView:

    def test_get_event(
        self,
        fixture_rest_client: APIClient,
        fixture_event: Event,
    ):
        ### Arrange ###
        url = reverse(routes.samfundet__events_detail, kwargs={'pk': fixture_event.id})

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['id'] == fixture_event.id

    def test_get_events(self, fixture_rest_client: APIClient, fixture_event: Event):
        ### Arrange ###
        url = reverse(routes.samfundet__events_list)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data[0]['id'] == fixture_event.id

    def test_create_event(self, fixture_rest_client: APIClient, fixture_user: User, fixture_gang: Gang, fixture_image: Image):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__events_list)

        post_data = {
            'title_nb': 'Karpe',
            'title_en': 'Karpe',
            'category': EventCategory.CONCERT,
            'status': EventStatus.ACTIVE,
            'age_restriction': EventAgeRestriction.NO_RESTRICTION,
            'description_short_nb': 'description short',
            'description_short_en': 'descriptionshort',
            'location': 'Stortinget',
            'description_long_nb': 'description long',
            'description_long_en': 'description long',
            'host': 'mr president',
            'image': fixture_image.id,
            'start_dt': '2024-01-11T12:00',
            'publish_dt': '2024-01-11T13:00',
            'duration': 60,
            'capacity': 100,
            'editors': [fixture_gang.id]
        }
        response: Response = fixture_rest_client.post(path=url, data=post_data)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_ADD_EVENT, fixture_user)

        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.post(path=url, data=post_data)

        data = response.json()
        assert status.is_success(code=response.status_code)
        assert data['title_nb'] == post_data['title_nb']

        Event.objects.filter(id=data['id']).delete()

    def test_delete_event(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_event: Event,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__events_detail, kwargs={'pk': fixture_event.id})
        response: Response = fixture_rest_client.delete(path=url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_DELETE_EVENT, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.delete(path=url)

        assert status.is_success(code=response.status_code)

    def test_put_event(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_event: Event,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__events_detail, kwargs={'pk': fixture_event.id})
        put_data = {'title_nb': 'Samfundet blir gult!'}
        response: Response = fixture_rest_client.put(path=url, data=put_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        assign_perm(permissions.SAMFUNDET_CHANGE_EVENT, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.put(path=url, data=put_data)

        data = response.json()
        assert status.is_success(code=response.status_code)
        assert data['title_nb'] == put_data['title_nb']
