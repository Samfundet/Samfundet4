from __future__ import annotations

from typing import TYPE_CHECKING

from django.urls import reverse
from django.contrib import admin
from django.utils.html import format_html

from root.constants import WebFeatures
from root.custom_classes.admin_classes import CustomBaseAdmin

from samfundet.utils import register_if_feature_enabled
from samfundet.infopages.models import InformationPage, InformationPageRevision

if TYPE_CHECKING:
    from django.http import HttpRequest
    from django.utils.safestring import SafeString


@register_if_feature_enabled(WebFeatures.INFORMATION, InformationPage)
class InformationPageAdmin(CustomBaseAdmin):
    sortable_by = ['slug_field', 'created_at', 'updated_at', 'visible', 'current_version']
    list_display = ['__str__', 'slug_field', 'owner', 'current_version', 'visible', 'created_at', 'updated_at']
    search_fields = ['slug_field']
    list_display_links = ['__str__', 'slug_field']
    readonly_fields = [*CustomBaseAdmin.readonly_fields, 'current_version']
    list_select_related = ['gang', 'section__gang', 'current_revision']

    @admin.display(description='Owner')
    def owner(self, page: InformationPage) -> str:
        return str(page.section or page.gang or '-')

    @admin.display(description='Current version', ordering='current_revision__version')
    def current_version(self, page: InformationPage) -> SafeString | str:
        revision = page.current_revision
        if revision is None:
            return '-'
        url = reverse('admin:samfundet_informationpagerevision_change', args=[revision.pk])
        return format_html('<a href="{}">{}</a>', url, revision.version)


@register_if_feature_enabled(WebFeatures.INFORMATION, InformationPageRevision)
class InformationPageRevisionAdmin(CustomBaseAdmin):
    # CustomBaseAdmin defaults to the CustomBaseModel audit fields, and revisions have no updated_*.
    readonly_fields = ['version', 'created_by', 'created_at']
    sortable_by = ['page', 'version', 'created_at']
    list_display = ['page', 'version', 'created_at', 'created_by']
    list_display_links = ['__str__', 'page', 'version']
    list_filter = ['page']
    search_fields = ['page__slug_field', 'title_nb', 'title_en']
    list_select_related = True

    # These overrides ensure editing revisions is not possible through Django admin panel
    def has_add_permission(self, request: HttpRequest, obj: InformationPageRevision | None = None) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: InformationPageRevision | None = None) -> bool:
        return False

    def has_delete_permission(self, request: HttpRequest, obj: InformationPageRevision | None = None) -> bool:
        return False
