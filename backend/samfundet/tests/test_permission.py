from __future__ import annotations

from collections.abc import Iterator

import pytest

from django.db import models
from django.urls import reverse
from django.db.models import Model
from django.test.client import Client

from root.utils import routes

from samfundet.models.general import (
    User,
    PermissionGroup,
    CustomPermisionsModel,
)


@pytest.fixture
def fixture_permission_group() -> Iterator[PermissionGroup]:
    permission_group = PermissionGroup.objects.create(name='test_permission_group')
    yield permission_group
    permission_group.delete()


@pytest.fixture
def fixture_user_without_perm(fixture_user: User) -> Iterator[User]:
    user = next(fixture_user)
    user.permission_groups.clear()
    yield user


@pytest.fixture
def fixture_user_with_perm(fixture_user: User, fixture_permission_group: PermissionGroup) -> Iterator[User]:
    user = next(fixture_user)
    user.permission_groups.clear()
    user.permission_groups.add(fixture_permission_group)
    yield user


class TestPermisionsModel(CustomPermisionsModel):
    onwer = models.ForeignKey(PermissionGroup)

    def has_perm(self, user: User) -> bool:
        return user is self.owner


@pytest.fixture
def fixture_object_user_with_perm(fixture_user: User) -> Iterator[TestPermisionsModel]:
    obj = TestPermisionsModel.objects.create(owner=fixture_user)
    yield obj
    obj.delete()


class TestHasPerm:
    def test_has_perm(
        self,
        fixture_user: User,
        fixture_permission_group: PermissionGroup,
    ):
        fixture_user.permission_groups.add(fixture_permission_group)
        assert fixture_user.has_perm(fixture_permission_group.name) is True

    def test_has_not_perm(
        self,
        fixture_user: User,
        fixture_permission_group: PermissionGroup,
    ):
        assert fixture_user.has_perm(fixture_permission_group.name) is False

    def test_has_child_perm(
        self,
        fixture_user: User,
        fixture_permission_group: PermissionGroup,
    ):
        child_permission_group = PermissionGroup.objects.create(name='child_permission_group', owner=fixture_permission_group)
        fixture_user.permission_groups.add(fixture_permission_group)
        assert fixture_user.has_perm(child_permission_group.name) is True
        child_permission_group.delete()

    def test_has_not_child_perm(
        self,
        fixture_user: User,
        fixture_permission_group: PermissionGroup,
    ):
        child_permission_group = PermissionGroup.objects.create(name='child_permission_group', owner=fixture_permission_group)
        assert fixture_user.has_perm(child_permission_group.name) is False
        child_permission_group.delete()

    def test_has_object_perm(
        self,
        fixture_user: User,
        fixture_permission_group: PermissionGroup,
    ):
        assert fixture_user.has_perm('overide_perm', obj=None) is True


class TestControlPanellPerms:
    web_member: PermissionGroup = PermissionGroup.objects.create(name='web_member')
    control_panel_admin: PermissionGroup = PermissionGroup.objects.create(name='control_panel_admin', owner=web_member)
    recruitment_admin: PermissionGroup = PermissionGroup.objects.create(name='recruitment_admin', owner=web_member)
    redda_member: PermissionGroup = PermissionGroup.objects.create(name='redda_member', owner=web_member)

    bad_user: User = User.objects.create(username='bad_user')

    control_panel_user: User = User.objects.create(username='control_panel_user')
    control_panel_user.permission_groups.add(control_panel_admin)

    recruitment_user: User = User.objects.create(username='recruitment_user')
    recruitment_user.permission_groups.add(recruitment_admin)

    redda_user: User = User.objects.create(username='redda_user')
    redda_user.permission_groups.add(redda_member)

    def test_deny_bad_user_control_panel(
        self,
        client: Client,
    ):
        client.force_login(self.bad_user)
        response = client.get(reverse(routes.samfundet__control_panel__index))
        assert response.status_code == 403

    def test_allow_user_control_panel(
        self,
        client: Client,
    ):
        client.force_login(self.control_panel_user)
        response = client.get(reverse(routes.samfundet__control_panel__index))
        assert response.status_code == 200
