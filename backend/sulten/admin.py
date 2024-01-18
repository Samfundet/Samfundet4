from django.contrib import admin

from root.custom_classes.admin_classes import CustomBaseAdmin
from sulten.models import FoodPreference, FoodCategory, MenuItem, Menu


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
