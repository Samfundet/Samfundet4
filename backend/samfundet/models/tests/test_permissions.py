from __future__ import annotations

import pytest

from rest_framework import status

from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import Permission

from root.utils import routes
from root.utils.permissions import SAMFUNDET_ADD_RECRUITMENT, SAMFUNDET_VIEW_RECRUITMENT, SAMFUNDET_CHANGE_RECRUITMENT, SAMFUNDET_DELETE_RECRUITMENT

from samfundet.models.role import Role, UserOrgRole, UserGangRole, UserGangSectionRole
from samfundet.models.general import Organization
from samfundet.models.recruitment import Recruitment


@pytest.fixture
def organization_factory():
    """Factory fixture for creating Organization instances."""
    created_organizations = []

    def create_organization(name='Test Organization') -> Organization:
        organization = Organization.objects.create(name=name)
        created_organizations.append(organization)
        return organization

    yield create_organization

    # Cleanup
    for organization in created_organizations:
        organization.delete()


@pytest.fixture
def recruitment_factory(organization_factory) -> callable:  # noqa: C901
    """Factory fixture for creating Recruitment instances.

    Creates valid Recruitment objects with sensible default values that respect
    the validation rules in the Recruitment model's clean method.
    """
    created_recruitments = []

    def create_recruitment(  # noqa: C901
        name_nb='Test Recruitment NB',
        name_en='Test Recruitment EN',
        visible_from=None,
        actual_application_deadline=None,
        shown_application_deadline=None,
        reprioritization_deadline_for_applicant=None,
        reprioritization_deadline_for_gangs=None,
        organization=None,
        max_applications=None,
        promo_media=None,
    ) -> Recruitment:
        """Create and return a Recruitment instance with valid dates.

        Default dates will be created in the correct sequence to pass validation:
        visible_from < shown_application_deadline < actual_application_deadline <
        reprioritization_deadline_for_applicant < reprioritization_deadline_for_gangs
        """
        if organization is None:
            organization = organization_factory()

        # Create dates in the correct order to satisfy validation rules
        now = timezone.now()

        if visible_from is None:
            visible_from = now + timezone.timedelta(days=1)

        if shown_application_deadline is None:
            shown_application_deadline = visible_from + timezone.timedelta(days=7)

        if actual_application_deadline is None:
            actual_application_deadline = shown_application_deadline + timezone.timedelta(days=1)

        if reprioritization_deadline_for_applicant is None:
            reprioritization_deadline_for_applicant = actual_application_deadline + timezone.timedelta(days=3)

        if reprioritization_deadline_for_gangs is None:
            reprioritization_deadline_for_gangs = reprioritization_deadline_for_applicant + timezone.timedelta(days=2)

        recruitment = Recruitment.objects.create(
            name_nb=name_nb,
            name_en=name_en,
            visible_from=visible_from,
            actual_application_deadline=actual_application_deadline,
            shown_application_deadline=shown_application_deadline,
            reprioritization_deadline_for_applicant=reprioritization_deadline_for_applicant,
            reprioritization_deadline_for_gangs=reprioritization_deadline_for_gangs,
            organization=organization,
            max_applications=max_applications,
            promo_media=promo_media,
        )
        created_recruitments.append(recruitment)
        return recruitment

    yield create_recruitment

    # Cleanup
    for recruitment in created_recruitments:
        recruitment.delete()


@pytest.fixture
def role_factory():  # noqa: C901
    """Factory fixture for creating Role instances with specified permissions."""
    created_roles = []

    def create_role(name='Test Role', permissions=None, content_type=None) -> Role:  # noqa: C901
        role = Role.objects.create(name=name, content_type=content_type)
        created_roles.append(role)

        if permissions:
            # Add permissions to the role
            if isinstance(permissions, list):
                # Convert permission strings to Permission objects if needed
                permission_objects = []
                for perm in permissions:
                    if isinstance(perm, str):
                        app_label, codename = perm.split('.')
                        perm_obj = Permission.objects.get(content_type__app_label=app_label, codename=codename)
                        permission_objects.append(perm_obj)
                    else:
                        permission_objects.append(perm)
                role.permissions.add(*permission_objects)
            else:
                # Handle single permission case
                if isinstance(permissions, str):
                    app_label, codename = permissions.split('.')
                    perm_obj = Permission.objects.get(content_type__app_label=app_label, codename=codename)
                    role.permissions.add(perm_obj)
                else:
                    role.permissions.add(permissions)

        return role

    yield create_role

    # Cleanup
    for role in created_roles:
        role.delete()


@pytest.fixture
def user_org_role_factory(fixture_user, role_factory, organization_factory) -> callable:  # noqa: C901
    """Factory fixture for creating UserOrgRole instances with specified permissions."""
    created_user_org_roles = []

    def create_user_org_role(user=None, role=None, organization=None, permissions=None) -> UserOrgRole:
        if user is None:
            user = fixture_user

        if permissions is not None and role is None:
            # Create a role with the specified permissions
            role = role_factory(permissions=permissions)
        elif role is None:
            role = role_factory()

        if organization is None:
            organization = organization_factory()

        user_org_role = UserOrgRole.objects.create(user=user, role=role, obj=organization)
        created_user_org_roles.append(user_org_role)
        return user_org_role

    yield create_user_org_role

    # Cleanup
    for user_org_role in created_user_org_roles:
        user_org_role.delete()


@pytest.fixture
def user_gang_role_factory(fixture_user, role_factory, fixture_gang) -> callable:  # noqa: C901
    """Factory fixture for creating UserGangRole instances with specified permissions."""
    created_user_gang_roles = []

    def create_user_gang_role(user=None, role=None, gang=None, permissions=None) -> UserGangRole:
        if user is None:
            user = fixture_user

        if permissions is not None and role is None:
            # Create a role with the specified permissions
            role = role_factory(permissions=permissions)
        elif role is None:
            role = role_factory()

        if gang is None:
            gang = fixture_gang

        user_gang_role = UserGangRole.objects.create(user=user, role=role, obj=gang)
        created_user_gang_roles.append(user_gang_role)
        return user_gang_role

    yield create_user_gang_role

    # Cleanup
    for user_gang_role in created_user_gang_roles:
        user_gang_role.delete()


@pytest.fixture
def user_gang_section_role_factory(fixture_user, role_factory, fixture_gang_section) -> callable:  # noqa: C901
    """Factory fixture for creating UserGangSectionRole instances with specified permissions."""
    created_user_gang_section_roles = []

    def create_user_gang_section_role(user=None, role=None, gang_section=None, permissions=None) -> UserGangSectionRole:
        if user is None:
            user = fixture_user

        if permissions is not None and role is None:
            # Create a role with the specified permissions
            role = role_factory(permissions=permissions)
        elif role is None:
            role = role_factory()

        if gang_section is None:
            gang_section = fixture_gang_section

        user_gang_section_role = UserGangSectionRole.objects.create(user=user, role=role, obj=gang_section)
        created_user_gang_section_roles.append(user_gang_section_role)
        return user_gang_section_role

    yield create_user_gang_section_role

    # Cleanup
    for user_gang_section_role in created_user_gang_section_roles:
        user_gang_section_role.delete()


@pytest.mark.django_db
class TestRecruitmentForRecruiterView:
    """Tests for RecruitmentForRecruiterView permissions."""

    @pytest.fixture(autouse=True)
    def setup(self, recruitment_factory, organization_factory):
        """Setup for each test."""
        self.recruitment_url = reverse(routes.samfundet__recruitment_for_recruiter_list)
        self.org1 = organization_factory(name='Organization 1')
        self.org2 = organization_factory(name='Organization 2')
        self.recruitment = recruitment_factory(organization=self.org1)
        self.detail_url = reverse(routes.samfundet__recruitment_for_recruiter_detail, kwargs={'pk': self.recruitment.pk})

    def test_unauthenticated_user_has_no_access(self, fixture_rest_client):
        """Test that unauthenticated users cannot access any methods."""
        # GET list
        response = fixture_rest_client.get(self.recruitment_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # GET detail
        response = fixture_rest_client.get(self.detail_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # POST
        response = fixture_rest_client.post(self.recruitment_url, {})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # PUT
        response = fixture_rest_client.put(self.detail_url, {})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # PATCH
        response = fixture_rest_client.patch(self.detail_url, {})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # DELETE
        response = fixture_rest_client.delete(self.detail_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_user_without_roles_has_no_permissions(self, fixture_rest_client, fixture_user):
        """Test that users without any roles do not have any permissions."""
        fixture_rest_client.force_authenticate(user=fixture_user)

        # GET list
        response = fixture_rest_client.get(self.recruitment_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # GET detail
        response = fixture_rest_client.get(self.detail_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # POST
        response = fixture_rest_client.post(self.recruitment_url, {})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # PUT
        response = fixture_rest_client.put(self.detail_url, {})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # PATCH
        response = fixture_rest_client.patch(self.detail_url, {})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # DELETE
        response = fixture_rest_client.delete(self.detail_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_user_with_view_permission_in_correct_org(self, fixture_rest_client, fixture_user, user_org_role_factory):
        """Test that users with view permission in the correct org can view but not modify."""
        user_org_role_factory(user=fixture_user, organization=self.org1, permissions=SAMFUNDET_VIEW_RECRUITMENT)
        fixture_rest_client.force_authenticate(user=fixture_user)

        # GET list
        response = fixture_rest_client.get(self.recruitment_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1  # Should return the recruitment

        # GET detail
        response = fixture_rest_client.get(self.detail_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == self.recruitment.pk

        # POST - Should not have permission
        response = fixture_rest_client.post(self.recruitment_url, {})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # PUT - Should not have permission
        response = fixture_rest_client.put(self.detail_url, {'name_nb': 'Updated'})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # PATCH - Should not have permission
        response = fixture_rest_client.patch(self.detail_url, {'name_nb': 'Updated'})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # DELETE - Should not have permission
        response = fixture_rest_client.delete(self.detail_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_user_with_change_permission_in_correct_org(self, fixture_rest_client, fixture_user, user_org_role_factory):
        """Test that users with change permission in the correct org can modify but not delete."""
        user = fixture_user
        user_org_role_factory(user=user, organization=self.org1, permissions=[SAMFUNDET_VIEW_RECRUITMENT, SAMFUNDET_CHANGE_RECRUITMENT])
        fixture_rest_client.force_authenticate(user=user)

        # GET list
        response = fixture_rest_client.get(self.recruitment_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1

        # GET detail
        response = fixture_rest_client.get(self.detail_url)
        assert response.status_code == status.HTTP_200_OK

        # PUT - Should have permission
        response = fixture_rest_client.put(
            self.detail_url,
            {
                'name_nb': 'Updated Recruitment',
                'name_en': 'Updated Recruitment',
                'organization': self.org1.id,
                'visible_from': timezone.now(),
                'shown_application_deadline': (timezone.now() + timezone.timedelta(days=30)),
                'actual_application_deadline': (timezone.now() + timezone.timedelta(days=31)),
                'reprioritization_deadline_for_applicant': (timezone.now() + timezone.timedelta(days=32)),
                'reprioritization_deadline_for_gangs': (timezone.now() + timezone.timedelta(days=33)),
            },
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name_nb'] == 'Updated Recruitment'

        # PATCH - Should have permission
        response = fixture_rest_client.patch(
            self.detail_url,
            {
                # Add all fields because validation is poorly implemented
                'name_nb': 'Patched Recruitment',
                'name_en': 'Updated Recruitment',
                'organization': self.org1.id,
                'visible_from': timezone.now(),
                'shown_application_deadline': (timezone.now() + timezone.timedelta(days=30)),
                'actual_application_deadline': (timezone.now() + timezone.timedelta(days=31)),
                'reprioritization_deadline_for_applicant': (timezone.now() + timezone.timedelta(days=32)),
                'reprioritization_deadline_for_gangs': (timezone.now() + timezone.timedelta(days=33)),
            },
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name_nb'] == 'Patched Recruitment'

        # POST - Should not have permission
        response = fixture_rest_client.post(self.recruitment_url, {})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # DELETE - Should not have permission
        response = fixture_rest_client.delete(self.detail_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_user_with_delete_permission_in_correct_org(self, fixture_rest_client, fixture_user, user_org_role_factory):
        """Test that users with delete permission in the correct org can delete."""
        user = fixture_user
        user_org_role_factory(user=user, organization=self.org1, permissions=[SAMFUNDET_VIEW_RECRUITMENT, SAMFUNDET_DELETE_RECRUITMENT])
        fixture_rest_client.force_authenticate(user=user)

        # DELETE - Should have permission
        response = fixture_rest_client.delete(self.detail_url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify it's deleted
        response = fixture_rest_client.get(self.detail_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_with_add_permission_in_correct_org(self, fixture_rest_client, fixture_user, user_org_role_factory):
        """Test that users with add permission can create new objects."""
        user = fixture_user
        user_org_role_factory(user=user, organization=self.org1, permissions=[SAMFUNDET_VIEW_RECRUITMENT, SAMFUNDET_ADD_RECRUITMENT])
        fixture_rest_client.force_authenticate(user=user)

        # POST - Should have permission
        response = fixture_rest_client.post(
            self.recruitment_url,
            {
                'name_nb': 'New Recruitment',
                'name_en': 'New Recruitment',
                'organization': self.org1.id,
                'visible_from': timezone.now(),
                'shown_application_deadline': (timezone.now() + timezone.timedelta(days=30)),
                'actual_application_deadline': (timezone.now() + timezone.timedelta(days=31)),
                'reprioritization_deadline_for_applicant': (timezone.now() + timezone.timedelta(days=32)),
                'reprioritization_deadline_for_gangs': (timezone.now() + timezone.timedelta(days=33)),
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name_nb'] == 'New Recruitment'

    def test_user_with_role_in_wrong_org_has_no_permission(self, fixture_rest_client, fixture_user, user_org_role_factory):
        """Test that users with roles in wrong org do not have permission."""
        user = fixture_user
        # Create role in org2, but the test recruitment belongs to org1
        user_org_role_factory(user=user, organization=self.org2, permissions=SAMFUNDET_VIEW_RECRUITMENT)
        fixture_rest_client.force_authenticate(user=user)

        # GET list - Should return empty list (filtered by permission)
        response = fixture_rest_client.get(self.recruitment_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

        # GET detail - Should not find the recruitment from org1
        response = fixture_rest_client.get(self.detail_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

        # PUT - Should not find the recruitment
        response = fixture_rest_client.put(self.detail_url, {'name_nb': 'Updated'})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # PATCH - Should not find the recruitment
        response = fixture_rest_client.patch(self.detail_url, {'name_nb': 'Updated'})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        # DELETE - Should not find the recruitment
        response = fixture_rest_client.delete(self.detail_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_gang_roles_irrelevant_for_recruitment_view(self, fixture_rest_client, fixture_user, user_gang_role_factory):
        """Test that gang roles do not grant permissions for recruitment view."""
        user = fixture_user
        user_gang_role_factory(user=user, permissions=SAMFUNDET_VIEW_RECRUITMENT)
        fixture_rest_client.force_authenticate(user=user)

        # GET list - Should return empty list
        response = fixture_rest_client.get(self.recruitment_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

        # GET detail - Should not find the recruitment
        response = fixture_rest_client.get(self.detail_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_section_roles_irrelevant_for_recruitment_view(self, fixture_rest_client, fixture_user, user_gang_section_role_factory):
        """Test that section roles do not grant permissions for recruitment view."""
        user = fixture_user
        user_gang_section_role_factory(user=user, permissions=SAMFUNDET_VIEW_RECRUITMENT)
        fixture_rest_client.force_authenticate(user=user)

        # GET list - Should return empty list
        response = fixture_rest_client.get(self.recruitment_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

        # GET detail - Should not find the recruitment
        response = fixture_rest_client.get(self.detail_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_with_all_permissions(self, fixture_rest_client, fixture_user, user_org_role_factory):
        """Test that users with all permissions can perform all operations."""
        user = fixture_user
        user_org_role_factory(
            user=user,
            organization=self.org1,
            permissions=[SAMFUNDET_VIEW_RECRUITMENT, SAMFUNDET_CHANGE_RECRUITMENT, SAMFUNDET_DELETE_RECRUITMENT, SAMFUNDET_ADD_RECRUITMENT],
        )
        fixture_rest_client.force_authenticate(user=user)

        # GET list
        response = fixture_rest_client.get(self.recruitment_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1

        # POST - Create new recruitment
        response = fixture_rest_client.post(
            self.recruitment_url,
            {
                'name_nb': 'Updated Recruitment',
                'name_en': 'Updated Recruitment',
                'organization': self.org1.id,
                'visible_from': timezone.now(),
                'shown_application_deadline': (timezone.now() + timezone.timedelta(days=30)),
                'actual_application_deadline': (timezone.now() + timezone.timedelta(days=31)),
                'reprioritization_deadline_for_applicant': (timezone.now() + timezone.timedelta(days=32)),
                'reprioritization_deadline_for_gangs': (timezone.now() + timezone.timedelta(days=33)),
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        new_recruitment_id = response.data['id']
        new_detail_url = reverse(routes.samfundet__recruitment_for_recruiter_detail, kwargs={'pk': new_recruitment_id})

        # GET detail - Verify created
        response = fixture_rest_client.get(new_detail_url)
        assert response.status_code == status.HTTP_200_OK

        # PATCH - Modify
        response = fixture_rest_client.patch(
            new_detail_url,
            {
                'name_nb': 'Modified Recruitment',
                'name_en': 'Modified Recruitment',
                'organization': self.org1.id,
                'visible_from': timezone.now(),
                'shown_application_deadline': (timezone.now() + timezone.timedelta(days=30)),
                'actual_application_deadline': (timezone.now() + timezone.timedelta(days=31)),
                'reprioritization_deadline_for_applicant': (timezone.now() + timezone.timedelta(days=32)),
                'reprioritization_deadline_for_gangs': (timezone.now() + timezone.timedelta(days=33)),
            },
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name_nb'] == 'Modified Recruitment'

        # DELETE - Remove
        response = fixture_rest_client.delete(new_detail_url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify it's deleted
        response = fixture_rest_client.get(new_detail_url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
