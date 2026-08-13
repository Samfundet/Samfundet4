from __future__ import annotations

from typing import TYPE_CHECKING
from dataclasses import field, dataclass

from .models.role import UserOrgRole, UserGangRole, UserRoleBase, UserGangSectionRole
from .models.general import Gang, GangSection

if TYPE_CHECKING:
    from collections.abc import Sequence

    from .models import User


@dataclass(frozen=True)
class OwnerPermissionMap:
    """
    Which of the requested permissions a user holds, per gang and per section.

    Only owners where the user holds at least one of the requested permissions are included.
    """

    gangs: dict[int, set[str]] = field(default_factory=dict)
    sections: dict[int, set[str]] = field(default_factory=dict)

    def for_gang(self, gang_id: int | None) -> set[str]:
        return self.gangs.get(gang_id, set()) if gang_id is not None else set()

    def for_section(self, section_id: int | None) -> set[str]:
        return self.sections.get(section_id, set()) if section_id is not None else set()


def get_owner_permission_map(*, user: User | None, permissions: Sequence[str]) -> OwnerPermissionMap:
    """
    Maps gang and section ids to the subset of `permissions` the user holds for them.

    Permissions inherit downwards through the hierarchy. Model-level permissions (superuser,
    directly assigned or through a group) apply everywhere. Org roles apply to every gang in the
    org and every section of those gangs, gang roles to that gang and its sections, and section
    roles to that single section.
    """
    if not user or not user.is_authenticated:
        return OwnerPermissionMap()

    wanted = set(permissions)
    global_perms = {perm for perm in wanted if user.has_perm(perm)}

    gangs = _gang_permissions(user=user, wanted=wanted, global_perms=global_perms)
    sections = _section_permissions(user=user, wanted=wanted, global_perms=global_perms, gangs=gangs)

    return OwnerPermissionMap(gangs=gangs, sections=sections)


def _gang_permissions(*, user: User, wanted: set[str], global_perms: set[str]) -> dict[int, set[str]]:
    gangs: dict[int, set[str]] = {}

    if global_perms:
        gangs = {gang_id: set(global_perms) for gang_id in Gang.objects.values_list('id', flat=True)}

    org_perms = _role_permissions_by_object(role_model=UserOrgRole, user=user, wanted=wanted)
    for gang_id, org_id in Gang.objects.filter(organization_id__in=org_perms).values_list('id', 'organization_id'):
        gangs.setdefault(gang_id, set()).update(org_perms[org_id])

    for gang_id, perms in _role_permissions_by_object(role_model=UserGangRole, user=user, wanted=wanted).items():
        gangs.setdefault(gang_id, set()).update(perms)

    return gangs


def _section_permissions(*, user: User, wanted: set[str], global_perms: set[str], gangs: dict[int, set[str]]) -> dict[int, set[str]]:
    sections: dict[int, set[str]] = {}

    if global_perms:
        sections = {section_id: set(global_perms) for section_id in GangSection.objects.values_list('id', flat=True)}

    # Sections inherit whatever their gang grants, which already includes anything the org above it passed down.
    for section_id, gang_id in GangSection.objects.filter(gang_id__in=gangs).values_list('id', 'gang_id'):
        sections.setdefault(section_id, set()).update(gangs[gang_id])

    for section_id, perms in _role_permissions_by_object(role_model=UserGangSectionRole, user=user, wanted=wanted).items():
        sections.setdefault(section_id, set()).update(perms)

    return sections


def _role_permissions_by_object(*, role_model: type[UserRoleBase], user: User, wanted: set[str]) -> dict[int, set[str]]:
    """Maps object id to the subset of `wanted` that the user's roles on that object grant."""
    granted_by_object: dict[int, set[str]] = {}

    for user_role in role_model.objects.filter(user=user).prefetch_related('role__permissions__content_type'):
        names = {f'{permission.content_type.app_label}.{permission.codename}' for permission in user_role.role.permissions.all()}
        granted = names & wanted
        if granted:
            granted_by_object.setdefault(user_role.obj_id, set()).update(granted)

    return granted_by_object
