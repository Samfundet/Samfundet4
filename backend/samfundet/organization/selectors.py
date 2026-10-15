from __future__ import annotations

from typing import TYPE_CHECKING
from dataclasses import dataclass

from root.utils.permissions import SAMFUNDET_VIEW_GANG

from samfundet.roles import get_owner_permission_map
from samfundet.models.role import UserGangRole, UserGangSectionRole
from samfundet.organization.models import Gang, Organization

if TYPE_CHECKING:
    from samfundet.models import User

WEB_ORGANIZATION_NAME = 'Samfundet'
WEB_GANG_ABBREVIATION = 'MG'
WEB_SECTION_NAME = 'Web'


@dataclass(frozen=True)
class WebMember:
    username: str
    email: str


@dataclass(frozen=True)
class OrganizationGangs:
    organization: Organization
    gangs: list[Gang]


def web_members() -> list[WebMember]:
    """Active users with a role on the MG gang or its Web section (single source of truth)."""
    section_roles = UserGangSectionRole.objects.filter(
        user__is_active=True,
        obj__name_nb__iexact=WEB_SECTION_NAME,
        obj__gang__abbreviation__iexact=WEB_GANG_ABBREVIATION,
        obj__gang__organization__name__iexact=WEB_ORGANIZATION_NAME,
    ).select_related('user')
    gang_roles = UserGangRole.objects.filter(
        user__is_active=True,
        obj__abbreviation__iexact=WEB_GANG_ABBREVIATION,
        obj__organization__name__iexact=WEB_ORGANIZATION_NAME,
    ).select_related('user')

    members: dict[int, WebMember] = {}
    for role in (*section_roles, *gang_roles):
        members.setdefault(role.user_id, WebMember(username=role.user.username, email=role.user.email))
    return list(members.values())


def organized_gangs_for(*, user: User) -> list[OrganizationGangs]:
    """Every gang the user may view, grouped by the organization it belongs to."""
    capabilities = get_owner_permission_map(user=user, permissions=[SAMFUNDET_VIEW_GANG])

    gangs = Gang.objects.filter(id__in=capabilities.gangs, organization__isnull=False).select_related('gang_type', 'info_page')

    gangs_by_org: dict[int, list[Gang]] = {}
    for gang in gangs:
        gangs_by_org.setdefault(gang.organization_id, []).append(gang)

    organizations = Organization.objects.filter(id__in=gangs_by_org)

    return [
        OrganizationGangs(organization=organization, gangs=sorted(gangs_by_org[organization.id], key=_gang_sort_key))
        for organization in sorted(organizations, key=lambda org: org.id)
    ]


def _gang_sort_key(gang: Gang) -> str:
    return (gang.name_nb or '').lower()
