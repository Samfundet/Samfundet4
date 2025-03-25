# =============================== #
#          Auth/Login             #
# =============================== #
from __future__ import annotations

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly

from django.db.models import QuerySet
from django.contrib.auth import login, logout, update_session_auth_hash
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.contrib.auth.models import Group, Permission
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

from root.constants import XCSRFTOKEN, AUTH_BACKEND, REQUESTED_IMPERSONATE_USER

from samfundet.utils import get_user_by_search
from samfundet.pagination import CustomPageNumberPagination
from samfundet.serializers import (
    UserSerializer,
    GroupSerializer,
    LoginSerializer,
    ProfileSerializer,
    RegisterSerializer,
    PermissionSerializer,
    ChangePasswordSerializer,
    UserPreferenceSerializer,
)
from samfundet.models.general import User, Profile, UserPreference


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


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request: Request) -> Response:
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data['new_password']
        user = request.user
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        return Response({'message': 'Successfully updated password'}, status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(data=UserSerializer(request.user, many=False).data)


class AllUsersView(ListAPIView):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get(self, request: Request) -> Response:
        users = get_user_by_search(query=request.query_params)
        return Response(data=UserSerializer(users, many=True).data)


class PaginatedSearchUsersView(ListAPIView):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
    serializer_class = UserSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self) -> QuerySet[User]:
        """
        Get queryset of users with search functionality using the user_query helper.
        Returns ordered queryset of users filtered by search parameters if provided.
        """
        # Pass the query parameters directly to user_query
        return get_user_by_search(query=self.request.query_params).order_by('username')


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


class PermissionView(ModelViewSet):
    serializer_class = PermissionSerializer
    queryset = Permission.objects.all()


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
