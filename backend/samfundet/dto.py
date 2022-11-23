from __future__ import annotations

from typing import Optional
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
    groups: list[GroupDto]
    user_permissions: Optional[list[PermissionDto]]
    user_object_perms: Optional[list[UserObjectPermissionDto]]
    content_type: ContentTypeDto


@dataclass_json
@dataclass
class GroupDto:
    id: int
    name: str
    permissions: list[PermissionDto]
    group_object_perms: Optional[list[GroupObjectPermissionDto]]
    content_type: ContentTypeDto


@dataclass_json
@dataclass
class PermissionDto:
    id: int
    name: str
    content_type: ContentTypeDto
    codename: str


@dataclass_json
@dataclass
class UserObjectPermissionDto:
    id: int
    permission: PermissionDto
    content_type: ContentTypeDto
    obj_id: int
    user: UserDto


@dataclass_json
@dataclass
class GroupObjectPermissionDto:
    id: int
    permission: PermissionDto
    content_type: ContentTypeDto
    obj_id: int
    group: GroupDto


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
    content_type: ContentTypeDto


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
    content_type: ContentTypeDto


@dataclass_json
@dataclass
class EventGroupDto:
    id: int
    content_type: ContentTypeDto
