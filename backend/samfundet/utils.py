from __future__ import annotations
from typing import Sequence
from django.http import QueryDict
from django.db.models import Q
from django.db.models.query import QuerySet
from django.contrib.auth.models import Group

from guardian.models import GroupObjectPermission, UserObjectPermission

from .models import (
    User,
    Venue,
    Event,
    Profile,
    TextItem,
    EventGroup,
    ClosedPeriod,
    Saksdokument,
    UserPreference,
)

from .dto import (
    UserDto,
    VenueDto,
    ClosedPeriodDto,
    GroupDto,
    EventDto,
    TextItemDto,
    EventGroupDto,
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


def eventgroup_to_dataclass(*, event_group: EventGroup) -> EventGroupDto:
    return EventGroupDto(id=event_group.id, name=event_group.name)


def event_to_dataclass(*, event: Event) -> EventDto:
    return EventDto(
        id=event.id,
        title_nb=event.title_nb,
        title_en=event.title_en,
        start_dt=event.start_dt,
        end_dt=event.end_dt(),
        description_long_nb=event.description_long_nb,
        description_long_en=event.description_long_en,
        description_short_nb=event.description_short_en,
        description_short_en=event.description_short_en,
        publish_dt=event.publish_dt,
        host=event.host,
        location=event.location,
        event_group=eventgroup_to_dataclass(event_group=event.event_group),
        price_group=event.price_group,
        status_group=event.status_group,
        age_group=event.age_group,
        banner_image='' if not event.banner_image else event.banner_image.path,
        duration=event.duration,
        codeword=event.codeword,
    )


def events_to_dataclass(*, events: Sequence[Event]) -> list[EventDto]:
    return [event_to_dataclass(event=event) for event in events]


def event_query(query: QueryDict, events: QuerySet[Event] = None) -> QuerySet[Event]:  # pylint: disable=positional-arguments
    if not events:
        events = Event.objects.all()
    search = query.get('search', None)
    if search:
        events = events.filter(
            Q(title_nb__icontains=search) | Q(title_en__icontains=search) | Q(description_long_nb__icontains=search) |
            Q(description_long_en__icontains=search) | Q(description_short_en=search) | Q(description_short_nb=search) | Q(location__icontains=search) |
            Q(event_group__name=search)
        )
    event_group = query.get('event_group', None)
    if event_group:
        events = events.filter(event_group__id=event_group)

    location = query.get('venue', None)
    if location:
        events = events.filter(location__icontains=location)  # TODO should maybe be a foreignKey?
    return events


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
        title_nb=saksdokument.title_nb,
        title_en=saksdokument.title_en,
        publication_date=saksdokument.publication_date,
        category=saksdokument.category,
        file=saksdokument.file,
    )


def closedperiod_to_dataclass(*, closed_period: ClosedPeriod) -> ClosedPeriodDto:
    return ClosedPeriodDto(
        id=closed_period.id,
        message_en=closed_period.message_en,
        description_en=closed_period.description_en,
        message_nb=closed_period.message_nb,
        description_nb=closed_period.description_en,
        start_dt=closed_period.start_dt,
        end_dt=closed_period.end_dt,
    )


def textitem_to_dataclass(*, text_item: TextItem) -> TextItemDto:
    return TextItemDto(
        id=text_item.id,
        key=text_item.key,
        text_en=text_item.text_en,
        text_nb=text_item.text_nb,
    )
