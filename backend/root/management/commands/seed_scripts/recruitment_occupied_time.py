from __future__ import annotations

import random
import datetime

from django.utils import timezone

from samfundet.models.general import User
from samfundet.models.recruitment import Recruitment, OccupiedTimeslot


def random_datetime_within_hours(start, end):
    """Generate a random datetime with start time between 12:00 and 18:00 within the given period."""
    start_date = start.date()
    end_date = end.date()

    # Choose a random day within the start and end dates
    random_day = start_date + datetime.timedelta(days=random.randint(0, (end_date - start_date).days))

    # Choose a random hour between 12:00 and 18:00 for start of time slot, this way the timeslot cant go later than 23:00
    start_time = datetime.time(random.randint(12, 18), 0)

    # Combine the random day and random time and make it timezone-aware
    random_datetime = datetime.datetime.combine(random_day, start_time)
    aware_random_datetime = timezone.make_aware(random_datetime, timezone.get_current_timezone())

    return aware_random_datetime


def is_overlapping(user, start_dt, end_dt):
    """Check if the new timeslot overlaps with existing timeslots for the user."""
    return OccupiedTimeslot.objects.filter(user=user, start_dt__lt=end_dt, end_dt__gt=start_dt).exists()


def seed():
    yield 0, 'occupied_timeslot'
    OccupiedTimeslot.objects.all().delete()
    yield 0, 'Deleted old occupied timeslots'

    recruitments = Recruitment.objects.all()
    users = User.objects.all()
    created_count = 0

    for i, recruitment in enumerate(recruitments):
        for j, user in enumerate(users):
            # Create multiple occupied timeslots for each user and recruitment
            for _ in range(3):
                while True:
                    start_dt = random_datetime_within_hours(recruitment.visible_from, recruitment.shown_application_deadline)
                    end_dt = start_dt + datetime.timedelta(hours=random.randint(1, 5))

                    if not is_overlapping(user, start_dt, end_dt):
                        break

                data = {
                    'user': user,
                    'recruitment': recruitment,
                    'start_dt': start_dt,
                    'end_dt': end_dt,
                }
                _, created = OccupiedTimeslot.objects.get_or_create(**data)

                if created:
                    created_count += 1
                yield (i + 1) / len(recruitments), 'occupied_timeslot'

    yield 100, f'Created {created_count} occupied timeslots'
