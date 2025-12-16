from __future__ import annotations

from typing import TYPE_CHECKING, Any

from rest_framework.permissions import SAFE_METHODS, BasePermission, DjangoModelPermissions, DjangoObjectPermissions

from django.conf import settings
from django.http import Http404

from samfundet.models.role import UserOrgRole, UserGangRole, UserGangSectionRole

if TYPE_CHECKING:
    from rest_framework.views import APIView
    from rest_framework.request import Request

    from django.db.models import Model, QuerySet

    from samfundet.models.general import User


# Constant used to define the permissions required for each method
# This is used to check if the user has the required permissions directly
FULLY_PROTECTED_PERMS_MAP = {
    'GET': ['%(app_label)s.view_%(model_name)s'],
    'OPTIONS': ['%(app_label)s.view_%(model_name)s'],
    'HEAD': ['%(app_label)s.view_%(model_name)s'],
    'POST': ['%(app_label)s.add_%(model_name)s'],
    'PUT': ['%(app_label)s.change_%(model_name)s'],
    'PATCH': ['%(app_label)s.change_%(model_name)s'],
    'DELETE': ['%(app_label)s.delete_%(model_name)s'],
}

DEFAULT_PERMS_MAP = {
    'GET': [],
    'OPTIONS': [],
    'HEAD': [],
    'POST': ['%(app_label)s.add_%(model_name)s'],
    'PUT': ['%(app_label)s.change_%(model_name)s'],
    'PATCH': ['%(app_label)s.change_%(model_name)s'],
    'DELETE': ['%(app_label)s.delete_%(model_name)s'],
}


class SuperUserPermission(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        user: User = request.user
        return user.is_active and user.is_superuser

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        return self.has_permission(request=request, view=view)


class CustomDjangoModelPermissions(DjangoModelPermissions):
    """Requires permissions for all actions performed."""

    perms_map = FULLY_PROTECTED_PERMS_MAP


class CustomDjangoObjectPermissions(DjangoObjectPermissions):
    """Add django permissions to read methods."""

    perms_map = FULLY_PROTECTED_PERMS_MAP

    def has_permission(self, request: Request, view: APIView) -> bool:
        queryset: QuerySet = self._queryset(view)
        model_cls: Model = queryset.model
        user: User = request.user

        if not user.is_authenticated:
            return False

        if request.method == 'POST':
            post_perms: list[str] = self.get_required_permissions(method='POST', model_cls=model_cls)
            has_perm = user.has_perms(perm_list=post_perms)
            return has_perm

        return True


def has_required_permissions(request: Request, perms: list[str]) -> bool:
    role_models = [UserOrgRole, UserGangRole, UserGangSectionRole]
    for role_model in role_models:
        user_roles = role_model.objects.filter(user=request.user)
        for user_role in user_roles:
            # Get permissions with app label
            role_perms = user_role.role.permissions.values_list('content_type__app_label', 'codename')
            # Construct full permission strings
            role_perms = [f'{app_label}.{codename}' for app_label, codename in role_perms]
            if any(perm in role_perms for perm in perms):
                return True
    return False


class FullyProtectedRolePermissions(CustomDjangoModelPermissions):
    """
    Permission class that allows users with relevant roles permissions.
    Note that this does not limit the queryset to only show objects that the user has permissions to.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if not request.user or (not request.user.is_authenticated and self.authenticated_users_only):
            return False

        # Workaround to ensure DjangoModelPermissions are not applied
        # to the root view when using DefaultRouter.
        if getattr(view, '_ignore_model_permissions', False):
            return True

        queryset = self._queryset(view)
        perms = self.get_required_permissions(request.method, queryset.model)

        # Check if the user has the required permissions directly
        if request.user.has_perms(perms):
            return True

        # Check if the user has a role that grants the required permissions
        return bool(has_required_permissions(request, perms))


class RoleProtectedObjectPermissions(DjangoObjectPermissions):
    """
    Django system that allows users with relevant roles permissions.
    Note that this does not limit the queryset to only show objects that the user has permissions to.
    Returns 404 if user does not have read permissions for an object,
    so that the user cannot see that the object exists.
    """

    perms_map = FULLY_PROTECTED_PERMS_MAP

    def has_permission(self, request: Request, view: APIView) -> bool:
        if not request.user or (not request.user.is_authenticated and self.authenticated_users_only):
            return False

        # Workaround to ensure DjangoModelPermissions are not applied
        # to the root view when using DefaultRouter.
        if getattr(view, '_ignore_model_permissions', False):
            return True

        queryset = self._queryset(view)
        perms = self.get_required_permissions(request.method, queryset.model)

        # Check if the user has the required permissions directly
        if request.user.has_perms(perms):
            return True

        # Check if the user has a role that grants the required permissions
        return bool(has_required_permissions(request, perms))

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        # authentication checks have already executed via has_permission
        queryset = self._queryset(view)
        model_cls = queryset.model
        user = request.user

        perms = self.get_required_object_permissions(request.method, model_cls)

        if not user.has_perms(perms, obj):
            # If the user does not have permissions we need to determine if
            # they have read permissions to see 403, or not, and simply see
            # a 404 response.

            if request.method in SAFE_METHODS:
                # Read permissions already checked and failed, no need
                # to make another lookup.
                raise Http404

            read_perms = self.get_required_object_permissions('GET', model_cls)
            if not user.has_perms(read_perms, obj):
                raise Http404

            # Has read permissions.
            return False

        return True


class RoleProtectedOrAnonReadOnlyObjectPermissions(RoleProtectedObjectPermissions):
    """
    Django system that allows users with relevant roles permissions.
    Note that this does not limit the queryset to only show objects that the user has permissions to.
    If the user does not have read permissions for an object, they will still be able to see that the object exists.
    """

    perms_map = DEFAULT_PERMS_MAP
    authenticated_users_only = False


def filter_queryset_by_permissions(queryset: QuerySet, user: User, permission: str) -> QuerySet:
    """
    Filters a queryset based on user's permissions.

    :param queryset: The original queryset to filter
    :param user: The user to check permissions for
    :param permission: Permission to check.
    :return: Filtered queryset with only objects the user can view
    """
    # If no user is provided or user is not authenticated, return empty queryset
    if not user or not user.is_authenticated:
        return queryset.none()

    # Check if user has model-level permission
    if user.has_perm(permission):
        return queryset

    # If no model-level permission, filter by object-level permissions
    permitted_ids = [obj.id for obj in queryset if user.has_perm(permission, obj)]

    return queryset.filter(id__in=permitted_ids)


class FeatureEnabled(BasePermission):
    feature_key = None
    message = 'This feature is not available yet.'

    def has_permission(self, request: Request, view: APIView) -> bool:
        key = getattr(view, 'feature_key', None) or getattr(self, 'feature_key', None)
        if key is None:
            return True  # No feature key set, allow access
        return key in getattr(settings, 'CP_ENABLED', set())
