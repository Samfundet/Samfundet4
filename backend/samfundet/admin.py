from guardian import models as guardian_models

from django.contrib import admin
from django.contrib.auth.models import Permission, User, Group
from django.contrib.admin.models import LogEntry
from django.contrib.sessions.models import Session
from django.contrib.contenttypes.models import ContentType

from root.custom_classes.admin_classes import (
    CustomGuardedUserAdmin,
    CustomGuardedGroupAdmin,
    CustomGuardedModelAdmin,
)

from .models import (
    Gang,
    Event,
    Venue,
    Table,
    Profile,
    GangType,
    EventGroup,
    UserPreference,
    InformationPage,
)

# Common fields:
# ordering = []
# sortable_by = []
# list_filter = []
# list_display = ['id', '__str__']
# search_fields = []
# filter_horizontal = []
# list_display_links = ['id', '__str__']
# autocomplete_fields = []
# list_select_related = True

### Django models ###

# Unregister User and Group to set new Admins.
admin.site.unregister(User)
admin.site.unregister(Group)


@admin.register(User)
class UserAdmin(CustomGuardedUserAdmin):
    sortable_by = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'last_login', 'date_joined']
    list_display = [
        'id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'group_memberships', 'last_login', 'date_joined'
    ]
    list_display_links = ['id', 'username']
    list_select_related = True

    @admin.display(empty_value='all')
    def group_memberships(self, obj: User) -> int:
        n: int = obj.groups.all().count()
        return n


@admin.register(Group)
class GroupAdmin(CustomGuardedGroupAdmin):
    sortable_by = ['id', 'name']
    list_display = ['id', 'name', 'members']
    list_display_links = ['id', 'name']
    list_select_related = True

    def members(self, obj: Group) -> int:
        n: int = obj.user_set.all().count()
        return n


@admin.register(Permission)
class PermissionAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'codename', 'content_type']
    # list_filter = []
    list_display = ['id', '__str__', 'codename', 'content_type']
    search_fields = ['name', 'codename', 'content_type__app_label', 'content_type__model']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['content_type']
    list_select_related = True


@admin.register(ContentType)
class ContentTypeAdmin(CustomGuardedModelAdmin):
    # ordering = []
    # sortable_by = []
    list_filter = ['id', 'app_label', 'model']
    list_display = ['id', '__str__', 'app_label', 'model']
    search_fields = ['app_label', 'model']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(LogEntry)
class LogEntryAdmin(CustomGuardedModelAdmin):
    sortable_by = ['id', 'user', 'action_flag', 'object_repr', 'action_time']
    list_filter = ['action_flag']
    list_display = ['id', '__str__', 'user', 'action_flag', 'object_repr', 'action_time']
    _user_search_fields = [f'user__{field}' for field in UserAdmin.search_fields]
    search_fields = ['id', *_user_search_fields, 'object_repr']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['user', 'content_type']
    list_select_related = True


@admin.register(Session)
class SessionAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['session_key', 'expire_date']
    # list_filter = []
    list_display = ['session_key', 'expire_date']
    search_fields = ['session_key', 'session_data']
    # filter_horizontal = []
    list_display_links = ['session_key']
    # autocomplete_fields = []
    list_select_related = True


### End: Django models ###


### Guardian models ###
@admin.register(guardian_models.GroupObjectPermission)
class GroupObjectPermissionAdmin(CustomGuardedModelAdmin):
    list_display = ['id', '__str__', 'permission', 'group', 'content_type']
    list_display_links = ['id', '__str__']


@admin.register(guardian_models.UserObjectPermission)
class UserObjectPermissionAdmin(CustomGuardedModelAdmin):
    ordering = ['user']
    sortable_by = ['id', 'user', 'permission', 'content_type']
    # list_filter = [] # TODO
    _user_search_fields = [f'user__{field}' for field in UserAdmin.search_fields]
    list_display = ['id', '__str__', 'user', 'permission', 'content_type']
    search_fields = [*_user_search_fields]
    # filter_horizontal = [] # TODO
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['user', 'permission', 'content_type']
    list_select_related = True


### End: Guardian models ###


### Our models ###
@admin.register(UserPreference)
class UserPreferenceAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'user', 'theme']
    list_filter = ['theme']
    list_display = ['id', '__str__', 'user', 'theme']
    _user_search_fields = [f'user__{field}' for field in UserAdmin.search_fields]
    search_fields = ['id', 'theme', *_user_search_fields]
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['user']
    list_select_related = True


@admin.register(Profile)
class ProfileAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'user', 'nickname']
    # list_filter = []
    list_display = ['id', '__str__', 'user', 'nickname']
    _user_search_fields = [f'user__{field}' for field in UserAdmin.search_fields]
    search_fields = ['id', 'nickname', *_user_search_fields]
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['user']
    list_select_related = True


@admin.register(Event)
class EventAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'title_no', 'title_en', 'host', 'location', 'event_group']
    list_filter = ['event_group']
    list_display = ['id', '__str__', 'title_no', 'title_en', 'host', 'location', 'event_group', 'publish_dt', 'start_dt', 'end_dt']
    search_fields = ['id', 'title_no', 'title_en', 'host', 'location']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(EventGroup)
class EventGroupAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id']
    list_filter = []
    list_display = ['id', '__str__']
    # search_fields = []
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    # list_select_related = True


@admin.register(Venue)
class VenueAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'name', 'floor', 'last_renovated', 'handicapped_approved', 'responsible_crew', 'opening', 'closing']
    list_filter = ['handicapped_approved']
    list_display = ['id', '__str__', 'name', 'floor', 'last_renovated', 'handicapped_approved', 'responsible_crew', 'opening', 'closing']
    search_fields = ['id', 'name', 'responsible_crew']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


# GANGS:
@admin.register(Gang)
class GangAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'name', 'abbreviation', 'gang_type']
    list_filter = ['gang_type']
    list_display = ['id', '__str__', 'name', 'abbreviation', 'gang_type']
    search_fields = ['id', 'name', 'abbreviation']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['gang_type']
    list_select_related = True


@admin.register(GangType)
class GangTypeAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'title']
    # list_filter = []
    list_display = ['id', '__str__', 'title']
    search_fields = ['id', 'title']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(InformationPage)
class InformationPageAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['slug_field']
    # list_filter = []
    list_display = ['__str__', 'slug_field']
    search_fields = ['slug_field', 'title_no', 'title_en']
    # filter_horizontal = []
    list_display_links = ['__str__', 'slug_field']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(Table)
class TableAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'name_no', 'name_en', 'seating']
    # list_filter = []
    list_display = ['id', '__str__', 'name_no', 'name_en', 'seating']
    search_fields = ['id'
                     'name_no', 'name_en']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


### End: Our models ###
