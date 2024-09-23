from __future__ import annotations

from datetime import datetime, time, timedelta

from django.http import QueryDict
from django.utils import timezone
from django.db.models import Q, Model
from django.utils.timezone import make_aware
from django.core.exceptions import ValidationError
from django.db.models.query import QuerySet
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from .models import User
from .models.event import Event
from .models.recruitment import Recruitment, OccupiedTimeslot, InterviewTimeblock, RecruitmentPosition, RecruitmentInterviewAvailability

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


def generate_timeslots(start_time: datetime.time, end_time: datetime.time, interval_minutes: int) -> list[str]:
    # Convert from datetime.time objects to datetime.datetime
    start_datetime = datetime.datetime.combine(datetime.datetime.today(), start_time)
    end_datetime = datetime.datetime.combine(datetime.datetime.today(), end_time)
    diff = end_datetime - start_datetime

    # Calculate the number of intervals. Rounded to ensure we don't bypass end_time
    num_intervals = int(diff.total_seconds() / (interval_minutes * 60))

    timeslots = [start_datetime + datetime.timedelta(minutes=i * interval_minutes) for i in range(num_intervals + 1)]
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
        for date in user_dates:
            invalid = [x for x in user_dates[date] if x not in timeslots]
            if invalid:
                raise ValidationError(f'Invalid dates: {invalid}')
            for timeslot in user_dates[date]:
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


def generate_interview_timeblocks(recruitment_id):
    recruitment = Recruitment.objects.get(id=recruitment_id)

    # Delete existing time blocks for this recruitment
    InterviewTimeblock.objects.filter(recruitment_position__recruitment=recruitment).delete()

    positions = RecruitmentPosition.objects.filter(recruitment=recruitment)
    block_count = 0

    for position in positions:
        start_date = recruitment.visible_from.date()
        end_date = recruitment.actual_application_deadline.date()
        start_time = time(8, 0)  # 8:00 AM
        end_time = time(20, 0)  # 8:00 PM
        interval_minutes = 30

        current_date = start_date
        while current_date <= end_date:
            current_datetime = timezone.make_aware(datetime.combine(current_date, start_time))
            end_datetime = timezone.make_aware(datetime.combine(current_date, end_time))

            while current_datetime < end_datetime:
                next_datetime = current_datetime + timedelta(minutes=interval_minutes)

                available_interviewers = position.interviewers.exclude(
                    occupied_timeslots__recruitment=recruitment, occupied_timeslots__start_dt__lt=next_datetime, occupied_timeslots__end_dt__gt=current_datetime
                )

                rating = calculate_rating(recruitment, position, current_datetime, next_datetime, available_interviewers.count())

                InterviewTimeblock.objects.create(
                    recruitment_position=position, date=current_date, start_dt=current_datetime, end_dt=next_datetime, rating=rating
                )
                block_count += 1

                current_datetime = next_datetime

            current_date += timedelta(days=1)

    return block_count


def calculate_rating(recruitment, position, start_dt, end_dt, available_interviewers_count):
    block_length = (end_dt - start_dt).total_seconds() / 3600  # in hours
    occupied_slots = OccupiedTimeslot.objects.filter(recruitment=recruitment, start_dt__lt=end_dt, end_dt__gt=start_dt).count()

    # You can adjust these weights based on your preferences
    rating = (available_interviewers_count * 2) + (block_length * 0.5) - (occupied_slots * 1)
    return max(0, rating)  # Ensure the rating is not negative
