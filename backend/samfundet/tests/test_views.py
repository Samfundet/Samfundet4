from rest_framework.test import APIClient
from rest_framework.status import is_success

from django.urls import reverse
from django.contrib.auth.models import User


def test_health():
    assert True


def test_csrf(fixture_rest_client: APIClient):
    url = reverse('samfundet:csrf')
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)


def test_login(fixture_rest_client: APIClient, fixture_user: User):
    url = reverse('samfundet:login')
    response = fixture_rest_client.post(path=url, data={'username': fixture_user.username, 'password': 'Django123'})
    assert is_success(code=response.status_code)

    url = reverse('samfundet:logout')
    response = fixture_rest_client.post(path=url)
    assert is_success(code=response.status_code)


def test_permissions(fixture_rest_client: APIClient, fixture_user: User):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:permissions')
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)
