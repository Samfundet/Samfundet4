from __future__ import annotations

from typing import TYPE_CHECKING, Any

from rest_framework.permissions import BasePermission, DjangoModelPermissions, DjangoObjectPermissions

from samfundet.models.role import UserOrgRole, UserGangRole, UserGangSectionRole

if TYPE_CHECKING:
    from rest_framework.views import APIView
    from rest_framework.request import Request

    from django.db.models import Model, QuerySet

    from samfundet.models.general import User


class SuperUserPermission(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        user: User = request.user
        return user.is_active and user.is_superuser

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        return self.has_permission(request=request, view=view)


class CustomDjangoModelPermissions(DjangoModelPermissions):
    """Add django permissions to read methods."""

    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }


class CustomDjangoObjectPermissions(DjangoObjectPermissions):
    """Add django permissions to read methods."""

    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }

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


def has_required_permissions(request, perms):
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


class CustomDjangoRolePermissions(CustomDjangoModelPermissions):
    """
    Django system that allows users with relevant roles permissions.
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
