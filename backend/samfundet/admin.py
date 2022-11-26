from guardian import models as guardian_models

from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.admin.models import LogEntry
from django.contrib.sessions.models import Session
from django.contrib.contenttypes.models import ContentType

from root.custom_classes.admin_classes import CustomGuardedModelAdmin

from .models import (
    Gang,
    Event,
    Venue,
    Profile,
    GangType,
    EventGroup,
    UserPreference,
    InformationPage,
)

# Guardian models.
admin.site.register(guardian_models.GroupObjectPermission, CustomGuardedModelAdmin)
admin.site.register(guardian_models.UserObjectPermission, CustomGuardedModelAdmin)

# Django models.
admin.site.register(Permission, CustomGuardedModelAdmin)
admin.site.register(ContentType, CustomGuardedModelAdmin)
admin.site.register(LogEntry, CustomGuardedModelAdmin)
admin.site.register(Session, CustomGuardedModelAdmin)

# Our models.


@admin.register(UserPreference)
class UserPreferenceAdmin(CustomGuardedModelAdmin):
    ...


@admin.register(Profile)
class ProfileAdmin(CustomGuardedModelAdmin):
    ...


@admin.register(Event)
class EventAdmin(CustomGuardedModelAdmin):
    ...


@admin.register(EventGroup)
class EventGroupAdmin(CustomGuardedModelAdmin):
    ...


@admin.register(Venue)
class VenueAdmin(CustomGuardedModelAdmin):
    ...


### GANGS ###
@admin.register(Gang)
class GangAdmin(CustomGuardedModelAdmin):
    ...


@admin.register(GangType)
class GangTypeAdmin(CustomGuardedModelAdmin):
    ...


@admin.register(InformationPage)
class InformationPageAdmin(CustomGuardedModelAdmin):
    ...
