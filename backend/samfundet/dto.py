from __future__ import annotations

from datetime import datetime
from dataclasses import dataclass

from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class UserDto:
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    is_staff: bool
    is_active: bool
    is_superuser: bool
    date_joined: datetime
    last_login: datetime
    permissions: list[str]
    object_permissions: list[ObjectPermissionDto]
    # Related models:
    groups: list[GroupDto]
    user_preference: UserPreferenceDto
    profile: ProfileDto


@dataclass_json
@dataclass
class GroupDto:
    id: int
    name: str


@dataclass_json
@dataclass
class ObjectPermissionDto:
    """Sub type for UserDto."""
    permission: str
    obj_pk: int


@dataclass_json
@dataclass
class VenueDto:
    id: int
    name: str
    description: str
    floor: int
    last_renovated: int
    handicapped_approved: bool
    responsible_crew: str


@dataclass_json
@dataclass
class ClosedPeriodDto:
    id: int
    message_no: str
    description_no: str
    message_en: str
    description_en: str
    start_dt: datetime
    end_dt: datetime


@dataclass_json
@dataclass
class EventDto:
    id: int
    title_no: str
    title_en: str
    description_long_no: str
    description_long_en: str
    description_short_no: str
    description_short_en: str
    location: str
    event_group: EventGroupDto
    status_group: str
    age_group: str
    codeword: str
    start_dt: datetime
    duration: int
    end_dt: datetime
    publish_dt: datetime
    host: str
    banner_image: str
    price_group: str


@dataclass_json
@dataclass
class EventGroupDto:
    id: int
    name: str


@dataclass_json
@dataclass
class UserPreferenceDto:
    id: int
    theme: str


@dataclass_json
@dataclass
class ProfileDto:
    id: int
    nickname: str


@dataclass_json
@dataclass
class SaksdokumentDto:
    id: int
    title_no: str
    title_en: str
    publication_date: datetime
    category: str
    file: str


@dataclass_json
@dataclass
class GangDto:
    id: int
    name_no: str
    name_en: str
    abbreviation: str
    webpage: str
    logo: str
    gang_type: int
    info_page: int


@dataclass_json
@dataclass
class GangTypeDto:
    id: int
    title_no: str
    title_en: str
    gangs: list[GangDto]
