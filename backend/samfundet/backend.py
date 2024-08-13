from __future__ import annotations

from typing import Any

from django.contrib.auth.backends import BaseBackend

from samfundet.utils import get_perm
from samfundet.models import User
from samfundet.models.role import UserOrgRole, UserGangRole, UserGangSectionRole


class RoleAuthBackend(BaseBackend):
    def has_perm(self, user_obj: User, perm: str, obj: Any = None) -> bool:  # noqa: C901
        if not user_obj.is_active or obj is None:
            return False

        if user_obj.is_superuser:
            return True

        permission = get_perm(perm=perm, model=obj)

        if hasattr(obj, 'resolve_org'):
            org_id = obj.resolve_org(return_id=True)
            if org_id is not None and UserOrgRole.objects.filter(user=user_obj, obj__id=org_id, role__permissions=permission).exists():
                return True

        if hasattr(obj, 'resolve_gang'):
            gang_id = obj.resolve_gang(return_id=True)
            if gang_id is not None and UserGangRole.objects.filter(user=user_obj, obj__id=gang_id, role__permissions=permission).exists():
                return True

        if hasattr(obj, 'resolve_section'):
            section_id = obj.resolve_section(return_id=True)
            if section_id is not None and UserGangSectionRole.objects.filter(user=user_obj, obj__id=section_id, role__permissions=permission).exists():
                return True

        return False
