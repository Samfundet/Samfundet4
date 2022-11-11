from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime

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
    groups: list[GroupDto]
    user_permissions: list[PermissionDto]


@dataclass_json
@dataclass
class GroupDto:
    id: int
    name: str
    permissions: list[PermissionDto]


@dataclass_json
@dataclass
class PermissionDto:
    id: int
    name: str
    content_type: ContentTypeDto
    codename: str


@dataclass_json
@dataclass
class ContentTypeDto:
    id: int
    app_label: str
    model: str


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
class EventDto:
    id: int
    title_no: str
    title_en: str
    start_dt: datetime
    end_dt: datetime
    description_long_no: str
    description_long_en: str
    description_short_no: str
    description_short_en: str
    publish_dt: datetime
    host: str
    location: str
    event_group: EventGroupDto


@dataclass_json
@dataclass
class EventGroupDto:
    id: int
