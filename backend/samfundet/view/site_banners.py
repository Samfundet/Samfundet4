from __future__ import annotations

from rest_framework import decorators
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny

from django.db import models

from samfundet.serializers import SiteBannerSerializer
from samfundet.models.site_banner import SiteBanner


class SiteBannerView(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = SiteBannerSerializer

    def get_queryset(self) -> models.QuerySet:
        return SiteBanner.active().order_by('-start_at', '-created_at')

    @decorators.action(detail=False, methods=['get'], url_path='active')
    def active(self, request: Request) -> Response:
        banner = self.get_queryset().first()
        if banner is None:
            return Response(None)
        serializer = self.get_serializer(banner)
        return Response(serializer.data)
