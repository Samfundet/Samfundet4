from rest_framework.permissions import DjangoObjectPermissions
from rest_framework.permissions import BasePermission, SAFE_METHODS


class CustomDjangoObjectPermissions(DjangoObjectPermissions):
    """Add django permissions to read methods."""
    DjangoObjectPermissions.perms_map['GET'].append('%(app_label)s.view_%(model_name)s')
    DjangoObjectPermissions.perms_map['HEAD'].append('%(app_label)s.view_%(model_name)s')


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
