from __future__ import annotations

from django.contrib.auth.models import Permission

from samfundet.models import Gang, User, GangSection, Organization
from samfundet.backend import RoleAuthBackend
from samfundet.models.role import Role, UserOrgRole, UserGangRole, UserGangSectionRole


def test_has_perm_superuser(
    fixture_role_auth_backend: RoleAuthBackend, fixture_superuser: User, fixture_organization: Organization, fixture_org_permission: Permission
):
    assert fixture_role_auth_backend.has_perm(fixture_superuser, fixture_org_permission.codename, fixture_organization)


def test_has_perm_user_with_orgrole(
    fixture_role_auth_backend: RoleAuthBackend, fixture_user: User, fixture_role: Role, fixture_organization: Organization, fixture_org_permission: Permission
):
    fixture_role.permissions.add(fixture_org_permission)

    assert not fixture_role_auth_backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)

    org_role = UserOrgRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_organization)
    org_role.save()

    assert fixture_role_auth_backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)


def test_has_perm_user_with_gangrole(
    fixture_role_auth_backend: RoleAuthBackend, fixture_user: User, fixture_role: Role, fixture_gang: Gang, fixture_gang_permission: Permission
):
    fixture_role.permissions.add(fixture_gang_permission)

    assert not fixture_role_auth_backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)

    gang_role = UserGangRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang)
    gang_role.save()

    assert fixture_role_auth_backend.has_perm(fixture_user, fixture_gang_permission.codename, fixture_gang)


def test_has_perm_user_with_sectionrole(
    fixture_role_auth_backend: RoleAuthBackend,
    fixture_user: User,
    fixture_role: Role,
    fixture_gang_section: GangSection,
    fixture_gang_section_permission: Permission,
):
    fixture_role.permissions.add(fixture_gang_section_permission)

    assert not fixture_role_auth_backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)

    section_role = UserGangSectionRole.objects.create(user=fixture_user, role=fixture_role, obj=fixture_gang_section)
    section_role.save()

    assert fixture_role_auth_backend.has_perm(fixture_user, fixture_gang_section_permission.codename, fixture_gang_section)


def test_has_perm_inactive_user(
    fixture_role_auth_backend: RoleAuthBackend, fixture_user: User, fixture_organization: Organization, fixture_org_permission: Permission
):
    fixture_user.is_active = False
    fixture_user.save()
    assert not fixture_role_auth_backend.has_perm(fixture_user, fixture_org_permission.codename, fixture_organization)


def test_has_perm_no_obj(fixture_role_auth_backend: RoleAuthBackend, fixture_user: User, fixture_org_permission: Permission):
    assert not fixture_role_auth_backend.has_perm(fixture_user, fixture_org_permission.codename, None)


def test_has_perm_superuser_no_obj(fixture_role_auth_backend: RoleAuthBackend, fixture_superuser: User, fixture_org_permission: Permission):
    assert not fixture_role_auth_backend.has_perm(fixture_superuser, fixture_org_permission.codename, None)
