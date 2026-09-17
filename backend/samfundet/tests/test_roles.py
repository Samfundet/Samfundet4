from __future__ import annotations

import pytest

from django.contrib.auth.models import Permission, AnonymousUser

from samfundet.roles import get_owner_permission_map
from samfundet.models import Gang, User, GangSection
from samfundet.backend import RoleAuthBackend
from samfundet.models.role import Role, UserOrgRole, UserGangRole, UserGangSectionRole
from samfundet.organization.models import Organization


def test_has_perm_superuser(fixture_superuser: User, fixture_organization: Organization, fixture_org_permission: Permission):
    """Test that superusers have permissions to all resources even without any roles."""
    backend = RoleAuthBackend()
    assert backend.has_perm(fixture_superuser, fixture_org_permission.codename, fixture_organization)


def test_has_perm_inactive_user(
    fixture_user: User,
    fixture_organization: Organization,
    fixture_org_permission: Permission,
):
    backend = RoleAuthBackend()
    assert not backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)


def test_has_perm_inactive_user_with_role(fixture_user: User, fixture_organization: Organization, fixture_org_permission: Permission, fixture_role: Role):
    """Test that inactive users who would otherwise have access to a resource, don't."""
    backend = RoleAuthBackend()
    fixture_role.permissions.add(fixture_org_permission)
    UserOrgRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_organization)
    fixture_user.is_active = False
    assert not backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)


def test_has_perm_no_obj(fixture_user: User, fixture_org_permission: Permission):
    backend = RoleAuthBackend()
    assert not backend.has_perm(fixture_user, fixture_org_permission.codename, None)


def test_has_perm_superuser_no_obj(fixture_superuser: User, fixture_org_permission: Permission):
    backend = RoleAuthBackend()
    assert not backend.has_perm(fixture_superuser, fixture_org_permission.codename, None)


def test_has_perm_user_with_no_roles(
    fixture_user: User,
    fixture_role: Role,
    fixture_organization: Organization,
    fixture_gang: Gang,
    fixture_gang_section: GangSection,
    fixture_org_permission: Permission,
    fixture_gang_permission: Permission,
    fixture_gang_section_permission: Permission,
):
    backend = RoleAuthBackend()
    """Sanity check. Within the scope of our auth backend, a user with no roles should have no permissions,
    on any hierarchical level."""

    # Create a role with permission to our example resources (org/gang/section), but don't attach it to user.
    fixture_role.permissions.add(fixture_org_permission)
    fixture_role.permissions.add(fixture_gang_permission)
    fixture_role.permissions.add(fixture_gang_section_permission)

    assert not backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)
    assert not backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)
    assert not backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)


def test_has_perm_user_with_org_role(fixture_user: User, fixture_role: Role, fixture_organization: Organization, fixture_org_permission: Permission):
    backend = RoleAuthBackend()
    """Test that giving user an OrgRole with permission to access a resource, actually gives them access."""
    fixture_role.permissions.add(fixture_org_permission)
    UserOrgRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_organization)

    assert backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)


def test_has_perm_user_with_gang_role(fixture_user: User, fixture_role: Role, fixture_gang: Gang, fixture_gang_permission: Permission):
    backend = RoleAuthBackend()
    """Test that giving user a GangRole with permission to access a resource, actually gives them access."""
    fixture_role.permissions.add(fixture_gang_permission)
    UserGangRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang)

    assert backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)


def test_has_perm_user_with_section_role(
    fixture_user: User,
    fixture_role: Role,
    fixture_gang_section: GangSection,
    fixture_gang_section_permission: Permission,
):
    backend = RoleAuthBackend()
    """Test that giving user a GangSectionRole with permission to access a resource, actually gives them access."""
    fixture_role.permissions.add(fixture_gang_section_permission)
    UserGangSectionRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang_section)

    assert backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)


def test_has_perm_different_orgs(
    fixture_user: User,
    fixture_organization: Organization,
    fixture_organization2: Organization,
    fixture_org_permission: Permission,
    fixture_role: Role,
):
    backend = RoleAuthBackend()
    """Test that giving user a role to a specific org, does not give it to other orgs"""
    fixture_role.permissions.add(fixture_org_permission)

    assert not backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)

    UserOrgRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_organization)

    assert backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)
    assert not backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization2)


def test_has_perm_different_gangs(
    fixture_user: User,
    fixture_gang: Gang,
    fixture_gang2: Gang,
    fixture_gang_permission: Permission,
    fixture_role: Role,
):
    backend = RoleAuthBackend()
    """Test that giving user a role to a specific gang, does not give it to other gangs"""
    fixture_role.permissions.add(fixture_gang_permission)

    assert not backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)

    UserGangRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang)

    assert backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)
    assert not backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang2)


def test_has_perm_different_gang_sections(
    fixture_user: User,
    fixture_gang_section: GangSection,
    fixture_gang_section2: Gang,
    fixture_gang_section_permission: Permission,
    fixture_role: Role,
):
    backend = RoleAuthBackend()
    """Test that giving user a role to a specific gang section, does not give it to other gang sections"""
    fixture_role.permissions.add(fixture_gang_section_permission)

    assert not backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)

    UserGangSectionRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang_section)

    assert backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)
    assert not backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section2)


def test_has_perm_different_users(
    fixture_user: User,
    fixture_user2: User,
    fixture_organization: Organization,
    fixture_gang: Gang,
    fixture_gang_section: GangSection,
    fixture_org_permission: Permission,
    fixture_gang_permission: Permission,
    fixture_gang_section_permission: Permission,
    fixture_role: Role,
):
    backend = RoleAuthBackend()
    """Test that giving user a role, does not give it to other users"""
    fixture_role.permissions.add(fixture_org_permission)
    fixture_role.permissions.add(fixture_gang_permission)
    fixture_role.permissions.add(fixture_gang_section_permission)

    UserOrgRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_organization)
    UserGangRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang)
    UserGangSectionRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang_section)

    assert not backend.has_perm(fixture_user2, fixture_org_permission.codename, fixture_organization)
    assert not backend.has_perm(fixture_user2, fixture_gang_permission.codename, fixture_gang)
    assert not backend.has_perm(fixture_user2, fixture_gang_section_permission.codename, fixture_gang_section)


def test_has_perm_org_downward(
    fixture_user: User,
    fixture_organization: Organization,
    fixture_organization2: Organization,
    fixture_gang: Gang,
    fixture_gang2: Gang,
    fixture_gang_section: GangSection,
    fixture_role: Role,
    fixture_org_permission: Permission,
    fixture_gang_permission: Permission,
    fixture_gang_section_permission: Permission,
):
    backend = RoleAuthBackend()
    """Test that giving permission on org/gang level, also gives it downwards (gang/section)."""
    fixture_role.permissions.add(fixture_gang_section_permission)
    fixture_role.permissions.add(fixture_gang_permission)

    fixture_gang.organization = fixture_organization
    fixture_gang_section.gang = fixture_gang

    # Giving a user an Org role should give the same permissions on Gang and Section levels

    org_role = UserOrgRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_organization)

    assert backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)
    assert backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)

    org_role.delete()

    # Permissions should be gone after deleting org role

    assert not backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)
    assert not backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)

    # Giving a user a Gang role should give the same permissions on Section level

    gang_role = UserGangRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang)

    assert backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)

    gang_role.delete()

    assert not backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)

    # Give the user the Org role again, and ensure that after we detach Gang and Section from the Organization,
    # we no longer have permissions.
    UserOrgRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_organization)

    assert backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)

    fixture_gang_section.gang = fixture_gang2

    assert not backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)

    assert backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)

    fixture_gang.organization = fixture_organization2

    assert not backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)


def test_has_perm_section_upward(
    fixture_user: User,
    fixture_organization: Organization,
    fixture_gang: Gang,
    fixture_gang_section: GangSection,
    fixture_role: Role,
    fixture_org_permission: Permission,
    fixture_gang_permission: Permission,
    fixture_gang_section_permission: Permission,
):
    backend = RoleAuthBackend()
    """Test that giving permission on section/gang level, does not give it upwards (gang/org)."""
    fixture_role.permissions.add(fixture_org_permission)
    fixture_role.permissions.add(fixture_gang_permission)
    fixture_role.permissions.add(fixture_gang_section_permission)

    fixture_gang.organization = fixture_organization
    fixture_gang_section.gang = fixture_gang

    section_role = UserGangSectionRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang_section)

    assert not backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)
    assert not backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)

    section_role.delete()

    UserGangRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang)

    assert not backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)


def perm(full_name: str) -> Permission:
    return Permission.objects.get(codename=full_name.split('.')[1])


def grant(user: User, role: Role, obj: Organization | Gang | GangSection, *perms: str) -> None:
    """Gives the user a role on an object, carrying the named permissions."""
    role.permissions.add(*[perm(p) for p in perms])
    if isinstance(obj, Organization):
        UserOrgRole.objects.create(user=user, role=role, obj=obj)
    elif isinstance(obj, Gang):
        UserGangRole.objects.create(user=user, role=role, obj=obj)
    else:
        UserGangSectionRole.objects.create(user=user, role=role, obj=obj)


# These perms must be distinct
PERM_A = 'samfundet.test_org_permission'
PERM_B = 'samfundet.test_gang_permission'
PERM_C = 'samfundet.test_gang_section_permission'


@pytest.fixture
def fixture_permissions(
    fixture_org_permission: Permission,
    fixture_gang_permission: Permission,
    fixture_gang_section_permission: Permission,
) -> tuple[str, ...]:
    return PERM_A, PERM_B, PERM_C


@pytest.fixture
def gang_in_same_org(fixture_organization: Organization) -> Gang:
    return Gang.objects.create(name_nb='Sibling', name_en='Sibling', abbreviation='SIB', organization=fixture_organization)


class TestOwnerPermissionMap:
    """
    get_owner_permission_map resolves the same hierarchy as RoleAuthBackend above, but in bulk:
    given a set of permissions, which gangs and sections does the user hold them for.
    """

    def test_gang_role_grants_only_that_gang(
        self,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_gang2: Gang,
        fixture_permissions: tuple[str, ...],
    ):
        grant(fixture_user, fixture_role, fixture_gang, PERM_A)

        capabilities = get_owner_permission_map(user=fixture_user, permissions=fixture_permissions)

        assert capabilities.gangs == {fixture_gang.id: {PERM_A}}

    def test_org_role_expands_to_all_gangs_in_org(
        self,
        fixture_user: User,
        fixture_role: Role,
        fixture_organization: Organization,
        fixture_gang: Gang,
        fixture_gang2: Gang,
        gang_in_same_org: Gang,
        fixture_permissions: tuple[str, ...],
    ):
        grant(fixture_user, fixture_role, fixture_organization, PERM_A)

        capabilities = get_owner_permission_map(user=fixture_user, permissions=fixture_permissions)

        assert set(capabilities.gangs) == {fixture_gang.id, gang_in_same_org.id}
        assert fixture_gang2.id not in capabilities.gangs

    def test_section_role_grants_only_that_section(
        self,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
        fixture_gang_section2: GangSection,
        fixture_permissions: tuple[str, ...],
    ):
        """Permissions do not flow upwards, so the section's gang is left out."""
        grant(fixture_user, fixture_role, fixture_gang_section, PERM_A)

        capabilities = get_owner_permission_map(user=fixture_user, permissions=fixture_permissions)

        assert capabilities.sections == {fixture_gang_section.id: {PERM_A}}
        assert capabilities.gangs == {}

    def test_gang_role_reaches_its_sections(
        self,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang_section: GangSection,
        fixture_gang_section2: GangSection,
        fixture_permissions: tuple[str, ...],
    ):
        grant(fixture_user, fixture_role, fixture_gang_section.gang, PERM_A)

        capabilities = get_owner_permission_map(user=fixture_user, permissions=fixture_permissions)

        assert capabilities.for_section(fixture_gang_section.id) == {PERM_A}
        assert capabilities.for_section(fixture_gang_section2.id) == set()

    def test_org_role_reaches_sections_of_its_gangs(
        self,
        fixture_user: User,
        fixture_role: Role,
        fixture_organization: Organization,
        fixture_gang_section: GangSection,
        fixture_permissions: tuple[str, ...],
    ):
        grant(fixture_user, fixture_role, fixture_organization, PERM_A)

        capabilities = get_owner_permission_map(user=fixture_user, permissions=fixture_permissions)

        assert capabilities.for_section(fixture_gang_section.id) == {PERM_A}

    def test_superuser_gets_every_owner(
        self,
        fixture_superuser: User,
        fixture_gang: Gang,
        fixture_gang2: Gang,
        fixture_gang_section: GangSection,
        fixture_permissions: tuple[str, ...],
    ):
        capabilities = get_owner_permission_map(user=fixture_superuser, permissions=fixture_permissions)

        assert set(capabilities.gangs) == {fixture_gang.id, fixture_gang2.id}
        assert set(capabilities.sections) == {fixture_gang_section.id}
        assert capabilities.for_gang(fixture_gang.id) == set(fixture_permissions)
        assert capabilities.for_section(fixture_gang_section.id) == set(fixture_permissions)

    def test_roles_are_merged_per_gang(
        self,
        fixture_user: User,
        fixture_gang: Gang,
        fixture_organization: Organization,
        fixture_permissions: tuple[str, ...],
    ):
        grant(fixture_user, Role.objects.create(name='Org role'), fixture_organization, PERM_B)
        grant(fixture_user, Role.objects.create(name='Gang role'), fixture_gang, PERM_C)

        capabilities = get_owner_permission_map(user=fixture_user, permissions=fixture_permissions)

        assert capabilities.for_gang(fixture_gang.id) == {PERM_B, PERM_C}

    def test_section_role_merges_with_what_the_gang_grants(
        self,
        fixture_user: User,
        fixture_gang_section: GangSection,
        fixture_permissions: tuple[str, ...],
    ):
        grant(fixture_user, Role.objects.create(name='Gang role'), fixture_gang_section.gang, PERM_B)
        grant(fixture_user, Role.objects.create(name='Section role'), fixture_gang_section, PERM_C)

        capabilities = get_owner_permission_map(user=fixture_user, permissions=fixture_permissions)

        assert capabilities.for_section(fixture_gang_section.id) == {PERM_B, PERM_C}
        assert capabilities.for_gang(fixture_gang_section.gang_id) == {PERM_B}

    def test_anonymous_user_gets_nothing(self, fixture_gang: Gang, fixture_permissions: tuple[str, ...]):
        capabilities = get_owner_permission_map(user=AnonymousUser(), permissions=fixture_permissions)

        assert capabilities.gangs == {}
        assert capabilities.sections == {}
