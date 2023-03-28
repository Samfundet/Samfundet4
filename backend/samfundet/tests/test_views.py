from __future__ import annotations

from typing import TYPE_CHECKING

from rest_framework.status import is_success

from django.urls import reverse

from root.utils import routes

from samfundet.models import User

if TYPE_CHECKING:
    from rest_framework.test import APIClient
    from rest_framework.response import Response


def test_health():
    assert True


def test_csrf(fixture_rest_client: APIClient):
    url = reverse(routes.samfundet__csrf)
    response: Response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)


def test_login_logout(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_user_pw: str,
):
    # Login
    url = reverse(routes.samfundet__login)
    data = {'username': fixture_user.username, 'password': fixture_user_pw}
    response: Response = fixture_rest_client.post(path=url, data=data)
    assert is_success(code=response.status_code)

    # Logout
    url = reverse(routes.samfundet__logout)
    response: Response = fixture_rest_client.post(path=url)
    assert is_success(code=response.status_code)


def test_get_user(fixture_rest_client: APIClient, fixture_user: User):
    # Arrange
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__user)

    # Act
    response: Response = fixture_rest_client.get(path=url)
    data = response.json()

    # Assert
    assert is_success(code=response.status_code)
    assert data['username'] == fixture_user.username
    # All users should have a UserPreference.
    assert data['user_preference']['id'] == fixture_user.userpreference.id
    # All users should have a Profile.
    assert data['profile']['id'] == fixture_user.profile.id


def test_get_users(fixture_rest_client: APIClient, fixture_user: User):
    # Arrange
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__users)

    # Act
    response: Response = fixture_rest_client.get(path=url)

    # Assert
    assert is_success(code=response.status_code)


def test_get_groups(fixture_rest_client: APIClient, fixture_user: User):
    # Arrange
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__groups)

    # Act
    response: Response = fixture_rest_client.get(path=url)

    # Assert
    assert is_success(code=response.status_code)
