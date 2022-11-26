from typing import Any

from guardian.admin import GuardedModelAdmin
from guardian.shortcuts import get_objects_for_user

from django.http import HttpRequest
from django.db.models import QuerySet


class CustomGuardedModelAdmin(GuardedModelAdmin):
    user_can_access_owned_objects_only = True  # setting for GuardedModelAdmin

    def custom_get_model_objects(
        self,
        *,
        request: HttpRequest,
        actions: list[str] | None = None,
        klass: Any = None,
    ) -> QuerySet:
        """Return all objects of a model if user has any of given permission on it."""
        opts = self.opts
        actions = actions if actions else ['add', 'view', 'change', 'delete']
        klass = klass if klass else opts.model
        model_name: str = klass._meta.model_name
        perms: list[str] = [f'{opts.app_label}.{action}_{model_name}' for action in actions]
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
        has_at_least_one_model_permission: bool = self.custom_get_model_objects(request=request).exists()
        return has_at_least_one_model_permission

    def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        # pylint: disable=unused-argument
        has_permission: bool = self.custom_get_model_objects(request=request, actions=['add']).exists()
        return has_permission

    def has_view_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        # pylint: disable=unused-argument
        has_permission: bool = self.custom_get_model_objects(request=request, actions=['view']).exists()
        return has_permission

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        # pylint: disable=unused-argument
        has_permission: bool = self.custom_get_model_objects(request=request, actions=['change']).exists()
        return has_permission

    def has_delete_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        # pylint: disable=unused-argument
        has_permission: bool = self.custom_get_model_objects(request=request, actions=['delete']).exists()
        return has_permission

    # NOTE: doesn't work because methods has_*_permission doesn't send obj.
    # def custom_has_permission(
    #     self,
    #     *,
    #     request: HttpRequest,
    #     obj: Any,
    #     actions: list[str] | None = None,
    #     any_: bool = False,
    # ) -> bool:
    #     """Return all objects of a model if user has any of given permission on it."""
    #     opts = self.opts
    #     actions = actions if actions else ['add', 'view', 'change', 'delete']
    #     klass = opts.model
    #     model_name: str = klass._meta.model_name
    #     perms: list[str] = [f'{opts.app_label}.{action}_{model_name}' for action in actions]

    #     if any_:
    #         has_permission: bool = any(request.user.has_perm(perm=perm, obj=obj) for perm in perms)
    #     else:
    #         has_permission = request.user.has_perms(perm_list=perms, obj=obj)
    #     return has_permission

    # def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
    #     return self.custom_has_permission(request=request, obj=obj, actions=['add'])

    # def has_view_permission(self, request: HttpRequest, obj: Any = None) -> bool:
    #     return self.custom_has_permission(request=request, obj=obj, actions=['view'])

    # def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
    #     return self.custom_has_permission(request=request, obj=obj, actions=['change'])

    # def has_delete_permission(self, request: HttpRequest, obj: Any = None) -> bool:
    #     return self.custom_has_permission(request=request, obj=obj, actions=['delete'])
