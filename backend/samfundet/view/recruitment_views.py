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

from root.custom_classes.permission_classes import CustomDjangoRolePermissions

from samfundet.serializers import RecruitmentSerializer, RecruitmentGangSerializer, RecruitmentForRecruiterSerializer
from samfundet.models.general import Gang
from samfundet.models.recruitment import Recruitment

# =============================== #
#        Public views             #
# =============================== #
"""
RecruitmentView is a view that is used to display all recruitments.
It is used to display all recruitments
"""


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


# =============================== #
#     Auth protected views        #
# =============================== #
@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentForRecruiterView(ModelViewSet):
    permission_classes = (CustomDjangoRolePermissions,)
    serializer_class = RecruitmentForRecruiterSerializer
    queryset = Recruitment.objects.all()

    def retrieve(self, request: Request, pk: int) -> Response:
        recruitment = get_object_or_404(self.queryset, pk=pk)
        recruitment.statistics.save()
        stats = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(stats)
        return Response(serializer.data)

    def get_queryset(self):
        """
        Returns queryset based on user's permissions:
        - If user has model-level permission, returns all objects
        - If user has only object-level permission, returns only permitted objects
        """
        user = self.request.user

        # Check if user has model-level permission
        has_model_permission = self.request.user.has_perm('samfundet.view_recruitment')

        if has_model_permission:
            # User can see all recruitment objects
            return Recruitment.objects.all()
        # Filter for objects where user has specific object-level permission
        # Assuming there's a way to check object-level permissions
        # You might need to adjust this based on your permission system
        permitted_ids = []
        all_recruitments = Recruitment.objects.all()

        for recruitment in all_recruitments:
            if user.has_perm('samfundet.view_recruitment', recruitment):
                permitted_ids.append(recruitment.id)

        return Recruitment.objects.filter(id__in=permitted_ids)
