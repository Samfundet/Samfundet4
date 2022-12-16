from typing import Any

from guardian.admin import GuardedModelAdmin
from guardian.shortcuts import get_objects_for_user

from django.http import HttpRequest
from django.db.models import QuerySet
from django.contrib.auth.admin import UserAdmin, GroupAdmin


class CustomGuardedModelAdmin(GuardedModelAdmin):
    """
    https://www.youtube.com/watch?v=2jhQyWeEVHc&list=LL&index=2
    """
    user_can_access_owned_objects_only = True  # setting for GuardedModelAdmin

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        if request.user.is_superuser:
            # print(18, super().get_queryset(request))
            return super().get_queryset(request)

        data = self.get_model_objects(request=request)
        # print(22, self.opts.model_name, data)
        return data

    def get_model_objects(
        self,
        *,
        request: HttpRequest,
        actions: list[str] | None = None,
        klass: Any = None,
    ) -> QuerySet:
        """Return accessible objects of a model if user has any of given permission on it."""
        opts = self.opts
        actions = actions if actions else ['add', 'view', 'change', 'delete']
        klass = klass if klass else opts.model
        model_name: str = klass._meta.model_name
        perms: list[str] = [f'{opts.app_label}.{action}_{model_name}' for action in actions]

        # print(39, self.opts.model_name, get_objects_for_user(user=request.user, perms=perms, any_perm=True))
        return get_objects_for_user(
            user=request.user,
            perms=perms,
            any_perm=True,
        )

    def has_module_permission(self, request: HttpRequest) -> bool:
        """
        Determines if user can see index page in admin panel.
        We extend this method to set true if user has permission to any of the models.
        """
        if super().has_module_permission(request=request):
            # print(52, self.opts.model_name, True)
            return True

        has_at_least_one_object_permission: bool = self.get_model_objects(request=request).exists()
        return has_at_least_one_object_permission

    def has_permission(
        self,
        *,
        request: HttpRequest,
        obj: Any,
        action: str,
    ) -> bool:
        """Return all objects of a model if user has any of given permission on it."""
        opts = self.opts
        perm: str = f'{opts.app_label}.{action}_{opts.model_name}'

        has_module_or_obj_perm: bool = request.user.has_perm(perm=perm, obj=obj)
        has_action_object_perm: bool = self.get_model_objects(request=request, actions=[action]).exists()
        # print(71, self.opts.model_name, has_module_or_obj_perm, has_action_object_perm)
        return has_module_or_obj_perm or has_action_object_perm

    def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return self.has_permission(request=request, obj=obj, action='add')

    def has_view_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return self.has_permission(request=request, obj=obj, action='view')

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return self.has_permission(request=request, obj=obj, action='change')

    def has_delete_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return self.has_permission(request=request, obj=obj, action='delete')

    @classmethod
    def custom_search_fields(cls, *, prefix: str = '') -> list[str]:
        """
        Helper to get search_fields for related models in other admins.

        For example if a Profile has an owner (User), we likely
        want to be able to search for usernames in the admin panel.
        To do this we fetch all of the UserAdmin.search_fields
        and prefix them with our the Profile field name.

        ```py
        class ProfileAdmin(CustomGuardedModelAdmin):
            # Fetch and unpack fields.
            _user_search_fields = UserAdmin.custom_search_fields(prefix='owner')
            search_fields = [*_user_search_fields]

            # Results in e.g.:
            search_fields = ['owner__username', 'owner__first_name', 'owner__last_name']
        """
        prefix__ = f'{prefix}__' if prefix else ''
        return [f'{prefix__}{field}' for field in cls.search_fields]


class CustomGuardedUserAdmin(CustomGuardedModelAdmin, UserAdmin):
    ...


class CustomGuardedGroupAdmin(CustomGuardedModelAdmin, GroupAdmin):
    ...
