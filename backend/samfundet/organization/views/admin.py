from __future__ import annotations

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.serializers import BaseSerializer

from django.db.models import ProtectedError

from root.constants import WebFeatures
from root.custom_classes.permission_classes import FeatureEnabled, RoleProtectedObjectPermissions

from samfundet.organization.models import Gang, GangType, GangSection
from samfundet.organization.selectors import organized_gangs_for
from samfundet.organization.serializers.admin import AdminGangTypeSerializer, AdminGangSectionSerializer, AdminOrganizedGangsSerializer
from samfundet.organization.serializers.public import PublicGangSerializer


class AdminGangViewSet(ModelViewSet):
    feature_key = WebFeatures.GANGS
    permission_classes = (
        FeatureEnabled,
        RoleProtectedObjectPermissions,
    )
    queryset = Gang.objects.all()
    serializer_class = PublicGangSerializer

    def get_serializer_class(self) -> type[BaseSerializer]:
        if self.action == 'list':
            return AdminOrganizedGangsSerializer
        return PublicGangSerializer

    def list(self, request: Request, *args: object, **kwargs: object) -> Response:
        organizations = organized_gangs_for(user=request.user)
        return Response(data=self.get_serializer(organizations, many=True).data)

    def destroy(self, request: Request, *args: object, **kwargs: object) -> Response:
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError as e:
            if any(isinstance(obj, GangSection) for obj in e.protected_objects):
                detail = 'Cannot delete gang, it still has sections.'
            else:
                detail = 'Cannot delete gang, it is in use by other objects.'
            return Response(status=status.HTTP_409_CONFLICT, data={'detail': detail})

    @action(detail=False, methods=['get'], url_path='types/(?P<organization>[0-9]+)', url_name='types-for-organization')
    def types_for_organization(self, request: Request, organization: int) -> Response:
        data = GangType.objects.filter(organization=organization)
        serializer = AdminGangTypeSerializer(data, many=True)
        return Response(data=serializer.data)

    @action(detail=True, methods=['get'], url_path='sections', url_name='gangsections-for-gang')
    def gang_sections(self, request: Request, pk: int) -> Response:
        data = GangSection.objects.filter(gang=pk)
        serializer = AdminGangSectionSerializer(data, many=True)
        return Response(data=serializer.data)


class AdminGangSectionViewSet(ModelViewSet):
    feature_key = WebFeatures.GANGS
    permission_classes = (
        FeatureEnabled,
        RoleProtectedObjectPermissions,
    )
    queryset = GangSection.objects.all()
    serializer_class = AdminGangSectionSerializer
