from rest_framework.test import APIClient
from rest_framework.status import is_success

from django.urls import reverse

from samfundet.models import User, Event


def test_health():
    assert True


def test_csrf(fixture_rest_client: APIClient):
    url = reverse('samfundet:csrf')
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)


def test_login_logout(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_user_pw: str,
):
    url = reverse('samfundet:login')
    response = fixture_rest_client.post(path=url, data={'username': fixture_user.username, 'password': fixture_user_pw})
    assert is_success(code=response.status_code)

    url = reverse('samfundet:logout')
    response = fixture_rest_client.post(path=url)
    assert is_success(code=response.status_code)


def test_user(fixture_rest_client: APIClient, fixture_user: User):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:user')
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)
    assert response.data['username'] == fixture_user.username


def test_users(fixture_rest_client: APIClient, fixture_user: User):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:users')
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)


def test_groups(fixture_rest_client: APIClient, fixture_user: User):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:groups')
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)


def test_event(fixture_rest_client: APIClient, fixture_user: User, fixture_event: Event):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:events-detail', kwargs={'pk': fixture_event.id})
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)


def test_events(fixture_rest_client: APIClient, fixture_user: User, fixture_event: Event):
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:events-list')
    response = fixture_rest_client.get(path=url)
    print(is_success(code=response.status_code), response.status_code)
    assert is_success(code=response.status_code)
