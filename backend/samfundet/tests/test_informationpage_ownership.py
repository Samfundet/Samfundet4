from __future__ import annotations

import pytest

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.response import Response

from django.urls import reverse

from root.utils import routes
from root.constants import WebFeatures
from root.utils.permissions import (
    SAMFUNDET_ADD_INFORMATIONPAGE,
    SAMFUNDET_VIEW_INFORMATIONPAGE,
    SAMFUNDET_CHANGE_INFORMATIONPAGE,
    SAMFUNDET_DELETE_INFORMATIONPAGE,
)

from samfundet.models import Gang, User, GangSection
from samfundet.models.role import Role
from samfundet.infopages.models import InformationPage
from samfundet.organization.models import Organization

from .test_roles import grant


@pytest.fixture(autouse=True)
def _enable_information_feature(settings) -> None:
    settings.CP_ENABLED = {WebFeatures.INFORMATION}


class TestCreateInformationPage:
    def post(self, client: APIClient, **extra: object) -> Response:
        data = {'slug_field': 'new-page', 'title_nb': 'Ny', 'title_en': 'New', 'text_nb': '', 'text_en': '', 'visible': True, **extra}
        return client.post(path=reverse(routes.samfundet__admin_information_pages_list), data=data)

    def test_gang_is_required_even_with_access_to_only_one(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
    ):
        """The gang is never inferred, so a permission change while writing cannot redirect the page."""
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'gang_id' in response.json()
        assert not InformationPage.objects.filter(slug_field='new-page').exists()

    def test_stating_the_only_permitted_gang_works(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client, gang_id=fixture_gang.id)

        assert status.is_success(response.status_code), response.json()
        assert InformationPage.objects.get(slug_field='new-page').gang_id == fixture_gang.id

    def test_explicit_gang_is_accepted_when_permitted(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_gang: Gang,
        fixture_gang2: Gang,
    ):
        grant(fixture_user, Role.objects.create(name='A'), fixture_gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        grant(fixture_user, Role.objects.create(name='B'), fixture_gang2, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client, gang_id=fixture_gang2.id)

        assert status.is_success(response.status_code), response.json()
        assert InformationPage.objects.get(slug_field='new-page').gang_id == fixture_gang2.id

    def test_explicit_gang_is_rejected_when_not_permitted(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_gang2: Gang,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client, gang_id=fixture_gang2.id)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'gang_id' in response.json()

    def test_superuser_must_state_the_gang(self, fixture_rest_client: APIClient, fixture_superuser: User, fixture_gang: Gang, fixture_gang2: Gang):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        assert self.post(fixture_rest_client).status_code == status.HTTP_400_BAD_REQUEST
        assert status.is_success(self.post(fixture_rest_client, gang_id=fixture_gang.id).status_code)

    def test_org_role_may_create_for_a_gang_in_that_org(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_organization: Organization,
        fixture_gang: Gang,
    ):
        grant(fixture_user, fixture_role, fixture_organization, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client, gang_id=fixture_gang.id)

        assert status.is_success(response.status_code), response.json()
        assert InformationPage.objects.get(slug_field='new-page').gang_id == fixture_gang.id

    def test_section_role_cannot_create(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
    ):
        grant(fixture_user, fixture_role, fixture_gang_section, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client, gang_id=fixture_gang_section.gang_id)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'gang_id' in response.json()

    def test_section_role_may_create_for_that_section(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
    ):
        grant(fixture_user, fixture_role, fixture_gang_section, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client, section_id=fixture_gang_section.id)

        assert status.is_success(response.status_code), response.json()
        page = InformationPage.objects.get(slug_field='new-page')
        assert page.section_id == fixture_gang_section.id
        assert page.gang_id is None

    def test_gang_role_may_create_for_its_own_section(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
    ):
        grant(fixture_user, fixture_role, fixture_gang_section.gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client, section_id=fixture_gang_section.id)

        assert status.is_success(response.status_code), response.json()
        assert InformationPage.objects.get(slug_field='new-page').section_id == fixture_gang_section.id

    def test_section_of_another_gang_is_rejected(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
        fixture_gang_section2: GangSection,
    ):
        grant(fixture_user, fixture_role, fixture_gang_section.gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.post(fixture_rest_client, section_id=fixture_gang_section2.id)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'section_id' in response.json()

    def test_stating_both_owners_is_rejected(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_gang_section: GangSection,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        response = self.post(fixture_rest_client, gang_id=fixture_gang_section.gang_id, section_id=fixture_gang_section.id)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert set(response.json()) == {'gang_id', 'section_id'}
        assert not InformationPage.objects.filter(slug_field='new-page').exists()

    def test_stating_neither_owner_is_rejected(self, fixture_rest_client: APIClient, fixture_superuser: User, fixture_gang: Gang):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        response = self.post(fixture_rest_client)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert set(response.json()) == {'gang_id', 'section_id'}


class TestMoveInformationPage:
    """The source gang is always granted view permission, or the page is simply not visible to the user."""

    def put(self, client: APIClient, page: InformationPage, **extra: object) -> Response:
        revision = page.current_revision
        data = {
            'slug_field': page.slug_field,
            'title_nb': revision.title_nb,
            'title_en': revision.title_en,
            'text_nb': revision.text_nb or '',
            'text_en': revision.text_en or '',
            'visible': page.visible,
            **extra,
        }
        return client.put(path=reverse(routes.samfundet__admin_information_pages_detail, kwargs={'slug_field': page.slug_field}), data=data)

    def test_put_requires_the_gang(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_VIEW_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage, title_nb='Endret')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'gang_id' in response.json()

    def test_restating_the_current_gang_is_not_treated_as_a_move(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        """Change permission alone is enough, since sending the gang it already has moves nothing."""
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_VIEW_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage, title_nb='Endret', gang_id=fixture_gang.id)

        assert status.is_success(response.status_code), response.json()
        fixture_informationpage.refresh_from_db()
        assert fixture_informationpage.gang_id == fixture_gang.id
        assert fixture_informationpage.current_revision.title_nb == 'Endret'

    def test_partial_update_is_not_allowed(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_VIEW_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)
        url = reverse(routes.samfundet__admin_information_pages_detail, kwargs={'slug_field': fixture_informationpage.slug_field})

        response = fixture_rest_client.patch(path=url, data={'title_nb': 'Endret'})

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_move_succeeds_with_add_on_target_and_change_delete_on_source(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_gang: Gang,
        fixture_gang2: Gang,
        fixture_informationpage: InformationPage,
    ):
        grant(
            fixture_user,
            Role.objects.create(name='Source'),
            fixture_gang,
            SAMFUNDET_VIEW_INFORMATIONPAGE,
            SAMFUNDET_CHANGE_INFORMATIONPAGE,
            SAMFUNDET_DELETE_INFORMATIONPAGE,
        )
        grant(fixture_user, Role.objects.create(name='Target'), fixture_gang2, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage, gang_id=fixture_gang2.id)

        assert status.is_success(response.status_code), response.json()
        fixture_informationpage.refresh_from_db()
        assert fixture_informationpage.gang_id == fixture_gang2.id

    def test_move_fails_without_add_on_target(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_gang2: Gang,
        fixture_informationpage: InformationPage,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_VIEW_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE, SAMFUNDET_DELETE_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage, gang_id=fixture_gang2.id)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        fixture_informationpage.refresh_from_db()
        assert fixture_informationpage.gang_id == fixture_gang.id

    def test_move_fails_without_delete_on_source(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_gang: Gang,
        fixture_gang2: Gang,
        fixture_informationpage: InformationPage,
    ):
        grant(fixture_user, Role.objects.create(name='Source'), fixture_gang, SAMFUNDET_VIEW_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE)
        grant(fixture_user, Role.objects.create(name='Target'), fixture_gang2, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage, gang_id=fixture_gang2.id)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        fixture_informationpage.refresh_from_db()
        assert fixture_informationpage.gang_id == fixture_gang.id

    def test_move_fails_without_change_on_source(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_gang: Gang,
        fixture_gang2: Gang,
        fixture_informationpage: InformationPage,
    ):
        # CanAdministerInformationPage checks change permission against the page itself, so this is
        # rejected at the object level with 403 before the serializer gets to look at the move
        grant(fixture_user, Role.objects.create(name='Source'), fixture_gang, SAMFUNDET_VIEW_INFORMATIONPAGE, SAMFUNDET_DELETE_INFORMATIONPAGE)
        grant(
            fixture_user,
            Role.objects.create(name='Target'),
            fixture_gang2,
            SAMFUNDET_ADD_INFORMATIONPAGE,
            SAMFUNDET_CHANGE_INFORMATIONPAGE,
        )
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage, gang_id=fixture_gang2.id)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        fixture_informationpage.refresh_from_db()
        assert fixture_informationpage.gang_id == fixture_gang.id

    def test_gang_role_may_move_its_page_down_into_its_own_section(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
        fixture_informationpage: InformationPage,
    ):
        """Add on the section is inherited from the gang, so no extra grant is needed to delegate downwards."""
        grant(
            fixture_user,
            fixture_role,
            fixture_gang_section.gang,
            SAMFUNDET_VIEW_INFORMATIONPAGE,
            SAMFUNDET_ADD_INFORMATIONPAGE,
            SAMFUNDET_CHANGE_INFORMATIONPAGE,
            SAMFUNDET_DELETE_INFORMATIONPAGE,
        )
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage, section_id=fixture_gang_section.id)

        assert status.is_success(response.status_code), response.json()
        fixture_informationpage.refresh_from_db()
        assert fixture_informationpage.section_id == fixture_gang_section.id
        assert fixture_informationpage.gang_id is None

    def test_section_role_cannot_move_its_page_up_to_the_gang(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
        fixture_informationpage_section: InformationPage,
    ):
        """Permissions do not flow upwards, so the section role grants nothing on the gang itself."""
        grant(
            fixture_user,
            fixture_role,
            fixture_gang_section,
            SAMFUNDET_VIEW_INFORMATIONPAGE,
            SAMFUNDET_ADD_INFORMATIONPAGE,
            SAMFUNDET_CHANGE_INFORMATIONPAGE,
            SAMFUNDET_DELETE_INFORMATIONPAGE,
        )
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage_section, gang_id=fixture_gang_section.gang_id)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'gang_id' in response.json()
        fixture_informationpage_section.refresh_from_db()
        assert fixture_informationpage_section.section_id == fixture_gang_section.id

    def test_restating_the_current_section_is_not_treated_as_a_move(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
        fixture_informationpage_section: InformationPage,
    ):
        grant(fixture_user, fixture_role, fixture_gang_section, SAMFUNDET_VIEW_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.put(fixture_rest_client, fixture_informationpage_section, title_nb='Endret', section_id=fixture_gang_section.id)

        assert status.is_success(response.status_code), response.json()
        fixture_informationpage_section.refresh_from_db()
        assert fixture_informationpage_section.section_id == fixture_gang_section.id
        assert fixture_informationpage_section.current_revision.title_nb == 'Endret'


class TestOwnerOptionsEndpoint:
    def get(self, client: APIClient) -> Response:
        return client.get(path=reverse(routes.samfundet__admin_information_pages_owner_options))

    def test_returns_flags_per_gang(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_gang2: Gang,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_ADD_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.get(fixture_rest_client)
        data = response.json()

        assert status.is_success(response.status_code)
        assert len(data) == 1
        assert data[0]['gang']['id'] == fixture_gang.id
        assert data[0]['can_create'] is True
        assert data[0]['can_change'] is True
        assert data[0]['can_delete'] is False

    def test_includes_the_organization(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_organization: Organization,
        fixture_gang: Gang,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        data = self.get(fixture_rest_client).json()

        assert data[0]['organization']['id'] == fixture_organization.id
        assert data[0]['organization']['name'] == fixture_organization.name

    def test_organization_is_null_for_orphan_gang(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
    ):
        fixture_gang.organization = None
        fixture_gang.save()
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        data = self.get(fixture_rest_client).json()

        assert data[0]['organization'] is None

    def test_sections_follow_their_gang(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
    ):
        """Each gang is immediately followed by its own sections, so the frontend can render a nested list."""
        grant(fixture_user, fixture_role, fixture_gang_section.gang, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        data = self.get(fixture_rest_client).json()

        assert [(row['gang']['id'], row['section'] and row['section']['id']) for row in data] == [
            (fixture_gang_section.gang_id, None),
            (fixture_gang_section.gang_id, fixture_gang_section.id),
        ]
        assert all(row['can_create'] for row in data)

    def test_gang_is_included_as_a_disabled_anchor_for_a_selectable_section(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
    ):
        """A section role grants nothing on the gang, but the gang row still anchors the indentation."""
        grant(fixture_user, fixture_role, fixture_gang_section, SAMFUNDET_ADD_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        data = self.get(fixture_rest_client).json()

        assert len(data) == 2
        assert data[0]['section'] is None
        assert not any([data[0]['can_create'], data[0]['can_change'], data[0]['can_delete']])
        assert data[1]['section']['id'] == fixture_gang_section.id
        assert data[1]['can_create'] is True

    def test_anonymous_user_is_rejected(self, fixture_rest_client: APIClient, fixture_gang: Gang):
        """This endpoint answers "what may you do", so it needs a caller."""
        response = self.get(fixture_rest_client)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_authenticated_user_without_any_access_gets_empty_list(self, fixture_rest_client: APIClient, fixture_user: User, fixture_gang: Gang):
        fixture_rest_client.force_authenticate(user=fixture_user)

        response = self.get(fixture_rest_client)

        assert status.is_success(response.status_code)
        assert response.json() == []

    def test_feature_flag_applies(self, fixture_rest_client: APIClient, fixture_user: User, settings):
        """The whole admin viewset sits behind the INFORMATION feature flag, extra actions included."""
        settings.CP_ENABLED = set()
        fixture_rest_client.force_authenticate(user=fixture_user)

        assert self.get(fixture_rest_client).status_code == status.HTTP_403_FORBIDDEN
