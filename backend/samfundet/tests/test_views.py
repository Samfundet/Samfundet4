from rest_framework.test import APIClient
from rest_framework.status import is_success

from django.urls import reverse

from root.utils import routes

from samfundet.models import User


def test_health():
    assert True


def test_csrf(fixture_rest_client: APIClient):
    url = reverse(routes.samfundet__csrf)
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)


def test_login_logout(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_user_pw: str,
):
    url = reverse(routes.samfundet__login)
    response = fixture_rest_client.post(path=url, data={'username': fixture_user.username, 'password': fixture_user_pw})
    assert is_success(code=response.status_code)

    url = reverse(routes.samfundet__logout)
    response = fixture_rest_client.post(path=url)
    assert is_success(code=response.status_code)


def test_user(fixture_rest_client: APIClient, fixture_user: User):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__user)
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)
    assert response.data['username'] == fixture_user.username


def test_users(fixture_rest_client: APIClient, fixture_user: User):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__users)
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)


def test_groups(fixture_rest_client: APIClient, fixture_user: User):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__groups)
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)
