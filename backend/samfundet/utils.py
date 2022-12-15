from __future__ import annotations
from typing import Sequence

from guardian.models import GroupObjectPermission, UserObjectPermission

from django.contrib.auth.models import Group, User

from .models import (
    Venue,
    Profile,
    Saksdokument,
    UserPreference,
    Event,
)

from .dto import (
    UserDto,
    VenueDto,
    GroupDto,
    EventDto,
    ProfileDto,
    SaksdokumentDto,
    UserPreferenceDto,
    ObjectPermissionDto,
)

###


def object_permission_to_dataclass(*, object_permission: UserObjectPermission) -> ObjectPermissionDto:
    """Also works with GroupObjectPermission."""
    permission = object_permission.permission
    return ObjectPermissionDto(
        obj_pk=object_permission.object_pk,
        permission=f'{permission.content_type.app_label}.{permission.codename}',
    )


def object_permissions_to_dataclass(*, object_permissions: list[UserObjectPermission]) -> list[ObjectPermissionDto]:
    return [object_permission_to_dataclass(object_permission=op) for op in object_permissions]


###


def user_to_dataclass(*, user: User) -> UserDto:
    user_object_perms_qs = UserObjectPermission.objects.filter(user=user)
    user_object_permissions = object_permissions_to_dataclass(object_permissions=user_object_perms_qs)

    user_groups = user.groups.all()
    group_object_perms_qs = GroupObjectPermission.objects.filter(group__in=user_groups)
    group_object_permissions = object_permissions_to_dataclass(object_permissions=group_object_perms_qs)

    user_preference, _created = UserPreference.objects.get_or_create(user=user)
    profile, _created = Profile.objects.get_or_create(user=user)

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
        groups=groups_to_dataclass(groups=user.groups.all()),
        permissions=user.get_all_permissions(),
        object_permissions=user_object_permissions + group_object_permissions,
    )


def users_to_dataclass(*, users: Sequence[User]) -> list[UserDto]:
    return [user_to_dataclass(user=user) for user in users]


###


def group_to_dataclass(*, group: Group) -> GroupDto:
    return GroupDto(
        id=group.id,
        name=group.name,
    )


def groups_to_dataclass(*, groups: Sequence[Group]) -> list[GroupDto]:
    return [group_to_dataclass(group=group) for group in groups]


###


def event_to_dataclass(*, event: Event) -> EventDto:
    return EventDto(
        id=event.id,
        title_no=event.title_no,
        title_en=event.title_en,
        start_dt=event.start_dt,
        end_dt=event.end_dt,
        description_long_no=event.description_long_no,
        description_long_en=event.description_long_en,
        description_short_no=event.description_short_en,
        description_short_en=event.description_short_en,
        publish_dt=event.publish_dt,
        host=event.host,
        location=event.location,
        event_group=event.event_group
    )


def events_to_dataclass(*, events: Sequence[Event]) -> list[EventDto]:
    return [event_to_dataclass(event=event) for event in events]


###


def user_preference_to_dataclass(*, user_preference: UserPreference) -> UserPreferenceDto:
    return UserPreferenceDto(
        id=user_preference.id,
        theme=user_preference.theme,
    )


###


def profile_to_dataclass(*, profile: Profile) -> ProfileDto:
    return ProfileDto(
        id=profile.id,
        nickname=profile.nickname,
    )


###


def venue_to_dataclass(*, venue: Venue) -> VenueDto:
    return VenueDto(
        id=venue.id,
        name=venue.name,
        description=venue.description,
        floor=venue.floor,
        last_renovated=venue.last_renovated,
        handicapped_approved=venue.handicapped_approved,
        responsible_crew=venue.responsible_crew,
    )


###


def saksdokument_to_dataclass(*, saksdokument: Saksdokument) -> SaksdokumentDto:
    return SaksdokumentDto(
        id=saksdokument.id,
        title_no=saksdokument.title_no,
        title_en=saksdokument.title_en,
        publication_date=saksdokument.publication_date,
        category=saksdokument.category,
        file=saksdokument.file,
    )
