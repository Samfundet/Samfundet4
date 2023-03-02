from rest_framework.test import APIClient
from rest_framework.status import is_success, HTTP_403_FORBIDDEN
from django.contrib.auth.models import Permission
from guardian.shortcuts import assign_perm
from django.urls import reverse

from samfundet.models import User, Event, InformationPage


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


def test_get_event(fixture_rest_client: APIClient, fixture_user: User, fixture_event: Event):
    # Tests if fetching single event is working
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:events-detail', kwargs={'pk': fixture_event.id})
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)
    assert response.data['title_nb'] == fixture_event.title_nb


def test_get_events(fixture_rest_client: APIClient, fixture_user: User, fixture_event: Event):
    # Tests if event fetch api is working
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:events-list')
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)
    assert response.data[0]['title_nb'] == fixture_event.title_nb


def test_create_event(fixture_rest_client: APIClient, fixture_user: User):
    # Tests if user can not create when they dont have permission, and create if they do
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:events-list')
    data = {'title_nb': 'lol', 'title_en': 'lol', 'start_dt': '2023-02-15T01:01:00+01:00', 'duration': 10}
    response = fixture_rest_client.post(path=url, data=data)
    assert response.status_code == HTTP_403_FORBIDDEN
    assign_perm('samfundet.add_event', fixture_user)
    del fixture_user._user_perm_cache
    del fixture_user._perm_cache
    response = fixture_rest_client.post(path=url, data=data)
    assert is_success(code=response.status_code)


def test_delete_event(fixture_rest_client: APIClient, fixture_user: User, fixture_event: Event):
    # Tests if user can not delete when they dont have permission, and delete if they do
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:events-detail', kwargs={'pk': fixture_event.id})
    response = fixture_rest_client.delete(path=url)
    assert response.status_code == HTTP_403_FORBIDDEN
    assign_perm('samfundet.delete_event', fixture_user)
    del fixture_user._user_perm_cache
    del fixture_user._perm_cache
    response = fixture_rest_client.delete(path=url)
    assert is_success(code=response.status_code)


def test_put_event(fixture_rest_client: APIClient, fixture_user: User, fixture_event: Event):
    # Tests if user can not put when they dont have permission, and put if they do
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:events-detail', kwargs={'pk': fixture_event.id})
    data = {'title_nb': 'lol'}
    response = fixture_rest_client.put(path=url, data=data)
    assert response.status_code == HTTP_403_FORBIDDEN
    assign_perm('samfundet.change_event', fixture_user)
    del fixture_user._user_perm_cache
    del fixture_user._perm_cache
    response = fixture_rest_client.put(path=url, data=data)
    print(response.data)
    assert is_success(code=response.status_code)
    assert response.data['title_nb'] == data['title_nb']


def test_get_informationpage(fixture_rest_client: APIClient, fixture_informationpage: InformationPage):
    # Test for fetching single information page
    url = reverse('samfundet:information-detail', kwargs={'pk': fixture_informationpage.slug_field})
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)
    assert response.data['slug_field'] == fixture_informationpage.slug_field


def test_get_informationpages(fixture_rest_client: APIClient, fixture_informationpage: InformationPage):
    # Test for fetching multiple informationpages
    url = reverse('samfundet:information-list')
    response = fixture_rest_client.get(path=url)
    assert is_success(code=response.status_code)
    assert response.data[0]['slug_field'] == fixture_informationpage.slug_field


def test_create_informationpage(fixture_rest_client: APIClient, fixture_user: User):
    # Tests if user can not create when they dont have permission, and create if they do
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:information-list')
    data = {'slug_field': 'lol', 'title_en': 'lol'}
    response = fixture_rest_client.post(path=url, data=data)
    assert response.status_code == HTTP_403_FORBIDDEN
    assign_perm('samfundet.add_informationpage', fixture_user)
    del fixture_user._user_perm_cache
    del fixture_user._perm_cache
    response = fixture_rest_client.post(path=url, data=data)
    assert is_success(code=response.status_code)


def test_delete_informationpage(fixture_rest_client: APIClient, fixture_user: User, fixture_informationpage: InformationPage):
    # Tests if user can not delete when they dont have permission, and delete if they do
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:information-detail', kwargs={'pk': fixture_informationpage.slug_field})
    response = fixture_rest_client.delete(path=url)
    assert response.status_code == HTTP_403_FORBIDDEN
    assign_perm('samfundet.delete_informationpage', fixture_user)
    del fixture_user._user_perm_cache
    del fixture_user._perm_cache
    response = fixture_rest_client.delete(path=url)
    assert is_success(code=response.status_code)


def test_put_informationpage(fixture_rest_client: APIClient, fixture_user: User, fixture_informationpage: InformationPage):
    # Tests if user can not put when they dont have permission, and put if they do
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse('samfundet:information-detail', kwargs={'pk': fixture_informationpage.slug_field})
    data = {'title_nb': 'lol'}
    response = fixture_rest_client.put(path=url, data=data)
    assert response.status_code == HTTP_403_FORBIDDEN
    assign_perm('samfundet.change_informationpage', fixture_user)
    del fixture_user._user_perm_cache
    del fixture_user._perm_cache
    response = fixture_rest_client.put(path=url, data=data)
    print(response.data)
    assert is_success(code=response.status_code)
    assert response.data['title_nb'] == data['title_nb']
