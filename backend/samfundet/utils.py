from __future__ import annotations
from django.http import QueryDict
from django.db.models import Q, CharField, TextField
from django.db.models.query import QuerySet
from django.http import QueryDict

from .models.event import (
    Event,
)


###


def general_search(query: QuerySet, search_term: str, types: tuple = (CharField, TextField)) -> QuerySet:
    """

    Args:
        query: QuerySet
        search_term: What to search for
        types: What fields to search in

    Returns:
        Filtered QuerySet

    """
    qs = Q()
    for field in query.model._meta.fields:
        for typ in types:
            if isinstance(field, typ):
                qs = qs | Q(**{field.name + '__icontains': search_term})

    return query.filter(qs)


###


def event_query(query: QueryDict, events: QuerySet[Event] = None) -> QuerySet[Event]:
    if not events:
        events = Event.objects.all()
    search = query.get('search', None)
    if search:
        # yapf: disable
        events = events.filter(
            Q(title_nb__icontains=search) |
            Q(title_en__icontains=search) |
            Q(description_long_nb__icontains=search) |
            Q(description_long_en__icontains=search) |
            Q(description_short_en=search) |
            Q(description_short_nb=search) |
            Q(location__icontains=search) |
            Q(event_group__name=search)
        )
        # yapf: enable
    event_group = query.get('event_group', None)
    if event_group:
        events = events.filter(event_group__id=event_group)

    location = query.get('venue', None)
    if location:
        events = events.filter(location__icontains=location)  # TODO should maybe be a foreignKey?
    return events
