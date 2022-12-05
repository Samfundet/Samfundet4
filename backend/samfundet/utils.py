from __future__ import annotations

from guardian.models import GroupObjectPermission, UserObjectPermission
from guardian.shortcuts import get_content_type

from django.contrib.auth.models import Group, User, Permission
from django.contrib.contenttypes.models import ContentType

from .models import (
    Venue,
    Profile,
    Saksdokument,
    UserPreference,
)

from .dto import (
    UserDto,
    VenueDto,
    GroupDto,
    ProfileDto,
    SaksdokumentDto,
    PermissionDto,
    ContentTypeDto,
    UserPreferenceDto,
    UserObjectPermissionDto,
    GroupObjectPermissionDto,
)

###


def user_to_dataclass(*, user: User, flat: bool) -> UserDto:
    user_object_perms_qs = UserObjectPermission.objects.filter(user=user) if not flat else None
    user_object_perms_dtos = user_object_perms_to_dataclass(user_object_perms=user_object_perms_qs) if not flat else None

    user_preference, _created = UserPreference.objects.get_or_create(user=user)
    profile, _created = Profile.objects.get_or_create(user=user)

    content_type = get_content_type(user)
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
        user_preference=user_preference_to_dataclass(user_preference=user_preference),
        profile=profile_to_dataclass(profile=profile),
        content_type=content_type_to_dataclass(content_type=content_type),
        groups=groups_to_dataclass(groups=user.groups.all(), flat=False),
        user_permissions=permissions_to_dataclass(permissions=user.user_permissions.all()),
        user_object_perms=user_object_perms_dtos,
    )


def users_to_dataclass(*, users: list[User], flat: bool) -> list[UserDto]:
    # TODO: maybe support QuerySet[User].
    return [user_to_dataclass(user=user, flat=flat) for user in users]


###


def group_to_dataclass(*, group: Group, flat: bool) -> GroupDto:
    group_object_perms_qs = GroupObjectPermission.objects.filter(group=group) if not flat else None
    group_object_perms_dtos = group_object_perms_to_dataclass(group_object_perms=group_object_perms_qs) if not flat else None
    return GroupDto(
        id=group.id,
        name=group.name,
        permissions=permissions_to_dataclass(permissions=group.permissions.all()),
        group_object_perms=group_object_perms_dtos,
        content_type=content_type_to_dataclass(content_type=get_content_type(group)),
    )


def groups_to_dataclass(*, groups: list[Group], flat: bool) -> list[GroupDto]:
    # TODO: maybe support QuerySet[Group].
    return [group_to_dataclass(group=group, flat=flat) for group in groups]


###


def user_object_perm_to_dataclass(*, user_object_perm: UserObjectPermission) -> UserObjectPermissionDto:
    return UserObjectPermissionDto(
        id=user_object_perm.id,
        permission=permission_to_dataclass(permission=user_object_perm.permission),
        content_type=content_type_to_dataclass(content_type=user_object_perm.content_type),
        obj_id=user_object_perm.object_pk,
        user=user_to_dataclass(user=user_object_perm.user, flat=True),
    )


def user_object_perms_to_dataclass(*, user_object_perms: list[UserObjectPermission]) -> list[UserObjectPermissionDto]:
    # TODO: maybe support QuerySet[UserObjectPermission].
    return [user_object_perm_to_dataclass(user_object_perm=uop) for uop in user_object_perms]


###


def group_object_perm_to_dataclass(*, group_object_perm: GroupObjectPermission) -> GroupObjectPermissionDto:
    return GroupObjectPermissionDto(
        id=group_object_perm.id,
        permission=permission_to_dataclass(permission=group_object_perm.permission),
        content_type=content_type_to_dataclass(content_type=group_object_perm.content_type),
        obj_id=group_object_perm.object_pk,
        group=group_to_dataclass(group=group_object_perm.group, flat=True),
    )


def group_object_perms_to_dataclass(*, group_object_perms: list[GroupObjectPermission]) -> list[GroupObjectPermissionDto]:
    # TODO: maybe support QuerySet[GroupObjectPermission].
    return [group_object_perm_to_dataclass(group_object_perm=gop) for gop in group_object_perms]


###


def content_type_to_dataclass(*, content_type: ContentType) -> ContentTypeDto:
    return ContentTypeDto(
        id=content_type.id,
        app_label=content_type.app_label,
        model=content_type.model,
    )


def content_types_to_dataclass(*, content_types: list[ContentType]) -> list[ContentTypeDto]:
    # TODO: maybe support QuerySet[ContentType].
    return [content_type_to_dataclass(content_type=content_type) for content_type in content_types]


###


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


###


def venue_to_dataclass(*, venue: Venue) -> VenueDto:
    content_type = get_content_type(venue)
    return VenueDto(
        id=venue.id,
        name=venue.name,
        description=venue.description,
        floor=venue.floor,
        last_renovated=venue.last_renovated,
        handicapped_approved=venue.handicapped_approved,
        responsible_crew=venue.responsible_crew,
        content_type=content_type_to_dataclass(content_type=content_type),
    )


###


def user_preference_to_dataclass(*, user_preference: UserPreference) -> UserPreferenceDto:
    content_type = get_content_type(user_preference)
    return UserPreferenceDto(
        id=user_preference.id,
        theme=user_preference.theme,
        content_type=content_type_to_dataclass(content_type=content_type),
    )


###


def profile_to_dataclass(*, profile: Profile) -> ProfileDto:
    content_type = get_content_type(profile)
    return ProfileDto(
        id=profile.id,
        nickname=profile.nickname,
        content_type=content_type_to_dataclass(content_type=content_type),
    )


###


def saksdokument_to_dataclass(*, saksdokument: Saksdokument) -> SaksdokumentDto:
    content_type = get_content_type(saksdokument)
    return SaksdokumentDto(
        id=saksdokument.id,
        title_no=saksdokument.title_no,
        title_en=saksdokument.title_en,
        publication_date=saksdokument.publication_date,
        category=saksdokument.category,
        file=saksdokument.file,
        content_type=content_type_to_dataclass(content_type=content_type),
    )
