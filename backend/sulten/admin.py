from django.contrib import admin

from root.custom_classes.admin_classes import CustomBaseAdmin
from samfundet.admin import UserAdmin
from sulten.models import Table, Reservation, FoodPreference, FoodCategory, MenuItem, Menu, Booking


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
