from __future__ import annotations

from django.contrib.auth.models import Group, User, Permission
from django.contrib.contenttypes.models import ContentType

from .dto import GroupDto, UserDto, PermissionDto, ContentTypeDto


def user_to_dataclass(*, user: User) -> UserDto:
    return UserDto(
        id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        is_staff=user.is_staff,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        date_joined=user.date_joined,
        last_login=user.last_login,
        groups=groups_to_dataclass(groups=user.groups.all()),
        user_permissions=permissions_to_dataclass(permissions=user.user_permissions.all()),
    )


def users_to_dataclass(*, users: list[User]) -> list[UserDto]:
    # TODO: maybe support QuerySet[User].
    return [user_to_dataclass(user=user) for user in users]


def group_to_dataclass(*, group: Group) -> GroupDto:
    return GroupDto(
        id=group.id,
        name=group.name,
        permissions=permissions_to_dataclass(permissions=group.permissions.all()),
    )


def groups_to_dataclass(*, groups: list[Group]) -> list[GroupDto]:
    # TODO: maybe support QuerySet[Group].
    return [group_to_dataclass(group=group) for group in groups]


def content_type_to_dataclass(*, content_type: ContentType) -> ContentTypeDto:
    return ContentTypeDto(
        id=content_type.id,
        app_label=content_type.app_label,
        model=content_type.model,
    )


def content_types_to_dataclass(*, content_types: list[ContentType]) -> list[ContentTypeDto]:
    # TODO: maybe support QuerySet[ContentType].
    return [content_type_to_dataclass(content_type=content_type) for content_type in content_types]


def permission_to_dataclass(*, permission: Permission) -> PermissionDto:
    return PermissionDto(
        id=permission.id,
        name=permission.name,
        content_type=content_type_to_dataclass(content_type=permission.content_type),
        codename=permission.codename,
    )


def permissions_to_dataclass(*, permissions: list[Permission]) -> list[PermissionDto]:
    # TODO: maybe support QuerySet[Permission].
    return [permission_to_dataclass(permission=permission) for permission in permissions]
