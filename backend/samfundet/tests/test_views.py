from __future__ import annotations

import time
from typing import TYPE_CHECKING
from datetime import date

import pytest
from guardian.shortcuts import assign_perm

from rest_framework import status

from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import Group, Permission

from root.utils import routes, permissions

from samfundet.serializers import UserSerializer, RegisterSerializer
from samfundet.models.general import (
    Gang,
    User,
    Image,
    Merch,
    Table,
    Venue,
    BlogPost,
    KeyValue,
    TextItem,
    Reservation,
    Organization,
    InformationPage,
)
from samfundet.models.recruitment import (
    Interview,
    Recruitment,
    RecruitmentPosition,
    RecruitmentApplication,
)
from samfundet.models.model_choices import RecruitmentStatusChoices, RecruitmentPriorityChoices

if TYPE_CHECKING:
    from rest_framework.test import APIClient
    from rest_framework.response import Response


def test_health():
    assert True


def test_csrf(fixture_rest_client: APIClient):
    url = reverse(routes.samfundet__csrf)
    response: Response = fixture_rest_client.get(path=url)
    assert status.is_success(code=response.status_code)


class TestUserViews:
    post_data = {
        'username': 'username',
        'email': 'kebab@mail.com',
        'firstname': 'kebab',
        'lastname': 'mannen',
        'phone_number': '48278994',
        'password': 'jeglikerkebab',
    }

    def test_login(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_user_pw: str,
    ):
        url = reverse(routes.samfundet__login)
        data = {'username': fixture_user.username, 'password': fixture_user_pw}
        response: Response = fixture_rest_client.post(path=url, data=data)
        assert status.is_success(code=response.status_code)

    def test_logout(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__logout)
        response: Response = fixture_rest_client.post(path=url)
        assert status.is_success(code=response.status_code)

    def test_get_user(self, fixture_rest_client: APIClient, fixture_user: User):
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

    def test_get_users(self, fixture_rest_client: APIClient, fixture_user: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__users)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)

        ### Assert ###
        assert status.is_success(code=response.status_code)

    def test_get_groups(self, fixture_rest_client: APIClient, fixture_user: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__groups)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)

        ### Assert ###
        assert status.is_success(code=response.status_code)

    def test_register_clean(self, fixture_rest_client: APIClient):
        ### Arrange ###
        url = reverse(routes.samfundet__register)

        ### Act ###
        response: Response = fixture_rest_client.post(path=url, data=self.post_data)

        ### Assert ###
        assert status.is_success(code=response.status_code)

        ### Check if logged inn ###
        url = reverse(routes.samfundet__user)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        # check if user is correct
        assert status.is_success(code=response.status_code)
        assert data['username'] == self.post_data['username']
        assert data['email'] == self.post_data['email']
        assert data['phone_number'] == self.post_data['phone_number']

    def test_register_missingfields(self, fixture_rest_client: APIClient):
        ### Arrange ###
        url = reverse(routes.samfundet__register)
        ### Act ###
        for field in self.post_data:
            post_data_copy = self.post_data.copy()
            post_data_copy.pop(field)
            response: Response = fixture_rest_client.post(path=url, data=post_data_copy)
            data = response.json()
            assert status.is_client_error(code=response.status_code)
            assert field in data
            assert 'This field is required.' in data[field]

    def test_register_wrongphonenumber(self, fixture_rest_client: APIClient):
        ### Arrange ###
        url = reverse(routes.samfundet__register)

        invalidphonenumbers = [
            '1',
            '+9932420',
            'thecakeisalie',
            '48278994)191',
            '482789k4',
            '48278994d',
        ]
        ### Act ###
        post_data_copy = self.post_data.copy()
        for value in invalidphonenumbers:
            post_data_copy['phone_number'] = value
            response: Response = fixture_rest_client.post(path=url, data=post_data_copy)
            data = response.json()
            assert status.is_client_error(code=response.status_code)
            assert 'phone_number' in data
            assert 'This value does not match the required pattern.' in data['phone_number']

    def test_user_alreadyexists(self, fixture_rest_client: APIClient):
        ### Arrange ###
        url = reverse(routes.samfundet__register)

        post_data2 = {
            'username': 'username2',
            'email': 'kebab2@mail.com',
            'phone_number': '48278995',
            'firstname': 'kebab',
            'lastname': 'mannen',
            'password': 'jeglikerkebab',
        }

        ### Assert ###
        response: Response = fixture_rest_client.post(path=url, data=self.post_data)
        assert status.is_success(code=response.status_code)

        unique_fields = ['username', 'email', 'phone_number']
        # Test for each field
        for field in unique_fields:
            post_data2_copy = post_data2.copy()
            post_data2_copy[field] = self.post_data[field]
            response: Response = fixture_rest_client.post(path=url, data=post_data2_copy)
            data = response.json()
            assert status.is_client_error(code=response.status_code)
            assert RegisterSerializer.ALREADY_EXISTS_MESSAGE in data[field]


class TestInformationPagesView:
    def test_get_informationpage(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_informationpage: InformationPage,
    ):
        ### Arrange ###
        url = reverse(
            routes.samfundet__information_detail,
            kwargs={'pk': fixture_informationpage.slug_field},
        )

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['slug_field'] == fixture_informationpage.slug_field

    def test_get_informationpages(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_informationpage: InformationPage,
    ):
        ### Arrange ###
        url = reverse(routes.samfundet__information_list)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data[0]['slug_field'] == fixture_informationpage.slug_field

    def test_create_informationpage(self, fixture_rest_client: APIClient, fixture_user: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__information_list)

        post_data = {'slug_field': 'lol', 'title_en': 'lol'}
        response: Response = fixture_rest_client.post(path=url, data=post_data)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_ADD_INFORMATIONPAGE, fixture_user)

        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.post(path=url, data=post_data)
        assert status.is_success(code=response.status_code)

        data = response.json()
        assert data['slug_field'] == post_data['slug_field']

    def test_delete_informationpage(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(
            routes.samfundet__information_detail,
            kwargs={'pk': fixture_informationpage.slug_field},
        )
        response: Response = fixture_rest_client.delete(path=url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_DELETE_INFORMATIONPAGE, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.delete(path=url)

        assert status.is_success(code=response.status_code)

    def test_put_informationpage(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(
            routes.samfundet__information_detail,
            kwargs={'pk': fixture_informationpage.slug_field},
        )
        put_data = {'title_nb': 'lol'}
        response: Response = fixture_rest_client.put(path=url, data=put_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        assign_perm(permissions.SAMFUNDET_CHANGE_INFORMATIONPAGE, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.put(path=url, data=put_data)
        assert status.is_success(code=response.status_code)

        data = response.json()

        assert data['title_nb'] == put_data['title_nb']


class TestMerchView:
    def test_get_merch(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_merch: Merch,
    ):
        ### Arrange ###
        url = reverse(routes.samfundet__merch_detail, kwargs={'pk': fixture_merch.id})

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['id'] == fixture_merch.id

    def test_get_merchs(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_merch: BlogPost,
    ):
        ### Arrange ###
        url = reverse(routes.samfundet__merch_list)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data[0]['id'] == fixture_merch.id

    def test_create_merch(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_image: Image,
    ):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__merch_list)

        post_data = {
            'name_nb': 'Beanie',
            'name_en': 'Beanie',
            'description_en': 'For a beanie boy',
            'description_nb': 'Beanie Boy trenger en beanie',
            'base_price': 69,
            'image': fixture_image.id,
        }
        response: Response = fixture_rest_client.post(path=url, data=post_data)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_ADD_MERCH, fixture_user)

        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.post(path=url, data=post_data)
        assert status.is_success(code=response.status_code)

        data = response.json()
        assert data['name_nb'] == post_data['name_nb']
        Merch.objects.get(id=data['id']).delete()

    def test_delete_merch(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_merch: Merch,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__merch_detail, kwargs={'pk': fixture_merch.id})
        response: Response = fixture_rest_client.delete(path=url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_DELETE_MERCH, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.delete(path=url)

        assert status.is_success(code=response.status_code)

    def test_put_merch(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_merch: Merch,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__merch_detail, kwargs={'pk': fixture_merch.id})
        put_data = {'name_nb': 'Apple bottom jeans'}
        response: Response = fixture_rest_client.put(path=url, data=put_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        assign_perm(permissions.SAMFUNDET_CHANGE_MERCH, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.put(path=url, data=put_data)
        assert status.is_success(code=response.status_code)

        data = response.json()

        assert data['name_nb'] == put_data['name_nb']


class TestVersionModel:
    """Test simple model which uses CustomBaseModel"""

    def test_created_by(self, fixture_rest_client: APIClient, fixture_user: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        assign_perm(permissions.SAMFUNDET_ADD_TAG, fixture_user)
        url = reverse(routes.samfundet__tags_list)
        post_data = {'name': 'name'}

        ### Act ###
        response: Response = fixture_rest_client.post(path=url, data=post_data)
        data = response.json()
        assert data['created_by'] == fixture_user.__str__()

    def test_updated_and_created_at(self, fixture_rest_client: APIClient, fixture_user: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        assign_perm(permissions.SAMFUNDET_ADD_TAG, fixture_user)
        assign_perm(permissions.SAMFUNDET_CHANGE_TAG, fixture_user)
        url = reverse(routes.samfundet__tags_list)
        post_data = {'name': 'name'}

        ### Act Create ###
        response: Response = fixture_rest_client.post(path=url, data=post_data)
        data = response.json()
        assert status.is_success(code=response.status_code)
        assert data['created_at'] == data['updated_at']

        post_data = {'name': 'name2'}
        ### Act Update ###
        time.sleep(1)
        url = reverse(routes.samfundet__tags_detail, kwargs={'pk': data['id']})
        response: Response = fixture_rest_client.put(path=url, data=post_data)

        data = response.json()
        assert status.is_success(code=response.status_code)
        assert data['created_at'] != data['updated_at']

    def test_updated_and_created_by(self, fixture_rest_client: APIClient, fixture_user: User, fixture_user2: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        assign_perm(permissions.SAMFUNDET_ADD_TAG, fixture_user)
        url = reverse(routes.samfundet__tags_list)
        post_data = {'name': 'name'}

        ### Act Create ###
        response: Response = fixture_rest_client.post(path=url, data=post_data)
        data = response.json()
        assert status.is_success(code=response.status_code)

        ### Act Update ###
        fixture_rest_client.logout()
        fixture_rest_client.force_authenticate(user=fixture_user2)
        assign_perm(permissions.SAMFUNDET_CHANGE_TAG, fixture_user2)
        url = reverse(routes.samfundet__tags_detail, kwargs={'pk': data['id']})
        response: Response = fixture_rest_client.put(path=url, data=post_data)

        data = response.json()
        assert status.is_success(code=response.status_code)

        assert data['created_by'] != data['updated_by']
        assert data['created_by'] == fixture_user.__str__()
        assert data['updated_by'] == fixture_user2.__str__()


class TestBlogPostView:
    def test_get_blogpost(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_blogpost: BlogPost,
    ):
        ### Arrange ###
        url = reverse(routes.samfundet__blog_detail, kwargs={'pk': fixture_blogpost.id})

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['id'] == fixture_blogpost.id

    def test_get_blogposts(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_blogpost: BlogPost,
    ):
        ### Arrange ###
        url = reverse(routes.samfundet__blog_list)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data[0]['id'] == fixture_blogpost.id

    def test_create_blogpost(self, fixture_rest_client: APIClient, fixture_user: User, fixture_image: Image):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__blog_list)

        post_data = {'title_nb': 'lol', 'title_en': 'lol', 'image': fixture_image.id}
        response: Response = fixture_rest_client.post(path=url, data=post_data)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_ADD_BLOGPOST, fixture_user)

        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.post(path=url, data=post_data)
        assert status.is_success(code=response.status_code)

        data = response.json()
        assert data['title_nb'] == post_data['title_nb']

    def test_delete_blogpost(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_blogpost: BlogPost,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__blog_detail, kwargs={'pk': fixture_blogpost.id})
        response: Response = fixture_rest_client.delete(path=url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_DELETE_BLOGPOST, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.delete(path=url)

        assert status.is_success(code=response.status_code)

    def test_put_blogpost(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_blogpost: BlogPost,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__blog_detail, kwargs={'pk': fixture_blogpost.id})
        put_data = {'title_nb': 'Samfundet blir gult!'}
        response: Response = fixture_rest_client.put(path=url, data=put_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        assign_perm(permissions.SAMFUNDET_CHANGE_BLOGPOST, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.put(path=url, data=put_data)
        assert status.is_success(code=response.status_code)

        data = response.json()

        assert data['title_nb'] == put_data['title_nb']


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
        assert any(kv['id'] == keyvalue.id for kv in data)

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
    def test_anyone_can_retrieve_textitems(self, fixture_rest_client: APIClient, fixture_text_item: TextItem):
        ### Arrange ###
        url = reverse(routes.samfundet__text_item_detail, kwargs={'pk': fixture_text_item.key})

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['key'] == fixture_text_item.key

    def test_anyone_can_list_textitems(self, fixture_rest_client: APIClient, fixture_text_item: TextItem):
        ### Arrange ###
        url = reverse(routes.samfundet__text_item_list)

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert any(kv['key'] == fixture_text_item.key for kv in data)

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


class TestAssignGroupView:
    def test_assign_group(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_user: User,
    ):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        url = reverse(routes.samfundet__assign_group)
        group = Group.objects.create(name='test_group')
        data = {'group_name': group.name, 'username': fixture_user.username}

        ### Act ###
        response: Response = fixture_rest_client.post(path=url, data=data)

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert group in fixture_user.groups.all()

    def test_remove_group(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_user: User,
    ):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        url = reverse(routes.samfundet__assign_group)
        group = Group.objects.create(name='test_group')
        fixture_user.groups.add(group)
        data = {'group_name': group.name, 'username': fixture_user.username}

        ### Act ###
        response: Response = fixture_rest_client.delete(path=url, data=data)

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert group not in fixture_user.groups.all()

    def test_assign_group_not_possible(self, fixture_rest_client: APIClient, fixture_user: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__assign_group)
        group = Group.objects.create(name='test_group')
        data = {'group_name': group.name, 'username': fixture_user.username}

        ### Act ###
        response: Response = fixture_rest_client.post(path=url, data=data)

        ### Assert ###
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_remove_group_not_possible(self, fixture_rest_client: APIClient, fixture_user: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__assign_group)
        group = Group.objects.create(name='test_group')
        fixture_user.groups.add(group)
        data = {'group_name': group.name, 'username': fixture_user.username}

        ### Act ###
        response: Response = fixture_rest_client.post(path=url, data=data)

        ### Assert ###
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_assign_group_not_found(self, fixture_rest_client: APIClient, fixture_superuser: User):
        ### Arrange ###
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        url = reverse(routes.samfundet__assign_group)
        data = {'group_name': 'test_group', 'username': 'test_user'}

        ### Act ###
        response: Response = fixture_rest_client.post(path=url, data=data)

        ### Assert ###
        assert response.status_code == status.HTTP_404_NOT_FOUND


# =============================== #
#            Recruitment          #
# =============================== #


def test_get_recruitments(
    fixture_rest_client: APIClient,
    fixture_superuser: User,
    fixture_recruitment: Recruitment,
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_superuser)
    url = reverse(routes.samfundet__recruitment_list)

    ### Act ###
    response = fixture_rest_client.get(url)

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['name_nb'] == fixture_recruitment.name_nb


def test_get_recruitment_positions(
    fixture_rest_client: APIClient,
    fixture_superuser: User,
    fixture_recruitment_position: RecruitmentPosition,
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_superuser)
    url = reverse(routes.samfundet__recruitment_position_list)

    ### Act ###
    response = fixture_rest_client.get(url)

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['name_nb'] == fixture_recruitment_position.name_nb


def test_recruitment_positions_per_recruitment(
    fixture_rest_client: APIClient,
    fixture_superuser: User,
    fixture_recruitment: Recruitment,
    fixture_recruitment_position: RecruitmentPosition,
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_superuser)
    url = reverse(routes.samfundet__recruitment_positions)

    ### Act ###
    response: Response = fixture_rest_client.get(path=url, data={'recruitment': fixture_recruitment.id})

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['name_nb'] == fixture_recruitment_position.name_nb


def test_get_applicants_without_interviews(
    fixture_rest_client: APIClient,
    fixture_superuser: User,
    fixture_recruitment: Recruitment,
    fixture_user: User,
    fixture_recruitment_application: RecruitmentApplication,
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_superuser)
    url = reverse(
        routes.samfundet__applicants_without_interviews,
        kwargs={'pk': fixture_recruitment.id},
    )

    ### Act ###
    response: Response = fixture_rest_client.get(path=url, data={'recruitment': fixture_recruitment.id})

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['id'] == fixture_user.id
    assert response.data[0]['first_name'] == fixture_user.first_name
    assert response.data[0]['last_name'] == fixture_user.last_name
    assert response.data[0]['email'] == fixture_user.email


def test_get_applicants_without_interviews_when_interview_is_set(
    fixture_rest_client: APIClient,
    fixture_superuser: User,
    fixture_recruitment: Recruitment,
    fixture_user: User,
    fixture_recruitment_application: RecruitmentApplication,
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_superuser)
    url = reverse(
        routes.samfundet__applicants_without_interviews,
        kwargs={'pk': fixture_recruitment.id},
    )

    fixture_recruitment_application.interview = Interview.objects.create(interview_time=timezone.now(), interview_location='Stallen')
    fixture_recruitment_application.save()

    assert fixture_recruitment_application.interview is not None
    ### Act ###
    response: Response = fixture_rest_client.get(path=url, data={'recruitment': fixture_recruitment.id})

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 0


def test_recruitment_application_for_applicant(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_recruitment_application: RecruitmentApplication,
    fixture_recruitment: Recruitment,
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__recruitment_applications_for_applicant_list)

    ### Act ###
    response: Response = fixture_rest_client.get(path=url, data={'recruitment': fixture_recruitment.id})

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    # Assert the returned data based on the logic in the view
    assert len(response.data) == 1
    assert response.data[0]['application_text'] == fixture_recruitment_application.application_text
    assert response.data[0]['recruitment_position']['id'] == fixture_recruitment_application.recruitment_position.id


def test_post_application(
    fixture_rest_client: APIClient, fixture_user: User, fixture_recruitment: Recruitment, fixture_recruitment_position: RecruitmentPosition
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(
        routes.samfundet__recruitment_applications_for_applicant_detail,
        kwargs={'pk': fixture_recruitment_position.id},
    )
    post_data = {'application_text': 'test_text'}
    ### Act ###
    response: Response = fixture_rest_client.put(path=url, data=post_data)

    ### Assert ###
    assert response.data['application_text'] == post_data['application_text']
    assert response.status_code == status.HTTP_201_CREATED
    # Assert the returned data based on the logic in the view


def test_update_application(
    fixture_rest_client: APIClient, fixture_user: User, fixture_recruitment: Recruitment, fixture_recruitment_position: RecruitmentPosition
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(
        routes.samfundet__recruitment_applications_for_applicant_detail,
        kwargs={'pk': fixture_recruitment_position.id},
    )
    ### Act Send create ###
    post_data1 = {'application_text': 'I love samf!'}
    response: Response = fixture_rest_client.put(path=url, data=post_data1)
    ### Assert ###
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['application_text'] == post_data1['application_text']
    ### Act 2 Send update ###
    post_data2 = {'application_text': 'No i really love samf!'}
    response: Response = fixture_rest_client.put(path=url, data=post_data2)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['application_text'] == post_data2['application_text']
    # Assert the returned data based on the logic in the view


def test_reservation_clean(
    fixture_rest_client: APIClient,
    fixture_venue: Venue,
    fixture_table: Table,
    fixture_date_monday: date,
):
    url = reverse(routes.samfundet__reservation_create)
    data = {'reservation_date': fixture_date_monday.strftime('%Y-%m-%d'), 'venue': fixture_venue.slug, 'guest_count': 3, 'start_time': '10:00'}
    response: Response = fixture_rest_client.post(path=url, data=data)
    assert status.is_success(code=response.status_code)
    Reservation.objects.first().delete()


def test_reservation_double_booked(
    fixture_rest_client: APIClient,
    fixture_venue: Venue,
    fixture_table: Table,
    fixture_date_monday: date,
):
    url = reverse(routes.samfundet__reservation_create)
    data = {'reservation_date': fixture_date_monday.strftime('%Y-%m-%d'), 'venue': fixture_venue.slug, 'guest_count': 3, 'start_time': '10:00'}
    response: Response = fixture_rest_client.post(path=url, data=data)
    assert status.is_success(code=response.status_code)

    response: Response = fixture_rest_client.post(path=url, data=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    Reservation.objects.first().delete()


def test_reservation_end_before_start(
    fixture_rest_client: APIClient,
    fixture_venue: Venue,
    fixture_table: Table,
    fixture_date_monday: date,
):
    url = reverse(routes.samfundet__reservation_create)
    data = {
        'reservation_date': fixture_date_monday.strftime('%Y-%m-%d'),
        'venue': fixture_venue.slug,
        'guest_count': 3,
        'end_time': '09:00',
        'start_time': '10:00',
    }
    response: Response = fixture_rest_client.post(path=url, data=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_update_application_recruiter_priority_gang(
    fixture_rest_client: APIClient, fixture_user: User, fixture_user2: User, fixture_recruitment_application: RecruitmentApplication
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user2)
    fixture_recruitment_application.user = fixture_user2
    fixture_recruitment_application.save()
    url = reverse(
        routes.samfundet__recruitment_application_update_state_gang,
        kwargs={'pk': fixture_recruitment_application.id},
    )
    ### Assert pre condition ###
    assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_SET
    # Will assert this will crash when permissions are implemented
    ### Act 1 Send update NOT_WANTED ###
    post_data = {'recruiter_priority': RecruitmentPriorityChoices.NOT_WANTED}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_WANTED
    ### Act 2 Send update NOT_WANTED ###
    post_data = {'recruiter_priority': RecruitmentPriorityChoices.RESERVE}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.RESERVE
    ### Act 3 Send update WANTED ###
    post_data = {'recruiter_priority': RecruitmentPriorityChoices.WANTED}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.WANTED
    ### Act 4 Send update not a choices ###
    post_data = {'recruiter_priority': (99, 'lol')}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_update_application_recruiter_status_gang(
    fixture_rest_client: APIClient, fixture_user: User, fixture_user2: User, fixture_recruitment_application: RecruitmentApplication
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user2)
    fixture_recruitment_application.user = fixture_user2
    fixture_recruitment_application.save()
    url = reverse(
        routes.samfundet__recruitment_application_update_state_gang,
        kwargs={'pk': fixture_recruitment_application.id},
    )
    ### Assert pre condition ###
    assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
    # Will assert this will crash when permissions are implemented
    ### Act 1 Send update NOT_WANTED ###
    post_data = {'recruiter_status': RecruitmentStatusChoices.CALLED_AND_ACCEPTED}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_ACCEPTED
    ### Act 2 Send update NOT_WANTED ###
    post_data = {'recruiter_status': RecruitmentStatusChoices.CALLED_AND_REJECTED}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_REJECTED
    ### Act 3 Send update WANTED ###
    post_data = {'recruiter_status': RecruitmentStatusChoices.AUTOMATIC_REJECTION}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION
    ### Act 4 Send update not a choices ###
    post_data = {'recruiter_priority': (99, 'lol')}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_update_application_recruiter_priority_position(
    fixture_rest_client: APIClient, fixture_user: User, fixture_user2: User, fixture_recruitment_application: RecruitmentApplication
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user2)
    fixture_recruitment_application.user = fixture_user2
    fixture_recruitment_application.save()
    url = reverse(
        routes.samfundet__recruitment_application_update_state_position,
        kwargs={'pk': fixture_recruitment_application.id},
    )
    ### Assert pre condition ###
    assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_SET
    # Will assert this will crash when permissions are implemented
    ### Act 1 Send update NOT_WANTED ###
    post_data = {'recruiter_priority': RecruitmentPriorityChoices.NOT_WANTED}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_WANTED
    ### Act 2 Send update NOT_WANTED ###
    post_data = {'recruiter_priority': RecruitmentPriorityChoices.RESERVE}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.RESERVE
    ### Act 3 Send update WANTED ###
    post_data = {'recruiter_priority': RecruitmentPriorityChoices.WANTED}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.WANTED
    ### Act 4 Send update not a choices ###
    post_data = {'recruiter_priority': (99, 'lol')}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_update_application_recruiter_status_position(
    fixture_rest_client: APIClient, fixture_user: User, fixture_user2: User, fixture_recruitment_application: RecruitmentApplication
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user2)
    fixture_recruitment_application.user = fixture_user2
    fixture_recruitment_application.save()
    url = reverse(
        routes.samfundet__recruitment_application_update_state_position,
        kwargs={'pk': fixture_recruitment_application.id},
    )
    ### Assert pre condition ###
    assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
    # Will assert this will crash when permissions are implemented
    ### Act 1 Send update NOT_WANTED ###
    post_data = {'recruiter_status': RecruitmentStatusChoices.CALLED_AND_ACCEPTED}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_ACCEPTED
    ### Act 2 Send update NOT_WANTED ###
    post_data = {'recruiter_status': RecruitmentStatusChoices.CALLED_AND_REJECTED}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_REJECTED
    ### Act 3 Send update WANTED ###
    post_data = {'recruiter_status': RecruitmentStatusChoices.AUTOMATIC_REJECTION}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_200_OK
    fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
    assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION
    ### Act 4 Send update not a choices ###
    post_data = {'recruiter_priority': (99, 'lol')}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_withdraw_application(fixture_rest_client: APIClient, fixture_user: User, fixture_recruitment_position: RecruitmentPosition):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)

    # Cant withdraw if not applied
    url = reverse(
        routes.samfundet__recruitment_withdraw_application,
        kwargs={'pk': fixture_recruitment_position.id},
    )
    response: Response = fixture_rest_client.put(path=url)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    ### Act Send create ###
    url = reverse(
        routes.samfundet__recruitment_applications_for_applicant_detail,
        kwargs={'pk': fixture_recruitment_position.id},
    )
    post_data1 = {'application_text': 'I love samf!'}
    response: Response = fixture_rest_client.put(path=url, data=post_data1)
    ### Assert Created ###
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['application_text'] == post_data1['application_text']
    assert response.data['withdrawn'] is False

    ### Act 2 Send withdrawal ###
    url = reverse(
        routes.samfundet__recruitment_withdraw_application,
        kwargs={'pk': fixture_recruitment_position.id},
    )
    response: Response = fixture_rest_client.put(path=url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['withdrawn'] is True


def test_withdraw_application_recruiter(fixture_rest_client: APIClient, fixture_user: User, fixture_recruitment_application: RecruitmentApplication):
    # TODO Add Permissions tests later for this
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)

    # check if not originally withdrawn
    assert not fixture_recruitment_application.withdrawn

    ### Act 2 Send withdrawal ###
    url = reverse(
        routes.samfundet__recruitment_withdraw_application_recruiter,
        kwargs={'pk': fixture_recruitment_application.id},
    )
    response: Response = fixture_rest_client.put(path=url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['withdrawn'] is True
    assert RecruitmentApplication.objects.get(pk=fixture_recruitment_application.id)


def test_post_application_overflow(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_recruitment: Recruitment,
    fixture_recruitment_position: RecruitmentPosition,
    fixture_recruitment_position2: RecruitmentPosition,
):
    ### Arrange ###
    fixture_recruitment.max_applications = 1
    fixture_recruitment.save()
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(
        routes.samfundet__recruitment_applications_for_applicant_detail,
        kwargs={'pk': fixture_recruitment_position.id},
    )

    post_data = {'application_text': 'test_text'}
    ### Act ###
    response: Response = fixture_rest_client.put(path=url, data=post_data)

    ### Assert ###
    assert response.data['application_text'] == post_data['application_text']
    assert response.status_code == status.HTTP_201_CREATED
    # Assert the returned data based on the logic in the view

    # Test then for too many applications for user
    url = reverse(
        routes.samfundet__recruitment_applications_for_applicant_detail,
        kwargs={'pk': fixture_recruitment_position2.id},
    )
    ### Act ###
    response2: Response = fixture_rest_client.put(path=url, data=post_data)
    ### Assert ###
    assert response2.status_code == status.HTTP_400_BAD_REQUEST
    assert RecruitmentApplication.TOO_MANY_APPLICATIONS_ERROR in response2.data['recruitment']


def test_post_recruitment_reapply_overflow(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_recruitment: Recruitment,
    fixture_recruitment_position: RecruitmentPosition,
    fixture_recruitment_position2: RecruitmentPosition,
):
    ### Arrange ###
    fixture_recruitment.max_applications = 1
    fixture_recruitment.save()
    fixture_rest_client.force_authenticate(user=fixture_user)
    # Send first application
    url = reverse(
        routes.samfundet__recruitment_applications_for_applicant_detail,
        kwargs={'pk': fixture_recruitment_position.id},
    )
    post_data = {'application_text': 'test_text'}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_201_CREATED

    # Withdraw first application
    url_withdraw = reverse(
        routes.samfundet__recruitment_withdraw_application,
        kwargs={'pk': fixture_recruitment_position.id},
    )
    response: Response = fixture_rest_client.put(path=url_withdraw)
    assert response.status_code == status.HTTP_200_OK

    ### Send next application
    url = reverse(
        routes.samfundet__recruitment_applications_for_applicant_detail,
        kwargs={'pk': fixture_recruitment_position2.id},
    )
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_201_CREATED

    ## Reapply the first application
    url = reverse(
        routes.samfundet__recruitment_applications_for_applicant_detail,
        kwargs={'pk': fixture_recruitment_position.id},
    )
    post_data = {'application_text': 'test_text'}
    response: Response = fixture_rest_client.put(path=url, data=post_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    # Add check of error when reapply endpoint is added


def test_recruitment_application_update_pri_up(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_recruitment_application: RecruitmentApplication,
    fixture_recruitment_application2: RecruitmentApplication,
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)
    assert fixture_recruitment_application.applicant_priority == 1
    assert fixture_recruitment_application2.applicant_priority == 2

    url = reverse(
        routes.samfundet__recruitment_user_priority_update,
        kwargs={'pk': fixture_recruitment_application2.id},
    )

    ### Act ###
    response: Response = fixture_rest_client.put(path=url, data={'direction': 1})

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    # Assert the returned data based on the logic in the view
    assert len(response.data) == 2
    assert response.data[0]['id'] == str(fixture_recruitment_application2.pk)
    assert response.data[0]['applicant_priority'] == 1
    assert response.data[1]['id'] == str(fixture_recruitment_application.pk)
    assert response.data[1]['applicant_priority'] == 2


def test_recruitment_application_update_pri_down(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_recruitment_application: RecruitmentApplication,
    fixture_recruitment_application2: RecruitmentApplication,
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)
    assert fixture_recruitment_application.applicant_priority == 1
    assert fixture_recruitment_application2.applicant_priority == 2

    url = reverse(
        routes.samfundet__recruitment_user_priority_update,
        kwargs={'pk': fixture_recruitment_application.id},
    )

    ### Act ###
    response: Response = fixture_rest_client.put(path=url, data={'direction': -1})

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    # Assert the returned data based on the logic in the view
    assert len(response.data) == 2
    assert response.data[0]['id'] == str(fixture_recruitment_application2.pk)
    assert response.data[0]['applicant_priority'] == 1
    assert response.data[1]['id'] == str(fixture_recruitment_application.pk)
    assert response.data[1]['applicant_priority'] == 2


@pytest.mark.django_db
class TestPositionByTagsView:
    @pytest.fixture
    def base_url(self, fixture_recruitment: Recruitment) -> str:
        """Get base URL for the tags endpoint"""
        return reverse('samfundet:recruitment_positions_by_tags', kwargs={'id': fixture_recruitment.id})

    @pytest.fixture
    def authenticated_client(self, fixture_rest_client: APIClient, fixture_user: User) -> APIClient:
        """Get an authenticated client"""
        fixture_rest_client.force_authenticate(user=fixture_user)
        return fixture_rest_client

    def create_position(
        self,
        name: str,
        tags: str,
        recruitment: Recruitment,
        gang: Gang,
    ) -> RecruitmentPosition:
        """Helper to create a recruitment position with default values"""
        return RecruitmentPosition.objects.create(
            name_nb=f'Position {name}',
            name_en=f'Position {name}',
            short_description_nb=f'Short desc {name}',
            short_description_en=f'Short desc {name}',
            long_description_nb=f'Long desc {name}',
            long_description_en=f'Long desc {name}',
            is_funksjonaer_position=False,
            default_application_letter_nb=f'Default letter {name}',
            default_application_letter_en=f'Default letter {name}',
            tags=tags,
            recruitment=recruitment,
            gang=gang,
        )

    def test_no_tags_parameter(self, authenticated_client: APIClient, base_url: str):
        """Test that requests without tags parameter return 400"""
        response = authenticated_client.get(base_url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['message'] == 'No tags provided in query parameters'

    def test_empty_tags_string(self, authenticated_client: APIClient, base_url: str):
        """Test that empty tags string returns 400"""
        response = authenticated_client.get(f'{base_url}?tags=')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_matching_single_tag(
        self,
        authenticated_client: APIClient,
        base_url: str,
        fixture_recruitment: Recruitment,
        fixture_gang: Gang,
    ):
        """Test finding positions with a single matching tag"""
        pos1 = self.create_position('1', 'developer,python', fixture_recruitment, fixture_gang)
        self.create_position('2', 'designer,ui', fixture_recruitment, fixture_gang)

        response = authenticated_client.get(f'{base_url}?tags=python')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['positions'][0]['id'] == pos1.id

    def test_matching_multiple_tags(
        self,
        authenticated_client: APIClient,
        base_url: str,
        fixture_recruitment: Recruitment,
        fixture_gang: Gang,
    ):
        """Test finding positions with multiple matching tags (OR operation)"""
        pos1 = self.create_position('1', 'developer,python', fixture_recruitment, fixture_gang)
        pos2 = self.create_position('2', 'designer,python', fixture_recruitment, fixture_gang)

        response = authenticated_client.get(f'{base_url}?tags=python,designer')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2
        assert {pos['id'] for pos in response.data['positions']} == {pos1.id, pos2.id}

    def test_case_insensitive_tag_matching(
        self,
        authenticated_client: APIClient,
        base_url: str,
        fixture_recruitment: Recruitment,
        fixture_gang: Gang,
    ):
        """Test that tag matching is case insensitive"""
        pos = self.create_position('1', 'Developer,PYTHON', fixture_recruitment, fixture_gang)

        response = authenticated_client.get(f'{base_url}?tags=developer,python')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['positions'][0]['id'] == pos.id

    def test_recruitment_filtering(
        self,
        authenticated_client: APIClient,
        base_url: str,
        fixture_recruitment: Recruitment,
        fixture_gang: Gang,
        fixture_organization: Organization,
    ):
        """Test that positions are filtered by recruitment_id"""
        pos1 = self.create_position('1', 'developer', fixture_recruitment, fixture_gang)

        # Create another recruitment
        other_recruitment = Recruitment.objects.create(
            name_nb='Other Recruitment',
            name_en='Other Recruitment',
            visible_from=fixture_recruitment.visible_from,
            actual_application_deadline=fixture_recruitment.actual_application_deadline,
            shown_application_deadline=fixture_recruitment.shown_application_deadline,
            reprioritization_deadline_for_applicant=fixture_recruitment.reprioritization_deadline_for_applicant,
            reprioritization_deadline_for_gangs=fixture_recruitment.reprioritization_deadline_for_gangs,
            organization=fixture_organization,
        )
        self.create_position('2', 'developer', other_recruitment, fixture_gang)

        response = authenticated_client.get(f'{base_url}?tags=developer')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['positions'][0]['id'] == pos1.id

    def test_whitespace_tag_handling(
        self,
        authenticated_client: APIClient,
        base_url: str,
        fixture_recruitment: Recruitment,
        fixture_gang: Gang,
    ):
        """Test that whitespace in tags is handled correctly"""
        pos = self.create_position('1', 'developer, python', fixture_recruitment, fixture_gang)

        response = authenticated_client.get(f'{base_url}?tags= developer , python ')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['positions'][0]['id'] == pos.id
