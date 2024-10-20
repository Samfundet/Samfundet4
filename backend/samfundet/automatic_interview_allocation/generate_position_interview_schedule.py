from __future__ import annotations

from typing import TypedDict
from datetime import date, time, datetime, timedelta

from django.utils import timezone

from samfundet.models.general import User
from samfundet.models.recruitment import (
    Interview,
    Recruitment,
    OccupiedTimeslot,
    RecruitmentPosition,
)

"""
Automatic interview allocation currently works by creating interview timeblocks.
These time blocks are made by cutting days into sections, where sections are differentiated
the available interviewer count.
Availability is found by deriving it from unavailability.
In a case where occupied time slots can be set from 08:00 - 16:00, these are registred available interviewers
(I) If 4 interviewers are available from 08:00 - 12:00,
(II) 3 interviewers are available from 12:00 - 13:00,
(III) 3 interviewersa are available from 13:00 - 14:00,
(IV) and 5 interviewers are available from 14:00 - 16:00

(I) is one timeblock, (II) and (III) is combined into a second timeblock, and (IV) is a third timeblock.
E.i. timeblocks are differentiated by the amount of available interviewers.

Interview timeblocks are given a rating, based on length of the timeblocks and the count of available interviewers.
"""

# TODO: implement strategy for allocation interviews based on shared interviews (UKA, ISFiT, KSG)
# TODO: implement room allocation, based on rooms available at the time the interview has been set


class InterviewBlock(TypedDict):
    start: datetime
    end: datetime
    available_interviewers: set[User]
    recruitment_position: RecruitmentPosition
    date: date
    rating: float


def create_daily_interview_blocks(
    position: RecruitmentPosition, start_time: time = time(8, 0), end_time: time = time(23, 0), interval: timedelta = timedelta(minutes=30)
) -> list[InterviewBlock]:
    """
    Generates time blocks for interviews based on the recruitment's time range,
    the availability of interviewers, and their unavailability. The blocks are divided
    into 30-minute intervals for each day between the start and end dates.

    Args:
        position: Recruitment position for which interview time blocks are generated.

    Returns:
        List of time blocks with available interviewers, start and end times, and ratings.
    """
    recruitment = position.recruitment

    # Determine the time range: current data, start and end dates for interview slots
    current_date = timezone.now().date()
    start_date = max(recruitment.visible_from.date(), current_date)
    end_date = recruitment.actual_application_deadline.date()

    all_blocks: list[InterviewBlock] = []

    # Loop through each day in the range to generate time blocks
    current_date = start_date
    while current_date <= end_date:
        # Create datetime objects for the start and end of the day
        current_datetime = timezone.make_aware(datetime.combine(current_date, start_time))
        end_datetime = timezone.make_aware(datetime.combine(current_date, end_time))

        # Fetch unavailability slots and generate blocks for the current day
        unavailability = get_unavailability(recruitment)
        blocks = generate_position_interview_schedule(position, current_datetime, end_datetime, unavailability, interval)

        # Use list comprehension to create and add InterviewBlock objects
        all_blocks.extend(
            [
                InterviewBlock(
                    start=block['start'],
                    end=block['end'],
                    available_interviewers=set(block['available_interviewers']),
                    recruitment_position=position,
                    date=current_date,
                    rating=calculate_rating(block['start'], block['end'], len(block['available_interviewers'])),
                )
                for block in blocks
            ]
        )

        current_date += timedelta(days=1)

    return all_blocks


class InterviewTimeBlock(TypedDict):
    start: datetime
    end: datetime
    available_interviewers: set[User]


def generate_position_interview_schedule(
    position: RecruitmentPosition, start_dt: datetime, end_dt: datetime, unavailability: OccupiedTimeslot, interval: timedelta
) -> list:
    """
    Generates time blocks within a given time range, accounting for interviewer unavailability.

    Args:
        position: Recruitment position.
        start_dt: Start datetime of the interview range.
        end_dt: End datetime of the interview range.
        unavailability: List of unavailable timeslots for interviewers.
        interval: Time interval for each block (30 minutes).

    Returns:
        A list of time blocks with available interviewers for each block.
    """
    all_interviewers = set(position.interviewers.all())
    blocks: list[InterviewTimeBlock] = []
    current_dt = start_dt

    while current_dt < end_dt:
        block_end = min(current_dt + interval, end_dt)
        available_interviewers = get_available_interviewers_for_block(all_interviewers, current_dt, block_end, unavailability)

        if available_interviewers:
            update_or_create_block(blocks, current_dt, block_end, available_interviewers)

        current_dt = block_end

    return blocks


def get_available_interviewers_for_block(all_interviewers: set, start: datetime, end: datetime, unavailability: OccupiedTimeslot) -> set:
    """
    Determines which interviewers are available for a given time block.

    Args:
        all_interviewers: Set of all interviewers.
        start: Start time of the block.
        end: End time of the block.
        unavailability: List of unavailable timeslots.

    Returns:
        Set of available interviewers for the block.
    """
    available_interviewers = all_interviewers.copy()
    for slot in unavailability:
        if slot.start_dt < end and slot.end_dt > start:
            available_interviewers.discard(slot.user)
    return available_interviewers


def update_or_create_block(blocks: list, start: datetime, end: datetime, available_interviewers: set) -> None:
    """
    Updates an existing block or creates a new one based on available interviewers.

    Args:
        blocks: List of existing blocks.
        start: Start time of the current block.
        end: End time of the current block.
        available_interviewers: Set of available interviewers for the current block.
    """
    if not blocks or len(blocks[-1]['available_interviewers']) != len(available_interviewers):
        blocks.append({'start': start, 'end': end, 'available_interviewers': available_interviewers})
    else:
        blocks[-1]['end'] = end


def get_unavailability(recruitment: Recruitment) -> OccupiedTimeslot:
    """
    Retrieves unavailable timeslots for a given recruitment.

    Args:
        recruitment: The recruitment for which unavailable timeslots are fetched.

    Returns:
        A queryset of OccupiedTimeslot objects ordered by start time.
    """
    return OccupiedTimeslot.objects.filter(recruitment=recruitment).order_by('start_dt')


def calculate_rating(start_dt: datetime, end_dt: datetime, available_interviewers_count: int) -> int:
    """
    Calculates a rating for a time block based on the number of available interviewers and block length.

    Args:
        start_dt: Start datetime of the block.
        end_dt: End datetime of the block.
        available_interviewers_count: Number of interviewers available for the block.

    Returns:
        An integer rating for the time block.
    """
    block_length = (end_dt - start_dt).total_seconds() / 3600
    rating = (available_interviewers_count * 2) + (block_length * 0.5)
    return max(0, int(rating))


def is_applicant_available(applicant: User, start_dt: datetime, end_dt: datetime, recruitment: Recruitment) -> bool:
    """
    Checks if an applicant is available for an interview during a given time range.

    Args:
        applicant: The applicant to check availability for.
        start_dt: The start datetime of the interview slot.
        end_dt: The end datetime of the interview slot.
        recruitment: The recruitment to which the applicant has applied.

    Returns:
        A boolean indicating whether the applicant is available for the given time range.
    """
    existing_interviews = Interview.objects.filter(
        applications__user=applicant, applications__recruitment=recruitment, interview_time__lt=end_dt, interview_time__gte=start_dt
    )
    return not existing_interviews.exists()
