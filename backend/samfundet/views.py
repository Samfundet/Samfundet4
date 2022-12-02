from typing import Type

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission

from django.contrib.auth import login, get_user_model, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.contrib.auth.models import Group, Permission
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

from root.constants import XCSRFTOKEN

from .utils import (
    user_to_dataclass,
    users_to_dataclass,
    groups_to_dataclass,
    permissions_to_dataclass,
)
from .models import (
    Menu,
    Gang,
    Event,
    Profile,
    Venue,
    MenuItem,
    GangType,
    FoodCategory,
    FoodPreference,
    UserPreference,
    InformationPage,
)
from .serializers import (
    GangSerializer,
    MenuSerializer,
    EventSerializer,
    ProfileSerializer,
    VenueSerializer,
    LoginSerializer,
    MenuItemSerializer,
    GangTypeSerializer,
    FoodCategorySerializer,
    FoodPreferenceSerializer,
    UserPreferenceSerializer,
    InformationPageSerializer,
)

User = get_user_model()


class EventView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class VenueView(ModelViewSet):
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()


@method_decorator(csrf_protect, 'dispatch')
class LoginView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request=request, user=user)
        new_csrf_token = get_token(request=request)

        return Response(
            status=status.HTTP_202_ACCEPTED,
            data=new_csrf_token,
            headers={XCSRFTOKEN: new_csrf_token},
        )


@method_decorator(csrf_protect, 'dispatch')
class LogoutView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = user_to_dataclass(user=request.user, flat=False)
        return Response(data=user.to_dict())  # type: ignore[attr-defined]


class AllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        users = users_to_dataclass(users=User.objects.all(), flat=False)
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
        all_groups = groups_to_dataclass(groups=list(Group.objects.all()), flat=False)
        all_groups_objs = [group.to_dict() for group in all_groups]  # type: ignore[attr-defined]
        return Response(data=all_groups_objs)


@method_decorator(ensure_csrf_cookie, 'dispatch')
class CsrfView(APIView):
    permission_classes: list[Type[BasePermission]] = [AllowAny]

    def get(self, request: Request) -> Response:
        csrf_token = get_token(request=request)
        return Response(data=csrf_token, headers={XCSRFTOKEN: csrf_token})


@method_decorator(csrf_protect, 'dispatch')
class UserPreferenceView(ModelViewSet):
    serializer_class = UserPreferenceSerializer
    queryset = UserPreference.objects.all()


class ProfileView(ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


### GANGS ###
class GangView(ModelViewSet):
    serializer_class = GangSerializer
    queryset = Gang.objects.all()


class GangTypeView(ModelViewSet):
    serializer_class = GangTypeSerializer
    queryset = GangType.objects.all()


### Information Page ###


class InformationPageView(ModelViewSet):
    serializer_class = InformationPageSerializer
    queryset = InformationPage.objects.all()


class MenuView(ModelViewSet):
    serializer_class = MenuSerializer
    queryset = Menu.objects.all()


class MenuItemView(ModelViewSet):
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all()


class FoodCategoryView(ModelViewSet):
    serializer_class = FoodCategorySerializer
    queryset = FoodCategory.objects.all()


class FoodPreferenceView(ModelViewSet):
    serializer_class = FoodPreferenceSerializer
    queryset = FoodPreference.objects.all()
