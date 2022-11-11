from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.admin.models import LogEntry
from django.contrib.sessions.models import Session
from django.contrib.contenttypes.models import ContentType

from .models import Event, Venue

# Django models.
admin.site.register(Permission)
admin.site.register(ContentType)
admin.site.register(LogEntry)
admin.site.register(Session)

# Our models.
admin.site.register(Event)
admin.site.register(Venue)
