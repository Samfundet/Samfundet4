from __future__ import annotations

from rest_framework import mixins, decorators
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from django.db import models
from django.http import JsonResponse

from root.custom_classes.permission_classes import RoleProtectedOrAnonReadOnlyObjectPermissions

from samfundet.serializers import SiteBannerSerializer
from samfundet.models.site_banner import SiteBanner


class SiteBannerView(mixins.CreateModelMixin, ReadOnlyModelViewSet):
    permission_classes = [RoleProtectedOrAnonReadOnlyObjectPermissions]
    serializer_class = SiteBannerSerializer

    def get_queryset(self) -> models.QuerySet:
        return SiteBanner.active().order_by('-start_at', '-created_at')

    @decorators.action(detail=False, methods=['get'], url_path='active')
    def active(self, request: Request) -> Response | JsonResponse:
        banner = self.get_queryset().first()
        if banner is None:
            return JsonResponse(None, safe=False)
        serializer = self.get_serializer(banner)
        return Response(serializer.data)
