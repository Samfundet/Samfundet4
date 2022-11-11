from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth import login, get_user_model
from django.contrib.auth.models import Group, Permission

from .utils import (
    user_to_dataclass,
    users_to_dataclass,
    groups_to_dataclass,
    permissions_to_dataclass,
)
from .models import Event, Venue
from .serializers import EventSerializer, VenueSerializer, LoginSerializer

User = get_user_model()


class EventView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class VenueView(ModelViewSet):
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()


class LoginView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request=request, user=user)
        return Response(data=None, status=status.HTTP_202_ACCEPTED)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = user_to_dataclass(user=request.user)
        return Response(data=user.to_dict())  # type: ignore[attr-defined]


class AllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        users = users_to_dataclass(users=User.objects.all())
        users_objs = [user.to_dict() for user in users]  # type: ignore[attr-defined]
        return Response(data=users_objs)


class AllPermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        all_permissions = permissions_to_dataclass(permissions=Permission.objects.all())
        all_permissions_objs = [permission.to_dict() for permission in all_permissions]  # type: ignore[attr-defined]
        return Response(data=all_permissions_objs)


class AllGroupsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        all_groups = groups_to_dataclass(groups=list(Group.objects.all()))
        all_groups_objs = [group.to_dict() for group in all_groups]  # type: ignore[attr-defined]
        return Response(data=all_groups_objs)
