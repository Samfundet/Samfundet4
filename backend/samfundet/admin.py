from guardian import admin as guardian_admin
from guardian import models as guardian_models

from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.admin.models import LogEntry
from django.contrib.sessions.models import Session
from django.contrib.contenttypes.models import ContentType

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
admin.site.register(guardian_models.GroupObjectPermission, guardian_admin.GuardedModelAdmin)
admin.site.register(guardian_models.UserObjectPermission, guardian_admin.GuardedModelAdmin)

# Django models.
admin.site.register(Permission, guardian_admin.GuardedModelAdmin)
admin.site.register(ContentType, guardian_admin.GuardedModelAdmin)
admin.site.register(LogEntry, guardian_admin.GuardedModelAdmin)
admin.site.register(Session, guardian_admin.GuardedModelAdmin)

# Our models.


@admin.register(UserPreference)
class UserPreferenceManager(guardian_admin.GuardedModelAdmin):
    ...


@admin.register(Profile)
class ProfileManager(guardian_admin.GuardedModelAdmin):
    ...


@admin.register(Event)
class EventManager(guardian_admin.GuardedModelAdmin):
    ...


@admin.register(EventGroup)
class EventGroupManager(guardian_admin.GuardedModelAdmin):
    ...


@admin.register(Venue)
class VenueManager(guardian_admin.GuardedModelAdmin):
    ...


### GANGS ###
@admin.register(Gang)
class GangManager(guardian_admin.GuardedModelAdmin):
    ...


@admin.register(GangType)
class GangTypeManager(guardian_admin.GuardedModelAdmin):
    ...


@admin.register(InformationPage)
class InformationPageManager(guardian_admin.GuardedModelAdmin):
    ...
