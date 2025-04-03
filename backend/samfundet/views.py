from __future__ import annotations

import os
import csv
import hmac
import hashlib
import operator
from typing import Any
from datetime import datetime
from functools import reduce

from guardian.shortcuts import get_objects_for_user

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated, DjangoModelPermissions

from django.conf import settings
from django.http import QueryDict, HttpResponse
from django.utils import timezone
from django.core.mail import EmailMessage
from django.db.models import Q, Count, QuerySet
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes
from django.core.exceptions import ValidationError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

from root.constants import (
    GITHUB_SIGNATURE_HEADER,
)
from root.utils.permissions import SAMFUNDET_VIEW_INTERVIEW, SAMFUNDET_VIEW_INTERVIEWROOM

from .utils import generate_timeslots, get_occupied_timeslots_from_request
from .serializers import (
    InterviewSerializer,
    RecruitmentSerializer,
    InterviewRoomSerializer,
    OccupiedTimeslotSerializer,
    UserForRecruitmentSerializer,
    RecruitmentPositionSerializer,
    RecruitmentStatisticsSerializer,
    RecruitmentSeparatePositionSerializer,
    RecruitmentApplicationForGangSerializer,
    RecruitmentUpdateUserPrioritySerializer,
    RecruitmentPositionOrganizedApplications,
    RecruitmentPositionForApplicantSerializer,
    RecruitmentInterviewAvailabilitySerializer,
    RecruitmentApplicationForApplicantSerializer,
    RecruitmentApplicationForRecruiterSerializer,
    RecruitmentApplicationUpdateForGangSerializer,
    RecruitmentShowUnprocessedApplicationsSerializer,
    RecruitmentPositionSharedInterviewGroupSerializer,
)
from .models.general import (
    Gang,
    User,
)
from .models.recruitment import (
    Interview,
    Recruitment,
    InterviewRoom,
    OccupiedTimeslot,
    RecruitmentGangStat,
    RecruitmentPosition,
    RecruitmentStatistics,
    RecruitmentApplication,
    RecruitmentSeparatePosition,
    RecruitmentInterviewAvailability,
    RecruitmentPositionSharedInterviewGroup,
)
from .models.model_choices import RecruitmentStatusChoices, RecruitmentPriorityChoices


class WebhookView(APIView):
    """
    https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
    https://simpleisbetterthancomplex.com/tutorial/2016/10/31/how-to-handle-github-webhooks-using-django.html
    """

    permission_classes = [AllowAny]

    # TODO: Whitelist ip? https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks#allow-githubs-ip-addresses
    # TODO: Ensure unique delivery? # https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks#use-the-x-github-delivery-header

    def post(self, request: Request) -> Response:
        WebhookView.verify_signature(
            payload_body=request.stream.body,
            secret_token=os.environ['WEBHOOK_SECRET'],
            signature_header=request.META[GITHUB_SIGNATURE_HEADER],
        )
        return Response()  # Success.

    def verify_signature(*, payload_body: Any, secret_token: str, signature_header: str) -> None:
        """Verify that the payload was sent from GitHub by validating SHA256.

        Raise and return 403 if not authorized.

        Args:
            payload_body: original request body to verify (request.body())
            secret_token: GitHub app webhook token (WEBHOOK_SECRET)
            signature_header: header received from GitHub (x-hub-signature-256)
        """
        if not signature_header:
            raise PermissionDenied(detail='x-hub-signature-256 header is missing!')
        hash_object = hmac.new(key=force_bytes(secret_token), msg=force_bytes(payload_body), digestmod=hashlib.sha256)
        expected_signature = 'sha256=' + hash_object.hexdigest()
        if not hmac.compare_digest(force_bytes(expected_signature), force_bytes(signature_header)):
            raise PermissionDenied(detail="Request signatures didn't match!")


# =============================== #
#            Recruitment          #
# =============================== #


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentStatisticsView(ModelViewSet):
    permission_classes = (DjangoModelPermissions,)  # Allow read only to permissions on perms
    serializer_class = RecruitmentStatisticsSerializer
    queryset = RecruitmentStatistics.objects.all()

    def retrieve(self, request: Request, pk: int) -> Response:
        stats = get_object_or_404(self.queryset, pk=pk)
        stats.save()
        stats = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(stats)
        return Response(serializer.data)


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentPositionView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentPositionSerializer
    queryset = RecruitmentPosition.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentPositionForApplicantView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionForApplicantSerializer
    queryset = RecruitmentPosition.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentSeparatePositionView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentSeparatePositionSerializer
    queryset = RecruitmentSeparatePosition.objects.all()


class RecruitmentApplicationView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = RecruitmentApplicationForGangSerializer
    queryset = RecruitmentApplication.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentPositionsPerRecruitmentView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionSerializer

    def get_queryset(self) -> Response | None:
        """
        Optionally restricts the returned positions to a given recruitment,
        by filtering against a `recruitment` query parameter in the URL.
        """
        recruitment = self.request.query_params.get('recruitment', None)
        if recruitment is not None:
            return RecruitmentPosition.objects.filter(recruitment=recruitment)
        return None


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentPositionsPerGangForApplicantView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionForApplicantSerializer

    def get_queryset(self) -> Response | None:
        """
        Optionally restricts the returned positions to a given recruitment,
        by filtering against a `recruitment` query parameter in the URL.
        """
        recruitment = self.request.query_params.get('recruitment', None)
        gang = self.request.query_params.get('gang', None)
        if recruitment is not None and gang is not None:
            return RecruitmentPosition.objects.filter(gang=gang, recruitment=recruitment)
        return None


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentPositionsPerGangForGangView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentPositionSerializer

    def get_queryset(self) -> Response | None:
        """
        Optionally restricts the returned positions to a given recruitment,
        by filtering against a `recruitment` query parameter in the URL.
        """
        recruitment = self.request.query_params.get('recruitment', None)
        gang = self.request.query_params.get('gang', None)
        if recruitment is not None and gang is not None:
            return RecruitmentPosition.objects.filter(gang=gang, recruitment=recruitment)
        return None


class SendRejectionMailView(APIView):
    def post(self, request: Request) -> Response:
        try:
            subject = request.data.get('subject')
            text = request.data.get('text')
            recruitment = request.data.get('recruitment')
            if recruitment is None:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Only users who have never been contacted with an offer should get a rejection mail
            # Retrieve all users who has a non-withdrawn rejected application in current recruitment
            rejected_users = User.objects.filter(
                applications__recruitment=recruitment,
                applications__recruiter_status=RecruitmentStatusChoices.REJECTION,
                applications__withdrawn=False,
            )

            # Retrieve all users who have been contacted with an offer
            contacted_users = User.objects.filter(
                applications__recruitment=recruitment,
                applications__recruiter_status__in=[
                    RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
                    RecruitmentStatusChoices.CALLED_AND_REJECTED,
                ],
            )

            # Remove users who have been contacted with an offer from the rejected users list
            final_rejected_users = rejected_users.exclude(id__in=contacted_users.values('id'))

            rejected_user_emails = list(final_rejected_users.values_list('email', flat=True))

            email = EmailMessage(
                subject=subject,
                body=text,
                from_email=settings.EMAIL_HOST_USER,
                to=[],  # Empty 'To' field since we're using BCC
                bcc=rejected_user_emails,
            )

            email.send(fail_silently=False)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentUnprocessedApplicationsPerRecruitment(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentShowUnprocessedApplicationsSerializer

    def get_queryset(self) -> Response | None:
        """
        Optionally restricts the returned positions to a given recruitment,
        by filtering against a `recruitment` query parameter in the URL.
        """
        recruitment = self.request.query_params.get('recruitment', None)
        if recruitment is not None:
            return RecruitmentApplication.objects.filter(
                recruitment=recruitment,
                recruiter_status=RecruitmentStatusChoices.NOT_SET,
            )
        return None


class ApplicantsWithoutThreeInterviewsCriteriaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk: int) -> Response:
        recruitment = get_object_or_404(Recruitment, pk=pk)

        # Filter based on applications > 3 and with less than 3 interview set
        data = User.objects.annotate(
            application_count=Count('applications', filter=Q(applications__recruitment=recruitment)),
            interview_count=Count('applications', filter=Q(applications__recruitment=recruitment, applications__interview__isnull=False)),
        ).filter(interview_count__lt=3, application_count__gte=3)

        return Response(data=UserForRecruitmentSerializer(data, recruitment=recruitment, many=True).data, status=status.HTTP_200_OK)


class RecruitmentRecruiterDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk: int) -> Response:
        recruitment = get_object_or_404(Recruitment, pk=pk)
        applications = RecruitmentApplication.objects.filter(recruitment=recruitment, interview__interviewers__in=[request.user])
        return Response(
            data={
                'recruitment': RecruitmentSerializer(recruitment).data,
                'applications': RecruitmentApplicationForGangSerializer(applications, many=True).data,
            },
            status=status.HTTP_200_OK,
        )


class ApplicantsWithoutInterviewsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk: int) -> Response:
        recruitment = pk
        gang = self.request.query_params.get('gang', None)

        # Filter based on applications
        applications = RecruitmentApplication.objects.filter(recruitment=recruitment, interview=None)
        if gang:
            applications = applications.filter(recruitment_position__gang=gang)
        applications_without_interviews_user_ids = applications.values_list('user_id', flat=True)
        data = User.objects.filter(id__in=applications_without_interviews_user_ids)

        return Response(data=UserForRecruitmentSerializer(data, gang=gang, recruitment=recruitment, many=True).data, status=status.HTTP_200_OK)


class RecruitmentApplicationForApplicantView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentApplicationForApplicantSerializer
    queryset = RecruitmentApplication.objects.all()

    def update(self, request: Request, pk: int) -> Response:
        data = request.data.dict() if isinstance(request.data, QueryDict) else request.data
        recruitment_position = get_object_or_404(RecruitmentPosition, pk=pk)
        existing_application = RecruitmentApplication.objects.filter(user=request.user, recruitment_position=pk).first()
        # If update
        if existing_application:
            try:
                existing_application.withdrawn = False
                existing_application.application_text = data['application_text']
                existing_application.save()
                serializer = self.serializer_class(existing_application)
                return Response(serializer.data, status.HTTP_200_OK)
            except ValidationError as e:
                return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)

        # If create
        data['recruitment_position'] = recruitment_position.pk
        data['recruitment'] = recruitment_position.recruitment.pk
        data['user'] = request.user.pk
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request: Request, pk: int) -> Response:
        application = get_object_or_404(RecruitmentApplication, user=request.user, recruitment_position=pk)

        user_id = request.query_params.get('user_id')
        if user_id:
            # TODO: Add permissions
            application = RecruitmentApplication.objects.filter(recruitment_position=pk, user_id=user_id).first()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    def list(self, request: Request) -> Response:
        """Returns a list of all the applications for a user for a specified recruitment"""
        recruitment_id = request.query_params.get('recruitment')
        user_id = request.query_params.get('user_id')

        if not recruitment_id:
            return Response({'error': 'A recruitment parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        recruitment = get_object_or_404(Recruitment, id=recruitment_id)

        applications = RecruitmentApplication.objects.filter(
            recruitment=recruitment,
            user=request.user,
        )

        if user_id:
            # TODO: Add permissions
            applications = RecruitmentApplication.objects.filter(recruitment=recruitment, user_id=user_id)
        else:
            applications = RecruitmentApplication.objects.filter(recruitment=recruitment, user=request.user)

        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)


class RecruitmentApplicationInterviewNotesView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewSerializer

    def put(self, request: Request, interview_id: str) -> Response:
        interview = get_object_or_404(Interview, pk=interview_id)
        update_serializer = self.serializer_class(interview, data=request.data, partial=True)
        if update_serializer.is_valid() and 'notes' in update_serializer.validated_data:
            interview.notes = update_serializer.validated_data['notes']
            interview.save()
            return Response(status=status.HTTP_200_OK)
        return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecruitmentApplicationWithdrawApplicantView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, pk: int) -> Response:
        # Checks if user has applied for position
        application = get_object_or_404(RecruitmentApplication, recruitment_position=pk, user=request.user)
        # Withdraw if applied
        application.withdrawn = True
        application.save()
        serializer = RecruitmentApplicationForApplicantSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecruitmentApplicationWithdrawRecruiterView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, pk: str) -> Response:
        application = get_object_or_404(RecruitmentApplication, pk=pk)
        # Withdraw if user has application for position
        application.withdrawn = True
        application.save()
        serializer = RecruitmentApplicationForApplicantSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecruitmentApplicationApplicantPriorityView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentUpdateUserPrioritySerializer

    def put(
        self,
        request: Request,
        pk: int,
    ) -> Response:
        direction = RecruitmentUpdateUserPrioritySerializer(data=request.data)
        if direction.is_valid():
            direction = direction.validated_data['direction']
        else:
            return Response(direction.errors, status=status.HTTP_400_BAD_REQUEST)

        # Dont think we need any extra perms in this view, admin should not be able to change priority
        application = get_object_or_404(
            RecruitmentApplication,
            id=pk,
            user=request.user,
        )
        application.update_priority(direction)
        serializer = RecruitmentApplicationForApplicantSerializer(
            RecruitmentApplication.objects.filter(
                recruitment=application.recruitment,
                user=request.user,
            ).order_by('applicant_priority'),
            many=True,
        )
        return Response(serializer.data)


class RecruitmentApplicationSetInterviewView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewSerializer

    def put(self, request: Request, pk: str) -> Response:
        application = get_object_or_404(RecruitmentApplication, id=pk)
        data = request.data.dict() if isinstance(request.data, QueryDict) else request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            existing_interview = application.interview
            if existing_interview:
                existing_interview.interview_location = serializer.validated_data['interview_location']
                existing_interview.interview_time = serializer.validated_data['interview_time']
                existing_interview.save()
                application_serializer = RecruitmentApplicationForGangSerializer(RecruitmentApplication.objects.get(id=pk))
                return Response(application_serializer.data, status=status.HTTP_200_OK)

            new_interview = serializer.save()
            application.interview = new_interview
            application.save()
            application_serializer = RecruitmentApplicationForGangSerializer(RecruitmentApplication.objects.get(id=pk))
            return Response(application_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecruitmentApplicationStateChoicesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(
            {'recruiter_priority': RecruitmentPriorityChoices.choices, 'recruiter_status': RecruitmentStatusChoices.choices}, status=status.HTTP_200_OK
        )


class RecruitmentApplicationForGangUpdateStateView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentApplicationUpdateForGangSerializer

    def put(self, request: Request, pk: int) -> Response:
        application = get_object_or_404(RecruitmentApplication, pk=pk)

        # TODO add check if user has permission to update for GANG
        update_serializer = self.serializer_class(data=request.data)
        if update_serializer.is_valid():
            # Should return update list of applications on correct
            if 'recruiter_priority' in update_serializer.data:
                application.recruiter_priority = update_serializer.data['recruiter_priority']
            if 'recruiter_status' in update_serializer.data:
                application.recruiter_status = update_serializer.data['recruiter_status']
            application.save()
            applications = RecruitmentApplication.objects.filter(
                recruitment_position__gang=application.recruitment_position.gang,
                recruitment=application.recruitment,
            )
            application.update_applicant_state()
            serializer = RecruitmentApplicationForGangSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecruitmentPositionOrganizedApplicationsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentPositionOrganizedApplications

    def get(self, request: Request, pk: int) -> Response:
        position = get_object_or_404(RecruitmentPosition, pk=pk)
        serializer = self.serializer_class(position)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecruitmentApplicationForPositionUpdateStateView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentApplicationUpdateForGangSerializer

    def put(self, request: Request, pk: int) -> Response:
        application = get_object_or_404(RecruitmentApplication, pk=pk)
        # TODO add check if user has permission to update for GANG
        update_serializer = self.serializer_class(data=request.data)
        if update_serializer.is_valid():
            # Should return update list of applications on correct
            if 'recruiter_priority' in update_serializer.data:
                application.recruiter_priority = update_serializer.data['recruiter_priority']
            if 'recruiter_status' in update_serializer.data:
                application.recruiter_status = update_serializer.data['recruiter_status']
            application.save()
            application.update_applicant_state()
            position = get_object_or_404(RecruitmentPosition, pk=application.recruitment_position.id)
            organized_serializer = RecruitmentPositionOrganizedApplications(position)
            return Response(organized_serializer.data, status=status.HTTP_200_OK)
        return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecruitmentApplicationForRecruitmentPositionView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentApplicationForGangSerializer
    queryset = RecruitmentApplication.objects.all()

    # TODO: User should only be able to edit the fields that are allowed

    def retrieve(self, request: Request, pk: int) -> Response:
        """Returns a list of all the recruitments for the specified gang."""

        position = get_object_or_404(RecruitmentPosition, id=pk)

        applications = RecruitmentApplication.objects.filter(
            recruitment_position=position,
        )

        # check permissions for each application
        applications = get_objects_for_user(user=request.user, perms=['view_recruitmentapplication'], klass=applications)

        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)


class ActiveRecruitmentPositionsView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionForApplicantSerializer

    def get_queryset(self) -> Response:
        """Returns all active recruitment positions."""
        return RecruitmentPosition.objects.filter(recruitment__visible_from__lte=timezone.now(), recruitment__actual_application_deadline__gte=timezone.now())


class RecruitmentInterviewGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(
        self,
        request: Request,
        recruitment_id: int,
    ) -> HttpResponse:
        recruitment = get_object_or_404(Recruitment, id=recruitment_id)
        interview_groups = RecruitmentPositionSharedInterviewGroup.objects.filter(recruitment=recruitment)

        return Response(data=RecruitmentPositionSharedInterviewGroupSerializer(interview_groups, many=True).data, status=status.HTTP_200_OK)


class DownloadAllRecruitmentApplicationCSV(APIView):
    permission_classes = [IsAuthenticated]

    def get(
        self,
        request: Request,
        recruitment_id: int,
    ) -> HttpResponse:
        recruitment = get_object_or_404(Recruitment, id=recruitment_id)
        applications = RecruitmentApplication.objects.filter(recruitment=recruitment)

        filename = f'opptak_{recruitment.name_nb}_{recruitment.organization.name}_{timezone.now().strftime("%Y-%m-%d %H.%M")}.csv'
        response = HttpResponse(
            content_type='text/csv',
            headers={'Content-Disposition': f'Attachment; filename="{filename}"'},
        )
        writer = csv.DictWriter(
            response,
            fieldnames=[
                'Navn',
                'Telefon',
                'Epost',
                'Campus',
                'Stilling',
                'Gjeng',
                'Seksjon',
                'Intervjutid',
                'Intervjusted',
                'Prioritet',
                'Status',
                'Sokers rangering',
                'Intervjuer satt',
            ],
        )
        writer.writeheader()
        for application in applications:
            writer.writerow(
                {
                    'Navn': application.user.get_full_name(),
                    'Telefon': application.user.phone_number,
                    'Epost': application.user.email,
                    'Campus': application.user.campus.name_en if application.user.campus else '',
                    'Stilling': application.recruitment_position.name_nb,
                    'Gjeng': application.recruitment_position.gang.name_nb,
                    'Seksjon': application.recruitment_position.get_section_name('nb'),
                    'Intervjutid': application.interview.interview_time if application.interview else '',
                    'Intervjusted': application.interview.interview_location if application.interview else '',
                    'Prioritet': application.get_recruiter_priority_display(),
                    'Status': application.get_recruiter_status_display(),
                    'Sokers rangering': f'{application.applicant_priority}/{application.get_total_applications()}',
                    'Intervjuer satt': f'{application.get_total_interviews()}/{application.get_total_applications()}',
                }
            )

        return response


class DownloadRecruitmentApplicationGangCSV(APIView):
    permission_classes = [IsAuthenticated]

    def get(
        self,
        request: Request,
        recruitment_id: int,
        gang_id: int,
    ) -> HttpResponse:
        recruitment = get_object_or_404(Recruitment, id=recruitment_id)
        gang = get_object_or_404(Gang, id=gang_id)
        applications = RecruitmentApplication.objects.filter(recruitment_position__gang=gang, recruitment=recruitment)

        filename = f'opptak_{gang.name_nb}_{recruitment.name_nb}_{recruitment.organization.name}_{timezone.now().strftime("%Y-%m-%d %H.%M")}.csv'
        response = HttpResponse(
            content_type='text/csv',
            headers={'Content-Disposition': f'Attachment; filename="{filename}"'},
        )
        writer = csv.DictWriter(
            response,
            fieldnames=[
                'Navn',
                'Telefon',
                'Epost',
                'Campus',
                'Stilling',
                'Intervjutid',
                'Intervjusted',
                'Prioritet',
                'Status',
                'Sokers rangering (Hele Opptak)',
                'Intervjuer satt (For Gjeng)',
            ],
        )
        writer.writeheader()
        for application in applications:
            writer.writerow(
                {
                    'Navn': application.user.get_full_name(),
                    'Telefon': application.user.phone_number,
                    'Epost': application.user.email,
                    'Campus': application.user.campus.name_en if application.user.campus else '',
                    'Stilling': application.recruitment_position.name_nb,
                    'Intervjutid': application.interview.interview_time if application.interview else '',
                    'Intervjusted': application.interview.interview_location if application.interview else '',
                    'Prioritet': application.get_recruiter_priority_display(),
                    'Status': application.get_recruiter_status_display(),
                    'Sokers rangering (Hele Opptak)': f'{application.applicant_priority}/{application.get_total_applications()}',
                    'Intervjuer satt (For Gjeng)': f'{application.get_total_interviews_for_gang()}/{application.get_total_applications_for_gang()}',
                }
            )

        return response


class InterviewRoomView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = InterviewRoomSerializer
    queryset = InterviewRoom.objects.all()

    # noinspection PyMethodOverriding
    def retrieve(self, request: Request, pk: int) -> Response:
        room = get_object_or_404(InterviewRoom, pk=pk)
        if not request.user.has_perm(SAMFUNDET_VIEW_INTERVIEWROOM, room):
            raise PermissionDenied
        return super().retrieve(request=request, pk=pk)

    # noinspection PyMethodOverriding
    def list(self, request: Request) -> Response:
        recruitment = request.query_params.get('recruitment')
        if not recruitment:
            return Response({'error': 'A recruitment parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        filtered_rooms = [
            room for room in InterviewRoom.objects.filter(recruitment__id=recruitment) if request.user.has_perm(SAMFUNDET_VIEW_INTERVIEWROOM, room)
        ]
        serialized_rooms = self.get_serializer(filtered_rooms, many=True)
        return Response(serialized_rooms.data)


class RecruitmentApplicationForRecruitersView(APIView):
    permission_classes = [IsAuthenticated]  # TODO correct perms

    def get(self, request: Request, application_id: str) -> Response:
        application = get_object_or_404(RecruitmentApplication, id=application_id)
        other_applications = RecruitmentApplication.objects.filter(user=application.user, recruitment=application.recruitment).order_by('applicant_priority')
        return Response(
            data={
                'application': RecruitmentApplicationForRecruiterSerializer(instance=application).data,
                'user': UserForRecruitmentSerializer(instance=application.user).data,
                'other_applications': RecruitmentApplicationForRecruiterSerializer(other_applications, many=True).data,
            }
        )


class InterviewView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = InterviewSerializer
    queryset = Interview.objects.all()

    # noinspection PyMethodOverriding
    def retrieve(self, request: Request, pk: int) -> Response:
        interview = get_object_or_404(Interview, pk=pk)
        if not request.user.has_perm(SAMFUNDET_VIEW_INTERVIEW, interview):
            raise PermissionDenied
        return super().retrieve(request=request, pk=pk)

    # noinspection PyMethodOverriding
    def list(self, request: Request) -> Response:
        interviews = [interview for interview in self.get_queryset() if request.user.has_perm(SAMFUNDET_VIEW_INTERVIEW, interview)]
        serializer = self.get_serializer(interviews, many=True)
        return Response(serializer.data)


class RecruitmentInterviewAvailabilityView(ListCreateAPIView):
    model = RecruitmentInterviewAvailability
    serializer_class = RecruitmentInterviewAvailabilitySerializer
    queryset = RecruitmentInterviewAvailability.objects.all()


class RecruitmentAvailabilityView(APIView):
    model = RecruitmentInterviewAvailability
    serializer_class = RecruitmentInterviewAvailabilitySerializer

    def get(self, request: Request, **kwargs: int) -> Response:
        recruitment = kwargs.get('id')
        availability = get_object_or_404(RecruitmentInterviewAvailability, recruitment__id=recruitment)

        start_time = availability.start_time
        end_time = availability.end_time
        interval = availability.timeslot_interval

        timeslots = generate_timeslots(start_time, end_time, interval)

        return Response(
            {
                'start_date': availability.start_date,
                'end_date': availability.end_date,
                'timeslots': timeslots,
                'interval': interval,
            }
        )


class OccupiedTimeslotView(ListCreateAPIView):
    model = OccupiedTimeslot
    serializer_class = OccupiedTimeslotSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, **kwargs: int) -> Response:
        recruitment_id = self.request.query_params.get('recruitment')
        recruitment = get_object_or_404(Recruitment, id=recruitment_id)
        occupied_timeslots = OccupiedTimeslot.objects.filter(user=request.user, recruitment__id=recruitment.id)

        dates: dict[str, list[str]] = {}
        for occupied in occupied_timeslots:
            date_string = occupied.start_dt.strftime('%Y.%m.%d')
            time_string = occupied.start_dt.strftime('%H:%M')

            if date_string in dates:
                dates[date_string].append(time_string)
            else:
                dates[date_string] = [time_string]

        return Response(
            {
                'recruitment': recruitment.id,
                'dates': dates,
            }
        )

    def create(self, request: Request) -> Response:
        if 'recruitment' not in request.data or not request.data['recruitment']:
            return Response({'error': 'recruitment is required'}, status=status.HTTP_400_BAD_REQUEST)

        if 'dates' not in request.data or not request.data['recruitment']:
            return Response({'error': 'dates is required'}, status=status.HTTP_400_BAD_REQUEST)

        recruitment = get_object_or_404(Recruitment, id=request.data['recruitment'])
        availability = RecruitmentInterviewAvailability.objects.filter(recruitment__id=recruitment.id).first()

        occupied_timeslots = get_occupied_timeslots_from_request(request.data['dates'], request.user, availability, recruitment)

        # If we've reached this point, all provided timeslots are valid

        # First delete all user's previous occupied timeslots
        OccupiedTimeslot.objects.filter(user=request.user, recruitment__id=recruitment.id).delete()
        OccupiedTimeslot.objects.bulk_create(occupied_timeslots)

        return Response({'message': 'Successfully updated occupied timeslots'})


class OccupiedTimeslotForUserView(APIView):
    model = OccupiedTimeslot
    serializer_class = OccupiedTimeslotSerializer
    permission_classes = [IsAuthenticated]

    # TODO: set correct permission. Must have permissions to see applications for the user
    def get(self, request: Request, **kwargs: int) -> Response:
        recruitment_id = self.request.query_params.get('recruitment')
        recruitment = get_object_or_404(Recruitment, id=recruitment_id)
        user_id = self.request.query_params.get('user')
        user = get_object_or_404(User, id=user_id)
        occupied_timeslots = OccupiedTimeslot.objects.filter(user=user.id, recruitment__id=recruitment.id)
        dates: dict[str, list[str]] = {}
        for occupied in occupied_timeslots:
            date_string = occupied.start_dt.strftime('%Y.%m.%d')
            time_string = occupied.start_dt.strftime('%H:%M')

            if date_string in dates:
                dates[date_string].append(time_string)
            else:
                dates[date_string] = [time_string]

        return Response(
            {
                'recruitment': recruitment.id,
                'dates': dates,
            }
        )


class GangApplicationCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, recruitment_id: int, gang_id: int) -> Response:
        # Get total applications from RecruitmentGangStat
        gang_stat = get_object_or_404(RecruitmentGangStat, gang_id=gang_id, recruitment_stats__recruitment_id=recruitment_id)

        return Response(
            {
                'total_applications': gang_stat.application_count,
                'total_applicants': gang_stat.applicant_count,
                'average_priority': gang_stat.average_priority,
                'total_accepted': gang_stat.total_accepted,
                'total_rejected': gang_stat.total_rejected,
            }
        )


class InterviewerAvailabilityForDate(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OccupiedTimeslotSerializer

    def get(self, request: Request, recruitment_id: int) -> Response:
        try:
            date_str = request.query_params.get('date')
            if not date_str:
                return Response({'error': 'Date parameter is required'}, status=400)

            # Parse date in both formats (YYYY-MM-DD or YYYY.MM.DD)
            try:
                date_format = '%Y-%m-%d' if '-' in date_str else '%Y.%m.%d'
                date = datetime.strptime(date_str, date_format).date()
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD or YYYY.MM.DD'}, status=400)

            interviewer_str = request.query_params.get('interviewers', '')
            interviewers = [int(id_) for id_ in interviewer_str.split(',')] if interviewer_str else []

            query = OccupiedTimeslot.objects.filter(recruitment__id=recruitment_id)
            if interviewers:
                query = query.filter(user__in=interviewers)

            # Filter by date manually
            result = [
                {
                    'id': slot.id,
                    'user': slot.user.id,
                    'recruitment': slot.recruitment.id,
                    'time': slot.start_dt.strftime('%H:%M'),
                    'start_dt': slot.start_dt.isoformat(),
                    'end_dt': slot.end_dt.isoformat(),
                }
                for slot in query
                if slot.start_dt.date() == date
            ]

            return Response(result)

        except Exception as e:
            return Response({'error': f'Error processing request: {str(e)}'}, status=500)


class PositionByTagsView(ListAPIView):
    """
    Fetches recruitment positions by common tags for a specific recruitment.
    Expects tags as query parameter in format: ?tags=tag1,tag2,tag3
    Optionally accepts position_id parameter to exclude current position
    This view expects a string which contains tags separated by comma from the client.
    """

    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionForApplicantSerializer

    def get_queryset(self) -> QuerySet:
        recruitment_id = self.kwargs.get('id')
        tags_param = self.request.query_params.get('tags')
        current_position_id = self.request.query_params.get('position_id')

        if not tags_param:
            return RecruitmentPosition.objects.none()

        # Split and clean the tags
        tags = [tag.strip() for tag in tags_param.split(',') if tag.strip()]

        if not tags:
            return RecruitmentPosition.objects.none()

        # Create Q objects for each tag to search in the tags field
        tag_queries = [Q(tags__icontains=tag) for tag in tags]

        # Combine queries with OR operator
        combined_query = reduce(operator.or_, tag_queries)

        # Base queryset with recruitment and tag filtering
        queryset = RecruitmentPosition.objects.filter(combined_query, recruitment_id=recruitment_id).select_related('gang')

        # Exclude current position if position_id is provided
        if current_position_id:
            queryset = queryset.exclude(id=current_position_id)

        return queryset

    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        if not request.query_params.get('tags'):
            return Response({'message': 'No tags provided in query parameters'}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response({'count': len(serializer.data), 'positions': serializer.data})
