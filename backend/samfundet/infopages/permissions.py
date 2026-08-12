from __future__ import annotations

from typing import TYPE_CHECKING

from rest_framework.permissions import BasePermission

from root.utils.permissions import (
    SAMFUNDET_ADD_INFORMATIONPAGE,
    SAMFUNDET_VIEW_INFORMATIONPAGE,
    SAMFUNDET_CHANGE_INFORMATIONPAGE,
    SAMFUNDET_DELETE_INFORMATIONPAGE,
)

from samfundet.infopages.models import InformationPage, InformationPageRevision

if TYPE_CHECKING:
    from typing import Any

    from rest_framework.views import APIView
    from rest_framework.request import Request

INFORMATION_PAGE_OWNER_PERMISSIONS = (
    SAMFUNDET_ADD_INFORMATIONPAGE,
    SAMFUNDET_CHANGE_INFORMATIONPAGE,
    SAMFUNDET_DELETE_INFORMATIONPAGE,
)

# Which permission each method needs for a single page. POST is absent on purpose: there is no
# object yet, so the owner being written to is authorized by the write serializer instead.
_PERMISSION_BY_METHOD = {
    'GET': SAMFUNDET_VIEW_INFORMATIONPAGE,
    'HEAD': SAMFUNDET_VIEW_INFORMATIONPAGE,
    'OPTIONS': SAMFUNDET_VIEW_INFORMATIONPAGE,
    'PUT': SAMFUNDET_CHANGE_INFORMATIONPAGE,
    'DELETE': SAMFUNDET_DELETE_INFORMATIONPAGE,
}


class CanAdministerInformationPage(BasePermission):
    """Object-level check for the admin viewset. List/create scoping is the queryset's job."""

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        permission = _PERMISSION_BY_METHOD.get(request.method)
        if permission is None:
            return False

        # Only reachable through the browsable API, which re-checks permissions against whatever
        # object the response serializer was bound to. That makes the history detail endpoint hand
        # back a revision (as OPTIONS). Permissions live on the page, so resolve to it. Anything
        # else is refused rather than passed on, since has_perm on an unrelated model raises
        # instead of returning False.
        if isinstance(obj, InformationPageRevision):
            obj = obj.page
        if not isinstance(obj, InformationPage):
            return False

        return request.user.has_perm(permission, obj)
