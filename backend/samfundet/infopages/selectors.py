from __future__ import annotations

from typing import TYPE_CHECKING
from dataclasses import dataclass

from root.utils.permissions import (
    SAMFUNDET_ADD_INFORMATIONPAGE,
    SAMFUNDET_CHANGE_INFORMATIONPAGE,
    SAMFUNDET_DELETE_INFORMATIONPAGE,
)

from samfundet.roles import get_owner_permission_map
from samfundet.organization.models import Gang, GangSection
from samfundet.infopages.permissions import INFORMATION_PAGE_OWNER_PERMISSIONS

if TYPE_CHECKING:
    from samfundet.models import User


@dataclass(frozen=True)
class OwnerOption:
    """An owner the user may administer information pages for, and what they may do with it."""

    gang: Gang
    section: GangSection | None
    can_create: bool
    can_change: bool
    can_delete: bool


def owner_options_for(*, user: User) -> list[OwnerOption]:
    """
    Every gang and section the user may administer information pages for.

    Ordered so each gang is immediately followed by its own sections. If a user has access to
    at least one section of a gang, but not the gang itself, then the gang itself is still
    included but with every flag set to false. This is to simplify the frontend's dropdown
    rendering of the org tree.
    """
    capabilities = get_owner_permission_map(user=user, permissions=INFORMATION_PAGE_OWNER_PERMISSIONS)

    sections = GangSection.objects.filter(id__in=capabilities.sections).select_related('gang')
    sections_by_gang: dict[int, list[GangSection]] = {}
    for section in sections:
        sections_by_gang.setdefault(section.gang_id, []).append(section)

    gang_ids = set(capabilities.gangs) | set(sections_by_gang)
    gangs = Gang.objects.filter(id__in=gang_ids).select_related('organization')

    options: list[OwnerOption] = []
    for gang in sorted(gangs, key=_gang_sort_key):
        options.append(_option(gang=gang, section=None, permissions=capabilities.for_gang(gang.id)))
        options.extend(
            _option(gang=gang, section=section, permissions=capabilities.for_section(section.id))
            for section in sorted(sections_by_gang.get(gang.id, []), key=_section_sort_key)
        )

    return options


def _option(*, gang: Gang, section: GangSection | None, permissions: set[str]) -> OwnerOption:
    return OwnerOption(
        gang=gang,
        section=section,
        can_create=SAMFUNDET_ADD_INFORMATIONPAGE in permissions,
        can_change=SAMFUNDET_CHANGE_INFORMATIONPAGE in permissions,
        can_delete=SAMFUNDET_DELETE_INFORMATIONPAGE in permissions,
    )


def _gang_sort_key(gang: Gang) -> tuple[str, str]:
    return ((gang.organization.name if gang.organization else '').lower(), (gang.name_nb or '').lower())


def _section_sort_key(section: GangSection) -> str:
    return (section.name_nb or '').lower()
