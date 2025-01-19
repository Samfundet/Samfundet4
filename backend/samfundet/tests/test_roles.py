from __future__ import annotations

from django.contrib.auth.models import Permission

from samfundet.models import Gang, User, GangSection, Organization
from samfundet.backend import RoleAuthBackend
from samfundet.models.role import Role, UserOrgRole, UserGangRole, UserGangSectionRole


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
