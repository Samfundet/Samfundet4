from guardian import admin as guardian_admin

from django.contrib import admin

from .models import Gang, GangType


@admin.register(Gang)
class GangManager(guardian_admin.GuardedModelAdmin):
    ...


@admin.register(GangType)
class GangTypeManager(guardian_admin.GuardedModelAdmin):
    ...
