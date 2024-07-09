from __future__ import annotations

import os
import csv
import hmac
import hashlib
from typing import Any

from guardian.shortcuts import get_objects_for_user

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.generics import ListAPIView, CreateAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated, DjangoModelPermissions, DjangoModelPermissionsOrAnonReadOnly

from django.http import QueryDict, HttpResponse
from django.utils import timezone
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from django.contrib.auth import login, logout
from django.utils.encoding import force_bytes
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.contrib.auth.models import Group
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

from root.constants import (
    XCSRFTOKEN,
    AUTH_BACKEND,
    GITHUB_SIGNATURE_HEADER,
    REQUESTED_IMPERSONATE_USER,
)

from .utils import event_query, generate_timeslots, get_occupied_timeslots_from_request
from .homepage import homepage
from .serializers import (
    TagSerializer,
    GangSerializer,
    MenuSerializer,
    UserSerializer,
    EventSerializer,
    GroupSerializer,
    ImageSerializer,
    LoginSerializer,
    MerchSerializer,
    TableSerializer,
    VenueSerializer,
    BookingSerializer,
    InfoboxSerializer,
    ProfileSerializer,
    BlogPostSerializer,
    GangTypeSerializer,
    KeyValueSerializer,
    MenuItemSerializer,
    RegisterSerializer,
    TextItemSerializer,
    InterviewSerializer,
    EventGroupSerializer,
    RecruitmentSerializer,
    ClosedPeriodSerializer,
    FoodCategorySerializer,
    OrganizationSerializer,
    SaksdokumentSerializer,
    UserFeedbackSerializer,
    InterviewRoomSerializer,
    FoodPreferenceSerializer,
    UserPreferenceSerializer,
    InformationPageSerializer,
    OccupiedTimeslotSerializer,
    ReservationCheckSerializer,
    UserForRecruitmentSerializer,
    RecruitmentPositionSerializer,
    RecruitmentStatisticsSerializer,
    RecruitmentApplicationForGangSerializer,
    RecruitmentUpdateUserPrioritySerializer,
    RecruitmentInterviewAvailabilitySerializer,
    RecruitmentApplicationForApplicantSerializer,
    RecruitmentApplicationForRecruiterSerializer,
    RecruitmentApplicationUpdateForGangSerializer,
)
from .models.event import Event, EventGroup
from .models.general import (
    Tag,
    Gang,
    Menu,
    User,
    Image,
    Merch,
    Table,
    Venue,
    Booking,
    Infobox,
    Profile,
    BlogPost,
    GangType,
    KeyValue,
    MenuItem,
    TextItem,
    Reservation,
    ClosedPeriod,
    FoodCategory,
    Organization,
    Saksdokument,
    FoodPreference,
    UserPreference,
    InformationPage,
    UserFeedbackModel,
)
from .models.recruitment import (
    Interview,
    Recruitment,
    InterviewRoom,
    OccupiedTimeslot,
    RecruitmentPosition,
    RecruitmentStatistics,
    RecruitmentApplication,
    RecruitmentInterviewAvailability,
)
from .models.model_choices import RecruitmentStatusChoices, RecruitmentPriorityChoices

# =============================== #
#          Home Page              #
# =============================== #


class HomePageView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        return Response(data=homepage.generate())


# =============================== #
#            Utility              #
# =============================== #


# Localized text storage
class TextItemView(ReadOnlyModelViewSet):
    """All CRUD operations can be performed in the admin panel instead."""

    permission_classes = [AllowAny]
    serializer_class = TextItemSerializer
    queryset = TextItem.objects.all()


class KeyValueView(ReadOnlyModelViewSet):
    """All CRUD operations can be performed in the admin panel instead."""

    permission_classes = [AllowAny]
    serializer_class = KeyValueSerializer
    queryset = KeyValue.objects.all()
    lookup_field = 'key'


# Images
class ImageView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = ImageSerializer
    queryset = Image.objects.all().order_by('-pk')


# Image tags
class TagView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = TagSerializer
    queryset = Tag.objects.all()


# =============================== #
#           Events                #
# =============================== #


class EventView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class EventPerDayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        # Fetch and serialize events.
        events = Event.objects.filter(start_dt__gt=timezone.now()).order_by('start_dt')
        serialized = EventSerializer(events, many=True).data

        # Organize in date dictionary.
        events_per_day: dict = {}
        for event, serial in zip(events, serialized, strict=False):
            date = event.start_dt.strftime('%Y-%m-%d')
            events_per_day.setdefault(date, [])
            events_per_day[date].append(serial)

        return Response(data=events_per_day)


class EventsUpcomingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        events = event_query(query=request.query_params)
        events = events.filter(start_dt__gt=timezone.now()).order_by('start_dt')
        return Response(data=EventSerializer(events, many=True).data)


class EventGroupView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = EventGroupSerializer
    queryset = EventGroup.objects.all()


# =============================== #
#            General              #
# =============================== #


class VenueView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()
    lookup_field = 'slug'


class ClosedPeriodView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = ClosedPeriodSerializer
    queryset = ClosedPeriod.objects.all()


class IsClosedView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ClosedPeriodSerializer

    def get_queryset(self) -> QuerySet:
        return ClosedPeriod.objects.filter(
            start_dt__lte=timezone.now(),
            end_dt__gte=timezone.now(),
        )


class BookingView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()


class SaksdokumentView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = SaksdokumentSerializer
    queryset = Saksdokument.objects.all()


class OrganizationView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()

    @action(detail=True, methods=['get'])
    def gangs(self, request: Request, **kwargs: Any) -> Response:
        organization = self.get_object()
        gangs = Gang.objects.filter(organization=organization)
        serializer = GangSerializer(gangs, many=True)
        return Response(serializer.data)


class GangView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = GangSerializer
    queryset = Gang.objects.all()


class GangTypeView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = GangTypeSerializer
    queryset = GangType.objects.all()


class InformationPageView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = InformationPageSerializer
    queryset = InformationPage.objects.all()


class InfoboxView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = InfoboxSerializer
    queryset = Infobox.objects.all()


class BlogPostView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()


# =============================== #
#            Sulten               #
# =============================== #


class MenuView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = MenuSerializer
    queryset = Menu.objects.all()


class MenuItemView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all()


class FoodCategoryView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = FoodCategorySerializer
    queryset = FoodCategory.objects.all()


class FoodPreferenceView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = FoodPreferenceSerializer
    queryset = FoodPreference.objects.all()


class TableView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = TableSerializer
    queryset = Table.objects.all()


class ReservationCheckAvailabilityView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ReservationCheckSerializer

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['reservation_date'] <= timezone.now().date():
                return Response(
                    {
                        'error_nb': 'Reservasjoner må dessverre opprettes minst én dag i forveien.',
                        'error_en': 'Unfortunately, reservations must be made at least one day in advance.',
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )
            venue = self.request.query_params.get('venue', Venue.objects.get(slug='lyche').id)
            available_tables = Reservation.fetch_available_times_for_date(
                venue=venue,
                seating=serializer.validated_data['guest_count'],
                date=serializer.validated_data['reservation_date'],
            )
            return Response(available_tables, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================== #
#             Merch               #
# =============================== #
class MerchView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = MerchSerializer
    queryset = Merch.objects.all()


# =============================== #
#          Auth/Login             #
# =============================== #


@method_decorator(csrf_protect, 'dispatch')
class LoginView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request=request, user=user, backend=AUTH_BACKEND)
        new_csrf_token = get_token(request=request)

        response = Response(
            status=status.HTTP_202_ACCEPTED,
            data=new_csrf_token,
            headers={XCSRFTOKEN: new_csrf_token},
        )

        # Reset impersonation after login.
        setattr(response, REQUESTED_IMPERSONATE_USER, None)

        return response


@method_decorator(csrf_protect, 'dispatch')
class LogoutView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        logout(request)
        response = Response(status=status.HTTP_200_OK)

        # Reset impersonation after logout.
        setattr(response, REQUESTED_IMPERSONATE_USER, None)

        return response


@method_decorator(csrf_protect, 'dispatch')
class RegisterView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RegisterSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request=request, user=user, backend=AUTH_BACKEND)
        new_csrf_token = get_token(request=request)
        res = Response(
            status=status.HTTP_202_ACCEPTED,
            data=new_csrf_token,
            headers={XCSRFTOKEN: new_csrf_token},
        )
        return res


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(data=UserSerializer(request.user, many=False).data)


class AllUsersView(ListAPIView):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = UserSerializer
    queryset = User.objects.all()


class ImpersonateView(APIView):
    permission_classes = [IsAuthenticated]  # TODO: Permission check.

    def post(self, request: Request) -> Response:
        response = Response(status=200)
        user_id = request.data.get('user_id', None)
        setattr(response, REQUESTED_IMPERSONATE_USER, user_id)
        return response


class AllGroupsView(ListAPIView):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = GroupSerializer
    queryset = Group.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
class CsrfView(APIView):
    permission_classes: list[type[BasePermission]] = [AllowAny]

    def get(self, request: Request) -> Response:
        csrf_token = get_token(request=request)
        return Response(data=csrf_token, headers={XCSRFTOKEN: csrf_token})


@method_decorator(csrf_protect, 'dispatch')
class UserPreferenceView(ModelViewSet):
    serializer_class = UserPreferenceSerializer
    queryset = UserPreference.objects.all()


class ProfileView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


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


@method_decorator(ensure_csrf_cookie, 'dispatch')
class AssignGroupView(APIView):
    """Assigns a user to a group."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        username = request.data.get('username')
        group_name = request.data.get('group_name')

        if not username or not group_name:
            return Response({'error': 'Username and group_name fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            group = Group.objects.get(name=group_name)
        except Group.DoesNotExist:
            return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.has_perm('auth.change_group', group):
            user.groups.add(group)
        else:
            return Response({'error': 'You do not have permission to add users to this group.'}, status=status.HTTP_403_FORBIDDEN)

        return Response({'message': f"User '{username}' added to group '{group_name}'."}, status=status.HTTP_200_OK)

    def delete(self, request: Request) -> Response:
        username = request.data.get('username')
        group_name = request.data.get('group_name')

        if not username or not group_name:
            return Response({'error': 'Username and group_name fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            group = Group.objects.get(name=group_name)
        except Group.DoesNotExist:
            return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.has_perm('auth.change_group', group):
            user.groups.remove(group)
        else:
            return Response({'error': 'You do not have permission to remove users from this group.'}, status=status.HTTP_403_FORBIDDEN)

        return Response({'message': f"User '{username}' removed from '{group_name}'."}, status=status.HTTP_200_OK)


# =============================== #
#            Recruitment          #
# =============================== #


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = RecruitmentSerializer
    queryset = Recruitment.objects.all()


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
    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionSerializer
    queryset = RecruitmentPosition.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
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
class RecruitmentPositionsPerGangView(ListAPIView):
    permission_classes = [AllowAny]
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


class ApplicantsWithoutInterviewsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        recruitment = self.request.query_params.get('recruitment', None)
        gang = self.request.query_params.get('gang', None)

        if not recruitment:
            return Response({'error': 'A recruitment parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

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
        data['recruitment_position'] = recruitment_position.pk
        data['recruitment'] = recruitment_position.recruitment.pk
        data['user'] = request.user.pk
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            existing_application = RecruitmentApplication.objects.filter(user=request.user, recruitment_position=pk).first()
            if existing_application:
                existing_application.application_text = serializer.validated_data['application_text']
                existing_application.save()
                serializer = self.get_serializer(existing_application)
                return Response(serializer.data, status=status.HTTP_200_OK)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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


class RecruitmentApplicationForGangView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentApplicationForGangSerializer
    queryset = RecruitmentApplication.objects.all()

    # TODO: User should only be able to edit the fields that are allowed

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
            applications = RecruitmentApplication.objects.filter(
                recruitment_position=application.recruitment_position,  # Only change from above
                recruitment=application.recruitment,
            )
            serializer = RecruitmentApplicationForGangSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
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
    serializer_class = RecruitmentPositionSerializer

    def get_queryset(self) -> Response:
        """Returns all active recruitment positions."""
        return RecruitmentPosition.objects.filter(recruitment__visible_from__lte=timezone.now(), recruitment__actual_application_deadline__gte=timezone.now())


class ActiveRecruitmentsView(ListAPIView):
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    serializer_class = RecruitmentSerializer

    def get_queryset(self) -> Response:
        """Returns all active recruitments"""
        # TODO Use is not completed instead of actual_application_deadline__gte
        return Recruitment.objects.filter(visible_from__lte=timezone.now(), actual_application_deadline__gte=timezone.now())


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

        filename = f"opptak_{gang.name_nb}_{recruitment.name_nb}_{recruitment.organization.name}_{timezone.now().strftime('%Y-%m-%d %H.%M')}.csv"
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
                'Søkers rangering',
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
                    'Intervjutid': application.interview.interview_time if application.interview else '',
                    'Intervjusted': application.interview.interview_location if application.interview else '',
                    'Prioritet': application.get_recruiter_priority_display(),
                    'Status': application.get_recruiter_status_display(),
                    'Søkers rangering': f'{application.applicant_priority}/{application.get_total_applications()}',
                    'Intervjuer satt': f'{application.get_total_interviews()}/{application.get_total_applications()}',
                }
            )

        return response


class InterviewRoomView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = InterviewRoomSerializer
    queryset = InterviewRoom.objects.all()

    def list(self, request: Request) -> Response:
        recruitment = request.query_params.get('recruitment')
        if not recruitment:
            return Response({'error': 'A recruitment parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        filtered_rooms = InterviewRoom.objects.filter(recruitment__id=recruitment)
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


class UserFeedbackView(CreateAPIView):
    permission_classes = [AllowAny]
    model = UserFeedbackModel
    serializer_class = UserFeedbackSerializer

    def create(self, request: Request) -> Response:
        data = request.data

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        UserFeedbackModel.objects.create(
            user=request.user if request.user.is_authenticated else None,
            text=data.get('text'),
            path=data.get('path'),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            screen_resolution=data.get('screen_resolution'),
            contact_email=data.get('contact_email'),
        )

        return Response(status=status.HTTP_201_CREATED, data={'message': 'Feedback submitted successfully!'})
