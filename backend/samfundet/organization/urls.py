from __future__ import annotations

from typing import TYPE_CHECKING

from samfundet.organization.views.admin import AdminGangViewSet, AdminGangSectionViewSet
from samfundet.organization.views.public import PublicGangTypeView

if TYPE_CHECKING:
    from rest_framework.routers import BaseRouter


def register(public_router: BaseRouter, admin_router: BaseRouter) -> None:
    public_router.register('gangs/organized', PublicGangTypeView, basename='gangs-organized')

    admin_router.register('gangs', AdminGangViewSet, basename='admin-gangs')
    admin_router.register('gangsections', AdminGangSectionViewSet, basename='admin-gangsections')
