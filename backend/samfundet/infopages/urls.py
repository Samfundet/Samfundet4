from __future__ import annotations

from typing import TYPE_CHECKING

from samfundet.infopages.views.admin import AdminInformationPageViewSet
from samfundet.infopages.views.public import PublicInformationPageViewSet

if TYPE_CHECKING:
    from rest_framework.routers import BaseRouter


def register(public_router: BaseRouter, admin_router: BaseRouter) -> None:
    public_router.register('information-pages', PublicInformationPageViewSet, basename='information-pages')
    admin_router.register('information-pages', AdminInformationPageViewSet, basename='admin-information-pages')
