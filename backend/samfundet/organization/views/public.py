from __future__ import annotations

from rest_framework.viewsets import ModelViewSet

from root.constants import WebFeatures
from root.custom_classes.permission_classes import FeatureEnabled, RoleProtectedOrAnonReadOnlyObjectPermissions

from samfundet.organization.models import GangType
from samfundet.organization.serializers.public import PublicGangTypeSerializer


class PublicGangTypeView(ModelViewSet):
    feature_key = WebFeatures.GANGS
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
    serializer_class = PublicGangTypeSerializer
    queryset = GangType.objects.all()
