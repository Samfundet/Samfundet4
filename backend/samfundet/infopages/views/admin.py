from __future__ import annotations

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import BaseSerializer

from django.db.models import QuerySet
from django.shortcuts import get_object_or_404

from root.constants import WebFeatures
from root.custom_classes.permission_classes import FeatureEnabled

from samfundet.infopages.models import InformationPage
from samfundet.infopages.selectors import owner_options_for
from samfundet.infopages.permissions import CanAdministerInformationPage
from samfundet.infopages.serializers.admin import (
    OwnerOptionSerializer,
    InformationPageRevisionSerializer,
    AdminInformationPageListSerializer,
    AdminInformationPageReadSerializer,
    AdminInformationPageWriteSerializer,
    InformationPageRevisionListSerializer,
)


class AdminInformationPageViewSet(ModelViewSet):
    feature_key = WebFeatures.INFORMATION
    permission_classes = (
        FeatureEnabled,
        IsAuthenticated,
        CanAdministerInformationPage,
    )
    lookup_field = 'slug_field'
    # Exclude PATCH, since updates replaces the whole page content and creates a revision from it,
    # so a partial body update would be a bit ambiguous in behavior.
    http_method_names = ['get', 'post', 'put', 'delete', 'head', 'options']

    def get_serializer_class(self) -> type[BaseSerializer]:
        if self.action in ('create', 'update'):
            return AdminInformationPageWriteSerializer
        if self.action == 'list':
            return AdminInformationPageListSerializer
        return AdminInformationPageReadSerializer

    def get_queryset(self) -> QuerySet[InformationPage]:
        return InformationPage.objects.administered_by(self.request.user).with_owner()

    def create(self, request: Request, *args: object, **kwargs: object) -> Response:
        return self._write(request, status_code=status.HTTP_201_CREATED)

    def update(self, request: Request, *args: object, **kwargs: object) -> Response:
        return self._write(request, instance=self.get_object())

    def _write(self, request: Request, *, instance: InformationPage | None = None, status_code: int = status.HTTP_200_OK) -> Response:
        serializer = AdminInformationPageWriteSerializer(instance=instance, data=request.data, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        page = serializer.save()

        read = AdminInformationPageReadSerializer(page, context=self.get_serializer_context())
        return Response(read.data, status=status_code)

    @action(detail=False, methods=['get'], url_path='owner-options')
    def owner_options(self, request: Request) -> Response:
        """Lists the gangs and sections the user may create, change or delete information pages for."""
        options = owner_options_for(user=request.user)
        return Response(OwnerOptionSerializer(options, many=True).data)

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request: Request, **kwargs: object) -> Response:
        """Every revision of the page, newest first."""
        page = self.get_object()
        revisions = page.revisions.select_related('created_by')
        return Response(InformationPageRevisionListSerializer(revisions, many=True).data)

    @action(detail=True, methods=['get'], url_path=r'history/(?P<version>[0-9]+)', url_name='history-detail')
    def history_detail(self, request: Request, version: str, **kwargs: object) -> Response:
        """A single revision, body included."""
        page = self.get_object()
        revision = get_object_or_404(page.revisions.select_related('created_by'), version=version)
        return Response(InformationPageRevisionSerializer(revision).data)
