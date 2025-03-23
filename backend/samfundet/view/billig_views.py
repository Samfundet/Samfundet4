from __future__ import annotations

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny

from samfundet.serializers import BilligEventSerializer, BilligPriceGroupSerializer, BilligTicketGroupSerializer
from samfundet.models.billig import BilligEvent, BilligPriceGroup, BilligTicketGroup


class BilligEventReadOnlyModelViewSet(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = BilligEventSerializer
    queryset = BilligEvent.objects.all()


class BilligPriceGroupReadOnlyModelViewSet(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = BilligPriceGroupSerializer
    queryset = BilligPriceGroup.objects.all()


class BilligTicketGroupReadOnlyModelViewSet(ReadOnlyModelViewSet):
    serializer_class = BilligTicketGroupSerializer
    queryset = BilligTicketGroup.objects.all()
