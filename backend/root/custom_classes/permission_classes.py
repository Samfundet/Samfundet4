from rest_framework.permissions import DjangoObjectPermissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.request import Request

from django.views.generic.base import View


class CustomDjangoObjectPermissions(DjangoObjectPermissions):
    """Add django permissions to read methods."""
    DjangoObjectPermissions.perms_map['GET'].append('%(app_label)s.view_%(model_name)s')
    DjangoObjectPermissions.perms_map['HEAD'].append('%(app_label)s.view_%(model_name)s')


class ReadOnly(BasePermission):

    def has_permission(self, request: Request, view: View) -> bool:
        return request.method in SAFE_METHODS
