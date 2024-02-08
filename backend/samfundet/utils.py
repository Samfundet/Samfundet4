from __future__ import annotations

from django.http import QueryDict
from django.db.models import Q
from django.db.models.query import QuerySet

from .models.event import Event

###


def event_query(*, query: QueryDict, events: QuerySet[Event] = None) -> QuerySet[Event]:
    if not events:
        events = Event.objects.all()
    search = query.get('search', None)
    if search:
        events = events.filter(
            Q(title_nb__icontains=search) | Q(title_en__icontains=search) | Q(description_long_nb__icontains=search) |
            Q(description_long_en__icontains=search) | Q(description_short_en=search) | Q(description_short_nb=search) | Q(location__icontains=search) |
            Q(event_group__name=search)
        )
    event_group = query.get('event_group', None)
    if event_group:
        events = events.filter(event_group__id=event_group)

    location = query.get('venue', None)
    if location:
        events = events.filter(location__icontains=location)  # TODO should maybe be a foreignKey?
    return events
