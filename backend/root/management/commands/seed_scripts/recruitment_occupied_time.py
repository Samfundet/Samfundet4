from __future__ import annotations

import random
import datetime

from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError

from samfundet.models.recruitment import Recruitment, OccupiedTimeslot, RecruitmentPosition, RecruitmentApplication

BATCH_SIZE = 10000
DELETE_BATCH_SIZE = 10000

HOURS_PER_DAY = 8
START_HOUR = 10
WORKDAYS = 10
SLOT_LENGTH_MINUTES = 30

# New constants for more realistic availability patterns
MAX_DAYS_PER_USER = 8  # Maximum number of days a user can be available
MAX_BLOCKS_PER_DAY = 2  # Maximum number of separate time blocks per day
MIN_SLOTS_PER_BLOCK = 2  # Minimum consecutive slots in a block
MAX_SLOTS_PER_BLOCK = 8  # Maximum consecutive slots in a block


def validate_interviewer_seeding():
    """Check if interviewers have been seeded."""
    positions_with_interviewers = RecruitmentPosition.objects.filter(interviewers__isnull=False).distinct().count()
    if positions_with_interviewers == 0:
        raise ValidationError(
            'No positions with interviewers found! Please run the recruitment_interviewers seed script first:\n'
            'python manage.py seed recruitment_interviewers'
        )


def get_weekdays(start_date: datetime.date, end_date: datetime.date) -> list[datetime.date]:
    """Get a list of weekdays between start and end date."""
    current = start_date
    weekdays = []
    while current <= end_date and len(weekdays) < WORKDAYS:
        if current.weekday() < 5:  # Monday = 0, Friday = 4
            weekdays.append(current)
        current += datetime.timedelta(days=1)
    return weekdays[:WORKDAYS]


def batch_delete(model, batch_size=DELETE_BATCH_SIZE) -> int:
    """Delete records in batches to avoid memory issues."""
    total_deleted = 0
    while True:
        ids = list(model.objects.values_list('id', flat=True)[:batch_size])
        if not ids:
            break
        model.objects.filter(id__in=ids).delete()
        total_deleted += len(ids)
    return total_deleted


def generate_base_daily_slots(tz) -> list[tuple[datetime.time, datetime.time]]:
    """Pre-generate all possible time slots for a day."""
    slots = []
    end_hour = START_HOUR + HOURS_PER_DAY

    for hour in range(START_HOUR, end_hour):
        slots.append((datetime.time(hour, 0), datetime.time(hour, 30)))
        if hour < end_hour - 1:
            slots.append((datetime.time(hour, 30), datetime.time(hour + 1, 0)))

    return slots


def generate_block_pattern(total_slots: int, used_slots: set[int] = None) -> list[int]:
    """Generate a single block of consecutive slots, avoiding used slots."""
    if used_slots is None:
        used_slots = set()

    # Calculate maximum block size based on remaining available slots
    available_slots = total_slots - len(used_slots)
    max_block_size = min(MAX_SLOTS_PER_BLOCK, available_slots)

    if max_block_size < MIN_SLOTS_PER_BLOCK:
        return []

    # Generate block size
    block_size = random.randint(MIN_SLOTS_PER_BLOCK, max_block_size)

    # Find valid starting positions (must have enough consecutive free slots)
    valid_starts = []
    for start in range(total_slots - block_size + 1):
        block_range = range(start, start + block_size)
        if not any(slot in used_slots for slot in block_range):
            valid_starts.append(start)

    if not valid_starts:
        return []

    # Choose random start position and generate block
    start_pos = random.choice(valid_starts)
    return list(range(start_pos, start_pos + block_size))


def get_relevant_users() -> tuple[dict[int, str], dict[str, int]]:
    """Get all users who are either applicants or interviewers with their role and count by role."""
    user_roles = {}
    role_counts = {'applicant': 0, 'interviewer': 0, 'both': 0}

    # Mark applicants
    for user_id in RecruitmentApplication.objects.values_list('user_id', flat=True).distinct():
        user_roles[user_id] = 'applicant'
        role_counts['applicant'] += 1

    # Mark interviewers (might override some applicants as 'both')
    for position in RecruitmentPosition.objects.all():
        for user_id in position.interviewers.values_list('id', flat=True):
            if user_id in user_roles:
                if user_roles[user_id] == 'applicant':
                    role_counts['applicant'] -= 1
                    role_counts['both'] += 1
                user_roles[user_id] = 'both'
            else:
                user_roles[user_id] = 'interviewer'
                role_counts['interviewer'] += 1

    return user_roles, role_counts


def generate_recruitment_slots(
    recruitment_id: int,
    user_id: int,
    user_role: str,
    weekdays: list[datetime.date],
    base_slots: list[tuple[datetime.time, datetime.time]],
    tz,
) -> list[OccupiedTimeslot]:
    """Generate realistic timeslots for a user based on their role."""
    slots = []
    total_slots_per_day = len(base_slots)

    # Select random days (more days for interviewers)
    num_days = random.randint(2, MAX_DAYS_PER_USER)
    if user_role in ('interviewer', 'both'):
        num_days = random.randint(3, MAX_DAYS_PER_USER)

    selected_days = random.sample(weekdays, min(num_days, len(weekdays)))

    for day in selected_days:
        # Determine number of blocks for this day (1 or 2)
        num_blocks = random.randint(1, MAX_BLOCKS_PER_DAY)
        used_slots = set()

        # Generate blocks for the day
        for _ in range(num_blocks):
            block_slots = generate_block_pattern(total_slots_per_day, used_slots)
            if not block_slots:  # Skip if no valid block could be generated
                continue

            # Add slots to used set
            used_slots.update(block_slots)

            # Create timeslots for this block
            for slot_idx in block_slots:
                start_time, end_time = base_slots[slot_idx]
                start_dt = timezone.make_aware(datetime.datetime.combine(day, start_time), tz)
                end_dt = timezone.make_aware(datetime.datetime.combine(day, end_time), tz)
                slots.append(OccupiedTimeslot(user_id=user_id, recruitment_id=recruitment_id, start_dt=start_dt, end_dt=end_dt))

    return slots


def seed():
    yield 0, 'occupied_timeslot'

    try:
        validate_interviewer_seeding()
    except ValidationError as e:
        yield 100, str(e)
        return

    # Delete existing timeslots in batches
    total_records = OccupiedTimeslot.objects.count()
    if total_records > 0:
        deleted_count = batch_delete(OccupiedTimeslot)
        yield 10, f'Deleted {deleted_count} old occupied timeslots'

    current_tz = timezone.get_current_timezone()
    base_slots = generate_base_daily_slots(current_tz)

    # Get users with their roles and role counts
    user_roles, role_counts = get_relevant_users()
    total_users = len(user_roles)

    recruitments = list(Recruitment.objects.all().values('id', 'visible_from', 'shown_application_deadline'))
    created_count = 0
    timeslots_to_create = []

    with transaction.atomic():
        for user_index, (user_id, role) in enumerate(user_roles.items()):
            for recruitment in recruitments:
                start_date = recruitment['visible_from'].date()
                end_date = recruitment['shown_application_deadline'].date()
                weekdays = get_weekdays(start_date, end_date)

                new_slots = generate_recruitment_slots(recruitment['id'], user_id, role, weekdays, base_slots, current_tz)
                timeslots_to_create.extend(new_slots)

                # Bulk create when batch size is reached
                if len(timeslots_to_create) >= BATCH_SIZE:
                    OccupiedTimeslot.objects.bulk_create(timeslots_to_create)
                    created_count += len(timeslots_to_create)
                    timeslots_to_create = []
                    yield min(90, 15 + (user_index + 1) * 75 / total_users), f'Created {created_count} timeslots for {user_index + 1}/{total_users} users'

        # Create any remaining timeslots
        if timeslots_to_create:
            OccupiedTimeslot.objects.bulk_create(timeslots_to_create)
            created_count += len(timeslots_to_create)

    user_summary = f"(Applicants: {role_counts['applicant']}, " f"Interviewers: {role_counts['interviewer']}, " f"Both: {role_counts['both']})"
    yield 100, f'Created {created_count} occupied timeslots {user_summary}'
