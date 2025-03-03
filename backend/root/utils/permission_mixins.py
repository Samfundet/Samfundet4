from rest_framework.permissions import BasePermission, SAFE_METHODS
from samfundet.models.role import UserGangRole, UserGangSectionRole, UserOrgRole

class IsCreatorOrReadOnly(BasePermission):
    """
    Object-level permission to only allow creators of an object to edit it.
    Assumes the model instance has a `created_by` attribute from CustomBaseModel.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # Instance must have an attribute named `created_by`.
        return obj.created_by == request.user


class IsCreatorOnly(BasePermission):
    """
    Object-level permission to only allow creators of an object to view or edit it.
    Assumes the model instance has a `created_by` attribute from CustomBaseModel.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is authenticated and is the creator
        return request.user.is_authenticated and obj.created_by == request.user


class IsApplicationOwner(BasePermission):
    """Permission to only allow the owner of an application to view or edit it."""

    def has_object_permission(self, request, view, obj):
        # Compare IDs instead of the objects themselves
        return request.user.is_authenticated and obj.user.id == request.user.id


class IsIntern(BasePermission):
    from samfundet.models.role import UserGangRole, UserGangSectionRole, UserOrgRole
    """
    Permission class that checks if the user has any role assigned.
    Having any role signifies the user is an intern.
    """

    message = 'You must be an intern to access this resource.'

    def has_permission(self, request, view):
        # If user isn't authenticated, deny access
        if not request.user or not request.user.is_authenticated:
            return False

        # Check if the user has any role in any context
        has_any_role = (
            UserOrgRole.objects.filter(user=request.user).exists()
            or UserGangRole.objects.filter(user=request.user).exists()
            or UserGangSectionRole.objects.filter(user=request.user).exists()
        )

        return has_any_role

    def has_object_permission(self, request, view, obj):
        # For object-level permissions, we use the same check
        # as has_permission by default
        return self.has_permission(request, view)
