from __future__ import annotations

from typing import TYPE_CHECKING

from django.contrib.auth.models import Permission
from django.urls import reverse
from rest_framework import status

from root.utils import routes
from samfundet.models.general import User, KeyValue, TextItem
from samfundet.serializers import UserSerializer

if TYPE_CHECKING:
    from rest_framework.test import APIClient
    from rest_framework.response import Response


def test_health():
    assert True


def test_csrf(fixture_rest_client: APIClient):
    url = reverse(routes.samfundet__csrf)
    response: Response = fixture_rest_client.get(path=url)
    assert status.is_success(code=response.status_code)


def test_login_logout(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_user_pw: str,
):
    # Login
    url = reverse(routes.samfundet__login)
    data = {'username': fixture_user.username, 'password': fixture_user_pw}
    response: Response = fixture_rest_client.post(path=url, data=data)
    assert status.is_success(code=response.status_code)

    # Logout
    url = reverse(routes.samfundet__logout)
    response: Response = fixture_rest_client.post(path=url)
    assert status.is_success(code=response.status_code)


def test_get_user(fixture_rest_client: APIClient, fixture_user: User):
    ### Arrange ###

    # Give user an arbitrary permission.
    some_perm = Permission.objects.first()
    fixture_user.user_permissions.add(some_perm)
    some_perm_str = UserSerializer._permission_to_str(permission=some_perm)

    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__user)

    ### Act ###
    response: Response = fixture_rest_client.get(path=url)
    data = response.json()

    ### Assert ###
    assert status.is_success(code=response.status_code)
    assert data['username'] == fixture_user.username
    # All users should have a UserPreference.
    assert data['user_preference']['id'] == fixture_user.userpreference.id
    # All users should have a Profile.
    assert data['profile']['id'] == fixture_user.profile.id
    # Check permission in list.
    assert some_perm_str in data['permissions']


def test_get_users(fixture_rest_client: APIClient, fixture_user: User):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__users)

    ### Act ###
    response: Response = fixture_rest_client.get(path=url)

    ### Assert ###
    assert status.is_success(code=response.status_code)


def test_get_groups(fixture_rest_client: APIClient, fixture_user: User):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__groups)

    ### Act ###
    response: Response = fixture_rest_client.get(path=url)

    ### Assert ###
    assert status.is_success(code=response.status_code)


class TestKeyValueView:

    def test_anyone_can_retrieve_keyvalues(self, fixture_rest_client: APIClient):
        ### Arrange ###
        keyvalue = KeyValue.objects.create(key='FOO', value='bar')
        url = reverse(routes.samfundet__key_value_detail, kwargs={'key': keyvalue.key})

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['id'] == keyvalue.id
        assert data['key'] == keyvalue.key
        assert data['value'] == keyvalue.value

    def test_anyone_can_list_keyvalues(self, fixture_rest_client: APIClient):
        ### Arrange ###
        keyvalue = KeyValue.objects.create(key='FOO', value='bar')
        url = reverse(routes.samfundet__key_value_list)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert any([kv['id'] == keyvalue.id for kv in data])

    def test_crud_not_possible(self, fixture_rest_client: APIClient, fixture_superuser: User):
        """Not even superuser can do anything."""
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        create_url = reverse(routes.samfundet__key_value_list)
        detail_url = reverse(routes.samfundet__key_value_detail, kwargs={'key': 'FOO'})

        ### Act ###
        create_response: Response = fixture_rest_client.post(path=create_url)
        put_response: Response = fixture_rest_client.put(path=detail_url)
        patch_response: Response = fixture_rest_client.patch(path=detail_url)
        delete_response: Response = fixture_rest_client.delete(path=detail_url)

        ### Assert ###
        assert create_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        assert put_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        assert patch_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        assert delete_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


class TestTextItemView:

    def test_anyone_can_retrieve_textitems(self, fixture_rest_client: APIClient):
        ### Arrange ###
        textitem = TextItem.objects.create(key='FOO')
        url = reverse(routes.samfundet__text_item_detail, kwargs={'pk': textitem.key})

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['key'] == textitem.key

    def test_anyone_can_list_textitems(self, fixture_rest_client: APIClient):
        ### Arrange ###
        textitem = TextItem.objects.create(key='FOO')
        url = reverse(routes.samfundet__text_item_list)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert any([kv['key'] == textitem.key for kv in data])

    def test_crud_not_possible(self, fixture_rest_client: APIClient, fixture_superuser: User):
        """Not even superuser can do anything."""
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        create_url = reverse(routes.samfundet__text_item_list)
        detail_url = reverse(routes.samfundet__text_item_detail, kwargs={'pk': 'FOO'})

        ### Act ###
        create_response: Response = fixture_rest_client.post(path=create_url)
        put_response: Response = fixture_rest_client.put(path=detail_url)
        patch_response: Response = fixture_rest_client.patch(path=detail_url)
        delete_response: Response = fixture_rest_client.delete(path=detail_url)

        ### Assert ###
        assert create_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        assert put_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        assert patch_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        assert delete_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
