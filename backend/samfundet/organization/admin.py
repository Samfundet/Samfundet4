from __future__ import annotations

from django.urls import reverse
from django.utils.html import format_html

from root.constants import WebFeatures
from root.custom_classes.admin_classes import CustomBaseAdmin

from samfundet.utils import register_if_feature_enabled
from samfundet.organization.models import Gang, GangType, GangSection


@register_if_feature_enabled(WebFeatures.GANGS, Gang)
class GangAdmin(CustomBaseAdmin):
    # ordering = []
    sortable_by = ['id', 'name_nb', 'abbreviation', 'gang_type', 'created_at', 'updated_at']
    list_filter = ['gang_type', 'organization']
    list_display = ['id', 'organization', 'name_nb', 'abbreviation', 'gang_type', 'created_at', 'updated_at']
    search_fields = ['id', 'name_nb', 'abbreviation']
    # filter_horizontal = []
    list_display_links = ['id', 'name_nb']
    autocomplete_fields = ['gang_type', 'organization']
    list_select_related = True


@register_if_feature_enabled(WebFeatures.GANGS, GangType)
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


@register_if_feature_enabled(WebFeatures.GANGS, GangSection)
class GangSectionAdmin(CustomBaseAdmin):
    def gang_link(self, obj: GangSection) -> str:
        link = reverse('admin:samfundet_gang_change', args=(obj.gang.id,))
        return format_html('<a href="{}">{}</a>', link, obj.gang.name_nb)

    sortable_by = ['id', 'name_nb', 'gang', 'created_at', 'updated_at']
    list_filter = ['gang']
    list_display = ['id', 'name_nb', 'gang', 'created_at', 'updated_at']
    search_fields = ['id', 'name_nb']
    list_display_links = ['id', 'name_nb']
    list_select_related = True
    related_links = ['gang']
