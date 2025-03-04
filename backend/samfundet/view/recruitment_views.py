from __future__ import annotations

from typing import Any

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly

from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

from samfundet.serializers import RecruitmentSerializer, RecruitmentGangSerializer, RecruitmentForRecruiterSerializer
from samfundet.models.general import Gang
from samfundet.models.recruitment import Recruitment


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = RecruitmentSerializer
    queryset = Recruitment.objects.all()

    @action(detail=True, methods=['get'])
    def gangs(self, request: Request, **kwargs: Any) -> Response:
        recruitment = self.get_object()
        gangs = Gang.objects.filter(organization__id=recruitment.organization_id)
        serializer = RecruitmentGangSerializer(gangs, recruitment=recruitment, many=True)
        return Response(serializer.data)


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentForRecruiterView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = RecruitmentForRecruiterSerializer
    queryset = Recruitment.objects.all()

    def retrieve(self, request: Request, pk: int) -> Response:
        recruitment = get_object_or_404(self.queryset, pk=pk)
        recruitment.statistics.save()
        stats = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(stats)
        return Response(serializer.data)
