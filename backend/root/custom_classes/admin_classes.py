from typing import Any, Callable, Sequence

from guardian.admin import GuardedModelAdmin
from guardian.shortcuts import get_objects_for_user

from django.http import HttpRequest
from django.urls import reverse
from django.contrib import admin
from django.db.models import QuerySet
from django.contrib.auth.admin import UserAdmin, GroupAdmin

from admin_auto_filters.filters import AutocompleteFilter


def create_link_method(*, field: str) -> Callable[[Any], str]:
    """
    Generate a method that attempts to fetch hyperlink to a `field` from model instance.

    Solves the free variable problem with `field`.
    """

    @admin.display(description=field, ordering=field)
    def link_method(obj: Any) -> str | None:
        related_obj = getattr(obj, field, None)  # noqa: FKA01
        return get_obj_link(related_obj)

    return link_method


def get_obj_link(obj: Any) -> str | None:
    """
    Returns an <a> tag linking to the admin-change-page for the given instance.
    Intended to be used for enhanced columns in the admin-panel by ModelAdmins.

    Example (ContactAdmin):
    ```py
    list_display = ['user_link'] # Show field.
    list_select_related = ['user'] # Reduce sql queries.

    @admin.display(description='column title', ordering='user')
    def user_link(self, obj: Contact) -> str:
        return ContactAdmin.get_obj_link(obj.user)
    ```
    """
    if obj:
        href = get_admin_url(obj=obj)

        return f'<a href="{href}">{obj}</a>'  # nosec: B308, B703
    return None


def get_admin_url(*, obj: Any) -> str:
    """https://stackoverflow.com/questions/10420271/django-how-to-get-admin-url-from-model-instance"""
    info = (obj._meta.app_label, obj._meta.model_name)
    admin_url = reverse('admin:%s_%s_change' % info, args=(obj.pk, ))
    return admin_url


class CustomGuardedModelAdmin(GuardedModelAdmin):
    """
    Using this Admin, the model registered with it
    will be protected by object level permissions.

    It also comes with features such as:
    - csv-export
    - autocomplete + filters
    - hyperlink to related models
    - prefetching to reduce database hits

    https://www.youtube.com/watch?v=2jhQyWeEVHc&list=LL&index=2
    """
    user_can_access_owned_objects_only = True  # setting for GuardedModelAdmin
    list_display = ['id', '__str__']
    list_display_links = ['id', '__str__']

    # This Admin automatically creates links to related models.
    # This field specifies the suffix to use in `list_display` to show this field.
    # You can change this if it somehow collides with another field.
    link_suffix: str = 'link'
    related_links: bool | list[str] = True

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

    def get_list_select_related(self, request: HttpRequest) -> list[str]:
        """
        Extend to append `autocomplete_fields`.
        Also attach `<field>_<link_suffix>` fields.
        These fields will provide html link to instance in admin-panel.
        """
        list_select_related = super().get_list_select_related(request=request)
        autocomplete_fields = list(self.get_autocomplete_fields(request=request) or [])

        # Add `autocomplete_fields` as fields to prefetch,
        # but do not override if already set (default is False).
        # Sometimes autocomplete_fields are not compatible with `list_select_related`,
        # so individual Admins must be allowed to set its own fields.
        if list_select_related is False:
            list_select_related = autocomplete_fields

        # Loop related fields to attach link methods on this Admin.
        for field in autocomplete_fields:
            # Construct field name, e.g. 'user_link'.
            field_name = f'{field}_{self.link_suffix}'
            # Generate method for field and attach with name.
            setattr(self, field_name, create_link_method(field=field))  # noqa: FKA01

        return list_select_related

    def get_list_filter(self, request: HttpRequest) -> list[AutocompleteFilter | str]:
        """
        Extend ModelAdmin to dynamically add AutocompleteFilter to
        all fields defined as autocomplete_fields.
        They should be compatible with AutocompleteFilter.

        More info:
        'autocomplete_fields' are Foreignkey relations on current model.
        They are searchable by their ModelAdmin's 'search_fields'
        and represented by their __str__ method.
        """
        # Dynamically fetch fieldsets and ensure they become lists.
        list_filter = list(super().get_list_filter(request=request) or [])
        autocomplete_fields = list(self.get_autocomplete_fields(request=request) or [])

        # Create AutocompleteFilter for each relation in 'autocomplete_fields'.
        autocomplete_filters = [autocomplete_filter(title=f, field_name=f) for f in autocomplete_fields]

        # Add new filters to result and return.
        new_list_filter = list_filter + autocomplete_filters
        return new_list_filter

    def get_list_display(self, request: HttpRequest) -> Sequence[str]:
        """
        Django doesn't like undefined attributes in list_display.
        We can therefore not use our dynamic <field>_<suffix> methods.
        Instead insert them dynamically on retrieval by using related_links or autocomplete_fields.
        """
        list_display = super().get_list_display(request=request)
        related_links = self.related_links

        # Admin has requested to turn off automatic links, do nothing.
        if not related_links:
            return list_display

        # Feature is on, but fields not specified -> use `autocomplete_fields`.
        if related_links is True:
            autocomplete_fields = list(self.get_autocomplete_fields(request=request) or [])
            related_links = autocomplete_fields

        def _insert_link(*, field: str, related_links: list[str]) -> str:
            """Morph field to link-field if specified, else do nothing."""
            if field in related_links:
                return f'{field}_{self.link_suffix}'
            return field

        # Replace fields with link-fields if specified.
        list_display = [_insert_link(field=field, related_links=related_links) for field in list_display]

        return list_display

    # Adopt methods. Kept separate because this class shouldn't be required in order to use them.
    get_admin_url = get_admin_url
    get_obj_link = get_obj_link


def autocomplete_filter(**kwargs: Any) -> AutocompleteFilter:
    """
    Simple AutocompleteFilter factory.
    """
    return type('AutocompleteFilter', (AutocompleteFilter, ), kwargs)  # noqa: FKA01


class CustomGuardedUserAdmin(CustomGuardedModelAdmin, UserAdmin):
    ...


class CustomGuardedGroupAdmin(CustomGuardedModelAdmin, GroupAdmin):
    ...
