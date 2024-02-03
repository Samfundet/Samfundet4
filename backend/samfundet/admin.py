from __future__ import annotations
from django.urls import reverse
from django.contrib import admin
from django.utils.html import format_html
from django.contrib.admin.models import LogEntry
from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
from django.contrib.sessions.models import Session
from guardian import models as guardian_models
from root.utils.routes import admin__samfundet_recruitmentadmission_change

from root.custom_classes.admin_classes import (CustomGuardedUserAdmin, CustomGuardedGroupAdmin, CustomGuardedModelAdmin, CustomBaseAdmin)

from .models.event import (Event, EventGroup, EventRegistration)
from .models.recruitment import (
    Recruitment,
    RecruitmentPosition,
    RecruitmentAdmission,
    InterviewRoom,
    Interview,
    Occupiedtimeslot,
)
from .models.general import (
    Tag,
    User,
    Menu,
    Gang,
    Venue,
    Table,
    Image,
    Campus,
    Profile,
    Booking,
    Infobox,
    MenuItem,
    GangType,
    TextItem,
    KeyValue,
    BlogPost,
    Organization,
    Reservation,
    ClosedPeriod,
    Saksdokument,
    FoodCategory,
    FoodPreference,
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
admin.site.unregister(Group)
# Just for testing TODO remove when done
admin.site.register(Occupiedtimeslot)


@admin.register(User)
class UserAdmin(CustomGuardedUserAdmin):
    sortable_by = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'last_login', 'date_joined', 'updated_at']
    list_display = [
        'id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'group_memberships', 'last_login', 'date_joined',
        'updated_at'
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
    _user_search_fields = UserAdmin.custom_search_fields(prefix='user')
    search_fields = ['id', 'object_repr', *_user_search_fields]
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
    _user_search_fields = UserAdmin.custom_search_fields(prefix='user')
    list_display = ['id', '__str__', 'user', 'permission', 'content_type']
    search_fields = [*_user_search_fields]
    # filter_horizontal = [] # TODO
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['user', 'permission', 'content_type']
    list_select_related = True


### End: Guardian models ###


### Our models ###
@admin.register(Campus)
class CampusAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'name_nb', 'name_en', 'abbreviation']
    # list_filter = []
    list_display = ['id', '__str__', 'name_nb', 'abbreviation']
    search_fields = ['id', 'name_nb', 'name_en', 'abbreviation']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(UserPreference)
class UserPreferenceAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'user', 'theme', 'created_at', 'updated_at']
    list_filter = ['theme']
    list_display = ['id', '__str__', 'user', 'theme', 'created_at', 'updated_at']
    _user_search_fields = UserAdmin.custom_search_fields(prefix='user')
    search_fields = ['id', 'theme', *_user_search_fields]
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['user']
    list_select_related = True


@admin.register(Profile)
class ProfileAdmin(CustomGuardedModelAdmin):
    # ordering = []
    sortable_by = ['id', 'user', 'nickname', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['id', '__str__', 'user', 'nickname', 'created_at', 'updated_at']
    _user_search_fields = UserAdmin.custom_search_fields(prefix='user')
    search_fields = ['id', 'nickname', *_user_search_fields]
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['user']
    list_select_related = True


@admin.register(EventRegistration)
class EventRegistrationAdmin(CustomGuardedModelAdmin):
    list_display = ['id']
    filter_horizontal = ['registered_users', 'registered_emails']


@admin.register(Event)
class EventAdmin(CustomBaseAdmin):
    # ordering = []

    sortable_by = ['id', 'title_nb', 'title_en', 'host', 'location', 'event_group', 'created_at', 'updated_at']
    list_filter = ['event_group']
    list_display = ['id', '__str__', 'title_nb', 'title_en', 'host', 'location', 'event_group', 'publish_dt', 'start_dt', 'created_at', 'updated_at']
    search_fields = ['id', 'title_nb', 'title_en', 'host', 'location']
    filter_horizontal = ['editors']
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True
    readonly_fields = ['registration']


@admin.register(Tag)
class TagAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name']
    list_display = ['id', 'name', 'color']
    search_fields = ['id', 'name']
    # filter_horizontal = []
    list_display_links = ['id']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(Image)
class ImageAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'title', 'image']
    list_display = ['id', 'title', 'image']
    list_filter = ['tags']
    search_fields = ['id', 'title', 'image', 'tags']
    # filter_horizontal = []
    list_display_links = ['id']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(EventGroup)
class EventGroupAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id']
    # list_filter = [] # TODO
    list_display = ['id', '__str__']
    # search_fields = []
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    # list_select_related = True


@admin.register(Venue)
class VenueAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name', 'floor', 'last_renovated', 'handicapped_approved', 'responsible_crew', 'opening', 'closing', 'created_at', 'updated_at']
    list_filter = ['handicapped_approved']
    list_display = [
        'id', '__str__', 'name', 'floor', 'last_renovated', 'handicapped_approved', 'responsible_crew', 'opening', 'closing', 'created_at', 'updated_at'
    ]
    search_fields = ['id', 'name', 'responsible_crew']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


# GANGS:
@admin.register(Gang)
class GangAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name_nb', 'abbreviation', 'gang_type', 'created_at', 'updated_at']
    list_filter = ['gang_type']
    list_display = ['id', '__str__', 'name_nb', 'abbreviation', 'gang_type', 'created_at', 'updated_at']
    search_fields = ['id', 'name_nb', 'abbreviation']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['gang_type']
    list_select_related = True


@admin.register(GangType)
class GangTypeAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'title_nb', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['id', '__str__', 'title_nb', 'created_at', 'updated_at']
    search_fields = ['id', 'title_nb']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(InformationPage)
class InformationPageAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['slug_field', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['__str__', 'slug_field', 'created_at', 'updated_at']
    search_fields = ['slug_field', 'title_nb', 'title_en']
    # filter_horizontal = []
    list_display_links = ['__str__', 'slug_field']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(BlogPost)
class BlogPostAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'title_nb', 'title_en', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['__str__', 'id', 'created_at', 'updated_at']
    search_fields = ['id', 'title_nb', 'title_en', 'text_en', 'text_nb']
    # filter_horizontal = []
    list_display_links = ['__str__', 'id']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(Table)
class TableAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name_nb', 'name_en', 'seating', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['id', '__str__', 'name_nb', 'name_en', 'seating', 'created_at', 'updated_at']
    search_fields = ['id', 'name_nb', 'name_en']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(Reservation)
class ReservationAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name', 'email', 'phonenumber']
    # list_filter = []
    list_display = ['id', '__str__', 'name', 'email', 'phonenumber']
    search_fields = ['id', 'name', 'email', 'phonenumber']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(Menu)
class MenuAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name_nb', 'name_en', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['id', '__str__', 'name_nb', 'name_en', 'menu_item_count', 'created_at', 'updated_at']
    search_fields = ['id', 'name_nb', 'name_en']
    filter_horizontal = ['menu_items']
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True

    def menu_item_count(self, obj: Menu) -> int:
        n: int = obj.menu_items.all().count()
        return n


@admin.register(MenuItem)
class MenuItemAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name_nb', 'name_en', 'price', 'price_member', 'order', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['id', '__str__', 'name_nb', 'name_en', 'price', 'price_member', 'order', 'created_at', 'updated_at']
    search_fields = ['id', 'name_nb', 'name_en']
    filter_horizontal = ['food_preferences']
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(FoodCategory)
class FoodCategoryAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name_nb', 'name_en', 'order', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['id', '__str__', 'name_nb', 'name_en', 'order', 'created_at', 'updated_at']
    search_fields = ['id', 'name_nb', 'name_en']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(FoodPreference)
class FoodPreferenceAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name_nb', 'name_en', 'created_at', 'updated_at']
    # list_filter = []
    list_display = ['id', '__str__', 'name_nb', 'name_en', 'created_at', 'updated_at']
    search_fields = ['id', 'name_nb', 'name_en']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    list_select_related = True


@admin.register(Saksdokument)
class SaksdokumentAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'title_nb']
    # list_filter = []
    list_display = ['id', '__str__', 'title_nb']
    search_fields = ['id', 'title_nb']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []


@admin.register(Booking)
class BookingAdmin(CustomBaseAdmin):
    # ordering = []
    # list_filter = []
    list_display = ['id', '__str__', 'name', 'get_duration', 'table_count', 'created_at', 'updated_at']
    _user_search_fields = UserAdmin.custom_search_fields(prefix='user')
    search_fields = ['id', 'name', *_user_search_fields]
    filter_horizontal = ['tables']
    list_display_links = ['id', '__str__']
    autocomplete_fields = ['user']
    list_select_related = True


@admin.register(ClosedPeriod)
class ClosedPeriodAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id']
    # list_filter = [] # TODO
    list_display = ['id', '__str__', 'created_at', 'updated_at']
    # search_fields = []
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []
    # list_select_related = True


@admin.register(Infobox)
class InfoboxAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'title_nb']
    # list_filter = []
    list_display = ['id', '__str__', 'title_nb']
    search_fields = ['id', 'title_nb']
    # filter_horizontal = []
    list_display_links = ['id', '__str__']
    # autocomplete_fields = []


@admin.register(TextItem)
class TextItemAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['key']
    # list_filter = []
    list_display = ['key', '__str__']
    search_fields = ['key']
    # filter_horizontal = []
    list_display_links = ['key', '__str__']
    # autocomplete_fields = []
    # list_select_related = True


@admin.register(KeyValue)
class KeyValueAdmin(CustomGuardedModelAdmin):
    sortable_by = ['key']
    list_display = ['id', 'key', 'value']
    search_fields = ['id', 'key', 'value']


@admin.register(Recruitment)
class RecruitmentAdmin(CustomBaseAdmin):
    sortable_by = [
        'visible_from', 'actual_application_deadline', 'shown_application_deadline', 'reprioritization_deadline_for_applicant',
        'reprioritization_deadline_for_groups', 'organization'
    ]
    list_display = [
        'visible_from', 'actual_application_deadline', 'shown_application_deadline', 'reprioritization_deadline_for_applicant',
        'reprioritization_deadline_for_groups', 'organization'
    ]
    search_fields = [
        'visible_from', 'actual_application_deadline', 'shown_application_deadline', 'reprioritization_deadline_for_applicant',
        'reprioritization_deadline_for_groups', 'organization'
    ]
    list_display_links = ['visible_from']
    list_select_related = True


class RecruitmentAdmissionInline(admin.TabularInline):
    """
    Inline admin interface for RecruitmentAdmission.

    Displays a link to the detailed admin page of each admission along with its user and applicant priority.
    """
    model = RecruitmentAdmission
    extra = 0
    readonly_fields = ['linked_admission_text', 'user', 'applicant_priority']
    fields = ['linked_admission_text', 'user', 'applicant_priority']

    def linked_admission_text(self, obj: RecruitmentAdmission) -> str:
        """
        Returns a clickable link leading to the admin change page of the RecruitmentAdmission instance.
        """
        url = reverse(admin__samfundet_recruitmentadmission_change, args=[obj.pk])
        return format_html('<a href="{url}">{obj}</a>', url=url, obj=obj.admission_text)


@admin.register(RecruitmentPosition)
class RecruitmentPositionAdmin(CustomBaseAdmin):
    sortable_by = [
        'name_nb',
        'is_funksjonaer_position',
        'gang',
        'id',
    ]
    list_display = ['name_nb', 'is_funksjonaer_position', 'gang', 'id', 'admissions_count']
    search_fields = ['name_nb', 'is_funksjonaer_position', 'gang', 'id']
    filter_horizontal = ['interviewers']
    list_select_related = True

    inlines = [RecruitmentAdmissionInline]

    def admissions_count(self, obj: RecruitmentPosition) -> int:
        count = obj.admissions.all().count()
        return count


@admin.register(RecruitmentAdmission)
class RecruitmentAdmissionAdmin(CustomBaseAdmin):
    sortable_by = [
        'id',
        'recruitment_position',
        'recruitment',
        'user',
    ]
    list_display = [
        'id',
        'recruitment_position',
        'recruitment',
        'user',
    ]
    search_fields = [
        'id',
        'recruitment_position',
        'recruitment',
        'user',
    ]
    list_select_related = True


@admin.register(Organization)
class OrganizationAdmin(CustomBaseAdmin):
    sortable_by = ['id', 'name']
    list_display = ['id', 'name']
    search_fields = ['id', 'name']
    list_select_related = True


@admin.register(InterviewRoom)
class InterviewRoomAdmin(CustomBaseAdmin):
    list_filter = ['name', 'location', 'recruitment', 'gang', 'start_time', 'end_time']
    list_display = ['name', 'location', 'recruitment', 'gang', 'start_time', 'end_time']
    search_fields = ['name', 'location', 'recruitment__name', 'gang__name']
    list_display_links = ['name', 'location']
    list_select_related = ['recruitment', 'gang']


@admin.register(Interview)
class InterviewAdmin(CustomBaseAdmin):
    list_filter = ['id', 'notes']
    list_display = ['id', 'notes']
    search_fields = ['id', 'notes']
    list_display_links = ['id', 'notes']


### End: Our models ###
