from __future__ import annotations

import datetime

from django.http import QueryDict
from django.db.models import Q, Model
from django.utils.timezone import make_aware
from django.core.exceptions import ValidationError
from django.db.models.query import QuerySet
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from .models import User
from .models.event import Event
from .models.recruitment import Recruitment, OccupiedTimeslot, RecruitmentInterviewAvailability

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


def get_user_by_search(*, query: QueryDict, users: QuerySet[User] = None) -> QuerySet[User]:
    if not users:
        users = User.objects.all()
    search = query.get('search', None)
    if search:
        for name in search.split():
            users = users.filter(Q(username__icontains=name) | Q(first_name__icontains=name) | Q(last_name__icontains=name))
        return users
    return users


def generate_timeslots(start_time: datetime.time, end_time: datetime.time, interval_minutes: int) -> list[str]:
    # Convert from datetime.time objects to datetime.datetime
    start_datetime = datetime.datetime.combine(datetime.datetime.today(), start_time)
    end_datetime = datetime.datetime.combine(datetime.datetime.today(), end_time)

    # If end time is before start, it likely means we want to pass midnight. So add another day
    if end_datetime < start_datetime:
        end_datetime += datetime.timedelta(days=1)

    diff = end_datetime - start_datetime

    # Calculate the number of intervals. Rounded to ensure we don't bypass end_time
    num_intervals = int(diff.total_seconds() / (interval_minutes * 60))

    timeslots = [start_datetime + datetime.timedelta(minutes=i * interval_minutes) for i in range(num_intervals)]
    formatted = [timeslot.strftime('%H:%M') for timeslot in timeslots]

    return formatted


def get_occupied_timeslots_from_request(
    user_dates: dict[str, list[str]], user: User, availability: RecruitmentInterviewAvailability, recruitment: Recruitment
) -> list[OccupiedTimeslot]:
    """
    Based on user provided data, return their occupied timeslots.

    If no availability is provided, all of user's occupied timeslots are considered valid.

    :raises ValidationError: if `dates` contains an invalid timeslot
    """
    occupied_timeslots = []

    if availability:
        # Generate all possible valid timeslots
        timeslots = generate_timeslots(
            availability.start_time,
            availability.end_time,
            availability.timeslot_interval,
        )

        # Check that all provided timeslots exist for the recruitment
        for date, date_timeslots in user_dates.items():
            invalid = [x for x in date_timeslots if x not in timeslots]
            if invalid:
                raise ValidationError(f'Invalid dates: {invalid}')
            for timeslot in date_timeslots:
                start_date = make_aware(
                    datetime.datetime.strptime(f'{date} {timeslot}', '%Y.%m.%d %H:%M'),
                    timezone=datetime.UTC,
                )
                end_date = start_date + datetime.timedelta(minutes=availability.timeslot_interval)

                occupied_timeslots.append(OccupiedTimeslot(user=user, recruitment=recruitment, start_dt=start_date, end_dt=end_date))

    return occupied_timeslots


def get_perm(*, perm: str, model: type[Model]) -> Permission:
    codename = perm.split('.')[1] if '.' in perm else perm
    content_type = ContentType.objects.get_for_model(model=model)
    permission = Permission.objects.get(codename=codename, content_type=content_type)
    return permission
