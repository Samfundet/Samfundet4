from functools import reduce
from typing import Any
from django.core.exceptions import ValidationError
from django.db.models import Q, QuerySet
from django.http import QueryDict
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from samfundet.models.recruitment import (
    Interview,
    Recruitment,
    RecruitmentApplication,
    RecruitmentPosition,
)
from samfundet.serializers import (
    InterviewSerializer,
    RecruitmentApplicationForApplicantSerializer,
    RecruitmentPositionForApplicantSerializer,
    RecruitmentUpdateUserPrioritySerializer,
)


from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet


@method_decorator(ensure_csrf_cookie, "dispatch")
class RecruitmentPositionForApplicantView(ModelViewSet):
    """
    View that allows applicants to see and interact with recruitment positions.
    Provides CRUD operations for recruitment positions from the applicant perspective.
    """

    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionForApplicantSerializer
    queryset = RecruitmentPosition.objects.all()


@method_decorator(ensure_csrf_cookie, "dispatch")
class RecruitmentPositionsPerGangForApplicantView(ListAPIView):
    """
    View that allows applicants to see all recruitment positions for a specific gang.

    Expected query parameters:
    - recruitment: ID of the recruitment
    - gang: ID of the gang
    """

    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionForApplicantSerializer

    def get_queryset(self) -> Response | None:
        """
        Optionally restricts the returned positions to a given recruitment,
        by filtering against a `recruitment` query parameter in the URL.
        """
        recruitment = self.request.query_params.get("recruitment", None)
        gang = self.request.query_params.get("gang", None)
        if recruitment is not None and gang is not None:
            return RecruitmentPosition.objects.filter(
                gang=gang, recruitment=recruitment
            )
        return None


class RecruitmentApplicationForApplicantView(ModelViewSet):
    """
    View that handles applicants' recruitment applications.
    Allows creating, updating, retrieving, and listing applications for positions.

    For list endpoint, requires 'recruitment' query parameter.
    Optional 'user_id' parameter for listing another user's applications (requires permissions).
    """

    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentApplicationForApplicantSerializer
    queryset = RecruitmentApplication.objects.all()

    def update(self, request: Request, pk: int) -> Response:
        data = (
            request.data.dict() if isinstance(request.data, QueryDict) else request.data
        )
        recruitment_position = get_object_or_404(RecruitmentPosition, pk=pk)
        existing_application = RecruitmentApplication.objects.filter(
            user=request.user, recruitment_position=pk
        ).first()
        # If update
        if existing_application:
            try:
                existing_application.withdrawn = False
                existing_application.application_text = data["application_text"]
                existing_application.save()
                serializer = self.serializer_class(existing_application)
                return Response(serializer.data, status.HTTP_200_OK)
            except ValidationError as e:
                return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)

        # If create
        data["recruitment_position"] = recruitment_position.pk
        data["recruitment"] = recruitment_position.recruitment.pk
        data["user"] = request.user.pk
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request: Request, pk: int) -> Response:
        application = get_object_or_404(
            RecruitmentApplication, user=request.user, recruitment_position=pk
        )

        user_id = request.query_params.get("user_id")
        if user_id:
            # TODO: Add permissions
            application = RecruitmentApplication.objects.filter(
                recruitment_position=pk, user_id=user_id
            ).first()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    def list(self, request: Request) -> Response:
        """Returns a list of all the applications for a user for a specified recruitment"""
        recruitment_id = request.query_params.get("recruitment")
        user_id = request.query_params.get("user_id")

        if not recruitment_id:
            return Response(
                {"error": "A recruitment parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        recruitment = get_object_or_404(Recruitment, id=recruitment_id)

        applications = RecruitmentApplication.objects.filter(
            recruitment=recruitment,
            user=request.user,
        )

        if user_id:
            # TODO: Add permissions
            applications = RecruitmentApplication.objects.filter(
                recruitment=recruitment, user_id=user_id
            )
        else:
            applications = RecruitmentApplication.objects.filter(
                recruitment=recruitment, user=request.user
            )

        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)


class RecruitmentApplicationInterviewNotesView(APIView):
    """
    View that allows updating interview notes for an application.

    PUT endpoint requires interview_id in the URL.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = InterviewSerializer

    def put(self, request: Request, interview_id: str) -> Response:
        interview = get_object_or_404(Interview, pk=interview_id)
        update_serializer = self.serializer_class(
            interview, data=request.data, partial=True
        )
        if update_serializer.is_valid() and "notes" in update_serializer.validated_data:
            interview.notes = update_serializer.validated_data["notes"]
            interview.save()
            return Response(status=status.HTTP_200_OK)
        return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecruitmentApplicationWithdrawApplicantView(APIView):
    """
    View that allows applicants to withdraw their application for a position.

    PUT endpoint requires position ID (pk) in the URL.
    """

    permission_classes = [IsAuthenticated]

    def put(self, request: Request, pk: int) -> Response:
        # Checks if user has applied for position
        application = get_object_or_404(
            RecruitmentApplication, recruitment_position=pk, user=request.user
        )
        # Withdraw if applied
        application.withdrawn = True
        application.save()
        serializer = RecruitmentApplicationForApplicantSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecruitmentApplicationApplicantPriorityView(APIView):
    """
    View that allows applicants to change the priority of their applications.

    PUT endpoint requires application ID (pk) in the URL and a 'direction' in the request body.
    Returns all applications for the user in priority order.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = RecruitmentUpdateUserPrioritySerializer

    def put(
        self,
        request: Request,
        pk: int,
    ) -> Response:
        direction = RecruitmentUpdateUserPrioritySerializer(data=request.data)
        if direction.is_valid():
            direction = direction.validated_data["direction"]
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
            ).order_by("applicant_priority"),
            many=True,
        )
        return Response(serializer.data)


class PositionByTagsView(ListAPIView):
    """
    Fetches recruitment positions by common tags for a specific recruitment.

    Expected query parameters:
    - tags: Comma-separated list of tags (e.g. "tag1,tag2,tag3")
    - position_id (optional): ID of position to exclude from results

    Returns positions that match any of the provided tags.
    """

    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionForApplicantSerializer

    def get_queryset(self) -> QuerySet:
        recruitment_id = self.kwargs.get("id")
        tags_param = self.request.query_params.get("tags")
        current_position_id = self.request.query_params.get("position_id")

        if not tags_param:
            return RecruitmentPosition.objects.none()

        # Split and clean the tags
        tags = [tag.strip() for tag in tags_param.split(",") if tag.strip()]

        if not tags:
            return RecruitmentPosition.objects.none()

        # Create Q objects for each tag to search in the tags field
        tag_queries = [Q(tags__icontains=tag) for tag in tags]

        # Combine queries with OR operator
        combined_query = reduce(operator.or_, tag_queries)

        # Base queryset with recruitment and tag filtering
        queryset = RecruitmentPosition.objects.filter(
            combined_query, recruitment_id=recruitment_id
        ).select_related("gang")

        # Exclude current position if position_id is provided
        if current_position_id:
            queryset = queryset.exclude(id=current_position_id)

        return queryset

    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        if not request.query_params.get("tags"):
            return Response(
                {"message": "No tags provided in query parameters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response({"count": len(serializer.data), "positions": serializer.data})
