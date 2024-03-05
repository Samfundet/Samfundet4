from __future__ import annotations

from datetime import timedelta, datetime

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
            Q(title_nb__icontains=search)
            | Q(title_en__icontains=search)
            | Q(description_long_nb__icontains=search)
            | Q(description_long_en__icontains=search)
            | Q(description_short_en=search)
            | Q(description_short_nb=search)
            | Q(location__icontains=search)
            | Q(event_group__name=search)
        )
    event_group = query.get('event_group', None)
    if event_group:
        events = events.filter(event_group__id=event_group)

    location = query.get('venue', None)
    if location:
        events = events.filter(location__icontains=location)  # TODO should maybe be a foreignKey?
    return events


def generate_timeslots(start_time, end_time, interval_minutes: int) -> list[str]:
    # Convert from datetime.time objects to datetime.datetime
    start_datetime = datetime.combine(datetime.today(), start_time)
    end_datetime = datetime.combine(datetime.today(), end_time)
    diff = end_datetime - start_datetime

    # Calculate the number of intervals. Rounded to ensure we don't bypass end_time
    num_intervals = int(diff.total_seconds() / (interval_minutes * 60))

    timeslots = [start_datetime + timedelta(minutes=i * interval_minutes) for i in range(num_intervals + 1)]
    formatted = [timeslot.strftime('%H:%M') for timeslot in timeslots]

    return formatted
