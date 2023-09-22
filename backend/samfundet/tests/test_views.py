from __future__ import annotations

from typing import TYPE_CHECKING

from django.contrib.auth.models import Permission, Group
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from guardian.shortcuts import assign_perm

from root.utils import routes, permissions
from samfundet.models.recruitment import Recruitment, RecruitmentPosition, RecruitmentAdmission
from samfundet.models.general import User, KeyValue, TextItem, InformationPage, BlogPost, Image
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


def test_login(
    fixture_rest_client: APIClient,
    fixture_user: User,
    fixture_user_pw: str,
):
    url = reverse(routes.samfundet__login)
    data = {'username': fixture_user.username, 'password': fixture_user_pw}
    response: Response = fixture_rest_client.post(path=url, data=data)
    assert status.is_success(code=response.status_code)


def test_logout(
    fixture_rest_client: APIClient,
    fixture_user: User,
):
    fixture_rest_client.force_authenticate(user=fixture_user)
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


class TestInformationPagesView:

    def test_get_informationpage(self, fixture_rest_client: APIClient, fixture_user: User, fixture_informationpage: InformationPage):
        ### Arrange ###
        url = reverse(routes.samfundet__information_detail, kwargs={'pk': fixture_informationpage.slug_field})

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['slug_field'] == fixture_informationpage.slug_field

    def test_get_informationpages(self, fixture_rest_client: APIClient, fixture_user: User, fixture_informationpage: InformationPage):
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

    def test_delete_informationpage(self, fixture_rest_client: APIClient, fixture_user: User, fixture_informationpage: InformationPage):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__information_detail, kwargs={'pk': fixture_informationpage.slug_field})
        response: Response = fixture_rest_client.delete(path=url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_DELETE_INFORMATIONPAGE, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.delete(path=url)

        assert status.is_success(code=response.status_code)

    def test_put_informationpage(self, fixture_rest_client: APIClient, fixture_user: User, fixture_informationpage: InformationPage):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__information_detail, kwargs={'pk': fixture_informationpage.slug_field})
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


class TestBlogPostView:

    def test_get_blogpost(self, fixture_rest_client: APIClient, fixture_user: User, fixture_blogpost: BlogPost):
        ### Arrange ###
        url = reverse(routes.samfundet__blog_detail, kwargs={'pk': fixture_blogpost.id})

        ### Act ###
        response: Response = fixture_rest_client.get(path=url)
        data = response.json()

        ### Assert ###
        assert status.is_success(code=response.status_code)
        assert data['id'] == fixture_blogpost.id

    def test_get_blogposts(self, fixture_rest_client: APIClient, fixture_user: User, fixture_blogpost: BlogPost):
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

    def test_delete_blogpost(self, fixture_rest_client: APIClient, fixture_user: User, fixture_blogpost: BlogPost):
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__blog_detail, kwargs={'pk': fixture_blogpost.id})
        response: Response = fixture_rest_client.delete(path=url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assign_perm(permissions.SAMFUNDET_DELETE_BLOGPOST, fixture_user)
        del fixture_user._user_perm_cache
        del fixture_user._perm_cache
        response: Response = fixture_rest_client.delete(path=url)

        assert status.is_success(code=response.status_code)

    def test_put_blogpost(self, fixture_rest_client: APIClient, fixture_user: User, fixture_blogpost: BlogPost):
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


class TestAssignGroupView:

    def test_assign_group(self, fixture_rest_client: APIClient, fixture_superuser: User, fixture_user: User):
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

    def test_remove_group(self, fixture_rest_client: APIClient, fixture_superuser: User, fixture_user: User):
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


def test_get_recruitments(fixture_rest_client: APIClient, fixture_superuser: User, fixture_recruitment: Recruitment):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_superuser)
    url = reverse(routes.samfundet__recruitment_list)

    ### Act ###
    response = fixture_rest_client.get(url)

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['name_nb'] == fixture_recruitment.name_nb


def test_get_recruitment_positions(fixture_rest_client: APIClient, fixture_superuser: User, fixture_recruitment_position: RecruitmentPosition):
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
    fixture_rest_client: APIClient, fixture_superuser: User, fixture_recruitment: Recruitment, fixture_user: User,
    fixture_recruitment_admission: RecruitmentAdmission
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_superuser)
    url = reverse(routes.samfundet__applicants_without_interviews)

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
    fixture_rest_client: APIClient, fixture_superuser: User, fixture_recruitment: Recruitment, fixture_user: User,
    fixture_recruitment_admission: RecruitmentAdmission
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_superuser)
    url = reverse(routes.samfundet__applicants_without_interviews)

    # Setting the interview time for the user's admission
    fixture_recruitment_admission.interview_time = timezone.now() + timezone.timedelta(hours=1)
    fixture_recruitment_admission.save()

    ### Act ###
    response: Response = fixture_rest_client.get(path=url, data={'recruitment': fixture_recruitment.id})

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 0


def test_recruitment_admission_for_applicant(
    fixture_rest_client: APIClient, fixture_user: User, fixture_recruitment_admission: RecruitmentAdmission, fixture_recruitment: Recruitment
):
    ### Arrange ###
    fixture_rest_client.force_authenticate(user=fixture_user)
    url = reverse(routes.samfundet__recruitment_admissions_for_applicant_list)

    ### Act ###
    response: Response = fixture_rest_client.get(path=url, data={'recruitment': fixture_recruitment.id})

    ### Assert ###
    assert response.status_code == status.HTTP_200_OK
    # Assert the returned data based on the logic in the view
    assert len(response.data) == 1
    assert response.data[0]['admission_text'] == fixture_recruitment_admission.admission_text
    assert response.data[0]['recruitment_position'] == fixture_recruitment_admission.recruitment_position.id
    assert response.data[0]['interview_location'] == fixture_recruitment_admission.interview_location
