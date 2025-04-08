from __future__ import annotations

from typing import Any

from guardian.shortcuts import get_objects_for_user

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly

from django.utils import timezone
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

from root.utils.permissions import SAMFUNDET_VIEW_RECRUITMENT
from root.custom_classes.permission_classes import RoleProtectedObjectPermissions, filter_queryset_by_permissions

from samfundet.models.model_choices import OrganizationNames
from samfundet.serializers import RecruitmentSerializer, RecruitmentGangSerializer, RecruitmentForRecruiterSerializer, RecruitmentApplicationForGangSerializer
from samfundet.models.general import Gang, Organization
from samfundet.models.recruitment import Recruitment, RecruitmentApplication

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


@method_decorator(ensure_csrf_cookie, 'dispatch')
class ActiveRecruitmentsView(ReadOnlyModelViewSet):
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    serializer_class = RecruitmentSerializer
    queryset = Recruitment.objects.all()

    def get_queryset(self) -> QuerySet[Recruitment]:
        """Default queryset to show only active recruitments"""
        now = timezone.now()
        return Recruitment.objects.filter(
            visible_from__lte=now,  # __lte: less than or equal to (Django lookup type)
            actual_application_deadline__gte=now,  # __gte: greater than or equal to (Django lookup type)
        )

    @action(detail=False, methods=['get'], url_path='samfundet')
    def get_active_samf_recruitments(self, request: Request, **kwargs: Any) -> Response:
        try:
            samfundet_org = Organization.objects.get(name=OrganizationNames.SAMFUNDET)

            # Get active recruitments for Samfundet, using the overriden get_queryset method
            active_samfundet_recruitments = self.get_queryset().filter(organization=samfundet_org)

            if not active_samfundet_recruitments:
                return Response({'message': 'No active recruitment for Samfundet'}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(active_samfundet_recruitments, many=True)
            return Response(serializer.data)

        except Organization.DoesNotExist:
            return Response({'error': 'No organization named Samfundet exists'}, status=status.HTTP_404_NOT_FOUND)


# =============================== #
#     Auth protected views        #
# =============================== #
@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentForRecruiterView(ModelViewSet):
    permission_classes = (RoleProtectedObjectPermissions,)
    serializer_class = RecruitmentForRecruiterSerializer
    queryset = Recruitment.objects.all()

    def get_queryset(self) -> QuerySet[Recruitment]:
        return filter_queryset_by_permissions(Recruitment.objects.all(), self.request.user, SAMFUNDET_VIEW_RECRUITMENT)

    def retrieve(self, request: Request, pk: int) -> Response:
        # This will check permissions
        recruitment = self.get_object()
        recruitment.statistics.save()

        # Re-fetch the object after statistics update
        self.kwargs['pk'] = pk  # Make sure pk is in kwargs for get_object
        stats = self.get_object()

        serializer = self.serializer_class(stats)
        return Response(serializer.data)


class RecruitmentApplicationForGangView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentApplicationForGangSerializer
    queryset = RecruitmentApplication.objects.all()

    # TODO: User should only be able to edit the fields that are allowed

    @action(detail=True, methods=['put'], url_path='add-comment')
    def application_comment(self, request: Request, **kwargs: Any) -> Response:
        application_id = kwargs.get('pk')

        if 'comment' not in request.data:
            return Response({'error': 'comment field is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Use direct update to bypass model save() method and signals
        comment_text = request.data['comment']
        updated = RecruitmentApplication.objects.filter(id=application_id).update(comment=comment_text)

        if updated:
            # Return the updated comment in the response
            return Response({'comment': comment_text}, status=status.HTTP_200_OK)
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    def list(self, request: Request) -> Response:
        """Returns a list of all the recruitments for the specified gang."""
        gang_id = request.query_params.get('gang')
        recruitment_id = request.query_params.get('recruitment')

        if not gang_id:
            return Response({'error': 'A gang parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not recruitment_id:
            return Response({'error': 'A recruitment parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        gang = get_object_or_404(Gang, id=gang_id)
        recruitment = get_object_or_404(Recruitment, id=recruitment_id)

        applications = RecruitmentApplication.objects.filter(
            recruitment_position__gang=gang,
            recruitment=recruitment,  # only include applications related to the specified recruitment
        )

        # check permissions for each application
        applications = get_objects_for_user(user=request.user, perms=['view_recruitmentapplication'], klass=applications)

        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)
