from __future__ import annotations

from datetime import time, datetime, timedelta
from collections import defaultdict

from django.http import QueryDict
from django.utils import timezone
from django.db.models import Q, Model
from django.utils.timezone import make_aware
from django.core.exceptions import ValidationError
from django.db.models.query import QuerySet
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from .models import User
from .exceptions import *
from .models.event import Event
from .models.recruitment import (
    Interview,
    Recruitment,
    OccupiedTimeslot,
    InterviewTimeblock,
    RecruitmentPosition,
    RecruitmentApplication,
    RecruitmentInterviewAvailability,
)

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
    InterviewTimeblock.objects.filter(recruitment_position__recruitment=recruitment).delete()

    positions = RecruitmentPosition.objects.filter(recruitment=recruitment)
    block_count = 0

    current_date = timezone.now().date()  # Get the current date

    for position in positions:
        start_date = max(recruitment.visible_from.date(), current_date)  # Use the later of visible_from or current date
        end_date = recruitment.actual_application_deadline.date()
        # create a timeframe for any day, for when interviews can be held.
        start_time = time(14, 0)  # TODO: decide if these should be modefialbe. Might want want to set this timeframe in some other way.
        end_time = time(23, 0)  #  TODO: -- "" --
        interval = timedelta(minutes=30)  # 30-minute intervals. TODO: decide if this is needed.

        current_date = start_date
        while current_date <= end_date:
            current_datetime = timezone.make_aware(datetime.combine(current_date, start_time))
            end_datetime = timezone.make_aware(datetime.combine(current_date, end_time))

            unavailability = get_unavailability(recruitment)
            blocks = generate_blocks(position, current_datetime, end_datetime, unavailability, interval)

            for block in blocks:
                # adds the blocks to the database. TODO: check if this can be done in a more efficient way, maybe bulk add?
                interview_block = InterviewTimeblock.objects.create(
                    recruitment_position=position,
                    date=current_date,
                    start_dt=block['start'],
                    end_dt=block['end'],
                    rating=calculate_rating(block['start'], block['end'], len(block['available_interviewers'])),
                )
                interview_block.available_interviewers.set(block['available_interviewers'])
                block_count += 1

            current_date += timedelta(days=1)

    return block_count


def get_unavailability(recruitment):
    # Fetch all OccupiedTimeslot objects for the given recruitment
    occupied_timeslots = OccupiedTimeslot.objects.filter(recruitment=recruitment).order_by('start_dt')

    return occupied_timeslots


# this function generates timeblocks. If you want to understand interview time blocks read the documentation. # TODO: add documentation.
def generate_blocks(position, start_dt, end_dt, unavailability, interval):
    all_interviewers = set(
        position.interviewers.all()
    )  # All interviewers for this position. TODO: decide if we want to have a predefined set of POSSIBLE interviewers for some position
    blocks = []
    current_dt = start_dt

    while current_dt < end_dt:
        block_end = min(current_dt + interval, end_dt)
        available_interviewers = all_interviewers.copy()

        # Iterate through unavailability slots to check if any interviewers are unavailable
        for slot in unavailability:
            if slot.start_dt < block_end and slot.end_dt > current_dt:
                # Remove the unavailable interviewer for this block
                available_interviewers.discard(slot.user)

        # Always create a new block if available interviewers change. #TODO add print statements to check if this acctually works as expected.
        if not blocks or len(blocks[-1]['available_interviewers']) != len(available_interviewers):
            # Create a new block when interviewer availability changes
            blocks.append({'start': current_dt, 'end': block_end, 'available_interviewers': available_interviewers})
        else:
            # Extend the last block if interviewer availability hasn't changed
            blocks[-1]['end'] = block_end

        current_dt = block_end

    return blocks


def allocate_interviews_for_position(position, limit_to_first_applicant=False) -> int:
    # Define interview duration
    interview_duration = timedelta(minutes=30)

    # want the higest rated earliest blocks first. If all blocks are equaly rated the earliest block will be first.
    timeblocks = sorted(InterviewTimeblock.objects.filter(recruitment_position=position), key=lambda block: (-block.rating, block.start_dt))
    if not timeblocks:
        raise NoTimeBlocksAvailableError(f'No available time blocks for position: {position.name_en}')

    applications = list(RecruitmentApplication.objects.filter(recruitment_position=position, withdrawn=False, interview__isnull=True))
    if not applications:
        raise NoApplicationsWithoutInterviewsError(f'No applications without interviews for position: {position.name_en}')

    # Prepare unavailability data
    applicant_unavailability = defaultdict(list)
    interviewer_unavailability = defaultdict(list)

    # Collect unavailability for each applicant
    for slot in OccupiedTimeslot.objects.filter(recruitment=position.recruitment):
        applicant_unavailability[slot.user.id].append((slot.start_dt, slot.end_dt))

    # Collect unavailability for each interviewer and existing interviews. #TODO check if this is needed, we allready have interview time blocks, which is an abstraction of interviewers availability.
    existing_interviews = Interview.objects.filter(applications__recruitment_position=position)
    for interview in existing_interviews:
        for interviewer in interview.interviewers.all():
            interviewer_unavailability[interviewer.id].append((interview.interview_time, interview.interview_time + interview_duration))
        # Mark the interview time as unavailable for all interviewers
        for interviewer in position.interviewers.all():
            interviewer_unavailability[interviewer.id].append((interview.interview_time, interview.interview_time + interview_duration))

    interview_count = 0  # TODO remove, it is only used to check if something happens. Add better exceptions insted
    all_applicants_unavailable = True
    current_time = timezone.now() + timedelta(
        hours=24
    )  # TODO: find out if 24h is needed. Ensure interviews are at least 24 hours in the future. Interviews should be planned well in advance.

    future_blocks = [block for block in timeblocks if block.end_dt > current_time]  # for checking if there are any timeslots available.
    if not future_blocks:
        raise NoFutureTimeSlotsError(f'No time slots available at least 24 hours in the future for position: {position.name_en}')

    for block in future_blocks:
        block_start = max(
            block.start_dt, current_time
        )  # TODO: check if this is to specific. Do we care about seting interviews from "this monent" when interviews onlt can be allocated 24h in advance?
        current_time = block_start

        while current_time + interview_duration <= block.end_dt and applications:
            interview_end_time = current_time + interview_duration

            # Check if this time slot is already occupied by an existing interview
            if any(interview.interview_time == current_time for interview in existing_interviews):
                # TODO: replace print with a good exception. print(f'  Slot {current_time} - {interview_end_time} already has an interview')
                current_time += interview_duration
                continue

            available_interviewers = get_available_interviewers(
                block.available_interviewers.all(), current_time, interview_end_time, interviewer_unavailability
            )

            if not available_interviewers:
                # TODO: replace print with a good exception. print(f'  No available interviewers for slot: {current_time} - {interview_end_time}')
                current_time += interview_duration
                continue

            for application in applications[:]:
                applicant = application.user

                if is_applicant_available(applicant, current_time, interview_end_time, applicant_unavailability):
                    all_applicants_unavailable = False
                    # Create and assign a new interview
                    interview = Interview.objects.create(
                        interview_time=current_time,
                        interview_location=f'Location for {position.name_en}',  # TODO: set inteview room dependent on what rooms are available in the DB at the time of the intrerview
                        room=None,  # Set the room if required
                    )
                    interview.interviewers.set(available_interviewers)
                    interview.save()

                    # Link the interview to the application
                    application.interview = interview
                    application.save()

                    # Mark this time of interview as occupied for the applicant and interviewers.
                    # Applicants are given a 2 hour buffer after interviews to avoid time conflict with other positions.
                    mark_applicant_unavailable(applicant, current_time, interview_end_time)
                    mark_interviewers_unavailable(available_interviewers, current_time, interview_end_time, interviewer_unavailability)

                    # Add the new interview to existing_interviews to prevent double-booking
                    existing_interviews = list(existing_interviews) + [interview]

                    interview_count += 1
                    applications.remove(application)
                    # TODO: Create a Exception for informing of what interviews was created in a HTTP response ??? print(f'  Allocated interview for {applicant.username} at {current_time}')

                    if limit_to_first_applicant:
                        # TODO remove this conditional with "limit to first applicant". It was used for testing.
                        return interview_count

                    break
                else:
                    print(f'  Applicant {applicant.username} not available for this slot')

            current_time += interview_duration

        if not applications:
            break

    if interview_count == 0:
        if all_applicants_unavailable:
            raise AllApplicantsUnavailableError(f'All applicants are unavailable for the remaining time slots for position: {position.name_en}')
        else:
            raise NoAvailableInterviewersError(f'No available interviewers for any time slot for position: {position.name_en}')

    if applications:
        raise InsufficientTimeBlocksError(
            f'Not enough time blocks to accommodate all applications for position: {position.name_en}. Allocated {interview_count} interviews.'
        )

    return interview_count  # TODO, decide if this is needed


def calculate_rating(start_dt, end_dt, available_interviewers_count) -> int:
    block_length = (end_dt - start_dt).total_seconds() / 3600
    rating = (available_interviewers_count * 2) + (block_length * 0.5)
    return max(0, rating)


def is_applicant_available(applicant, start_dt, end_dt, unavailability) -> bool:
    """Check if the applicant is available during the given time block."""
    for unavail_start, unavail_end in unavailability.get(applicant.id, []):
        if unavail_start < end_dt and unavail_end > start_dt:
            return False  # Applicant is unavailable during this time
    return True


def mark_applicant_unavailable(applicant, start_dt, end_dt, buffer_hours=2):
    """Mark the applicant's timeslot as occupied, including a buffer period after the interview."""
    buffer_end = end_dt + timedelta(hours=buffer_hours)
    OccupiedTimeslot.objects.create(
        user=applicant,
        recruitment=applicant.applications.first().recruitment,
        start_dt=start_dt,
        end_dt=buffer_end,
    )


def get_available_interviewers(interviewers, start_dt, end_dt, interviewer_unavailability) -> None:
    """Return a list of available interviewers who are free during the time block."""
    available_interviewers = []

    for interviewer in interviewers:
        if is_interviewer_available(interviewer, start_dt, end_dt, interviewer_unavailability):
            available_interviewers.append(interviewer)

    return available_interviewers


def is_interviewer_available(interviewer, start_dt, end_dt, unavailability) -> bool:
    """Check if the interviewer is available during the given time block."""
    for unavail_start, unavail_end in unavailability.get(interviewer.id, []):
        if unavail_start < end_dt and unavail_end > start_dt:
            return False  # Interviewer is unavailable during this time
    return True


def mark_interviewers_unavailable(interviewers, start_dt, end_dt, unavailability) -> None:
    """Mark the interviewers as unavailable for the given time block."""
    for interviewer in interviewers:
        unavailability[interviewer.id].append((start_dt, end_dt))
