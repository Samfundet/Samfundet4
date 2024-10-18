from __future__ import annotations

from typing import Any
from datetime import time, datetime, timedelta
from collections import defaultdict

from django.utils import timezone

from samfundet.models.general import User

from samfundet.exceptions import (
    NoFutureTimeSlotsError,
    NoTimeBlocksAvailableError,
    InsufficientTimeBlocksError,
    NoAvailableInterviewersError,
    AllApplicantsUnavailableError,
    NoApplicationsWithoutInterviewsError,
)
from samfundet.models.recruitment import (
    Interview,
    Recruitment,
    OccupiedTimeslot,
    RecruitmentPosition,
    RecruitmentApplication,
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


def generate_interview_timeblocks(position: RecruitmentPosition) -> list:
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
    all_blocks = []

    # Determin the time range: current data, start and end dates for interview slots
    current_date = timezone.now().date()
    start_date = max(recruitment.visible_from.date(), current_date)
    end_date = recruitment.actual_application_deadline.date()
    start_time = time(8, 0)  # Interviews start at 8:00
    end_time = time(23, 0)  # Interviews end at 23:00
    interval = timedelta(minutes=30)  # Each time block is 30 minutes

    # Loop through each day in the range to generate time blocks
    current_date = start_date
    while current_date <= end_date:
        # Create datetime objects for the start and end of the day
        current_datetime = timezone.make_aware(datetime.combine(current_date, start_time))
        end_datetime = timezone.make_aware(datetime.combine(current_date, end_time))

        # Fetch unavailability slots and generate blocks for the current day
        unavailability = get_unavailability(recruitment)
        blocks = generate_blocks(position, current_datetime, end_datetime, unavailability, interval)

        # Add the generated blocks to the list, calculating ratings for each block
        all_blocks.extend(
            [
                {
                    'recruitment_position': position,
                    'date': current_date,
                    'start_dt': block['start'],
                    'end_dt': block['end'],
                    'rating': calculate_rating(block['start'], block['end'], len(block['available_interviewers'])),
                    'available_interviewers': list(block['available_interviewers']),
                }
                for block in blocks
            ]
        )

        current_date += timedelta(days=1)  # Move to the next day

    return all_blocks


def generate_blocks(position: RecruitmentPosition, start_dt: datetime, end_dt: datetime, unavailability: OccupiedTimeslot, interval: timedelta) -> list:
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
    all_interviewers = set(position.interviewers.all())  # Get all interviewers for the position
    blocks: list = []
    current_dt = start_dt
    # Iterate through the day in intervals
    while current_dt < end_dt:
        block_end = min(current_dt + interval, end_dt)  # End time for the current block
        available_interviewers = all_interviewers.copy()  # Start with all interviewers available

        # Remove unavailable interviewers based on the unavailability times
        for slot in unavailability:
            if slot.start_dt < block_end and slot.end_dt > current_dt:
                available_interviewers.discard(slot.user)

        # Only add blocks if there are available interviewers
        if available_interviewers:
            # If the number of available interviewers changes, create a new block
            if not blocks or len(blocks[-1]['available_interviewers']) != len(available_interviewers):
                blocks.append({'start': current_dt, 'end': block_end, 'available_interviewers': available_interviewers})
            else:
                blocks[-1]['end'] = block_end  # Extend the last block if interviewer count remains same

        current_dt = block_end  # Move to the next block

    return blocks


def allocate_interviews_for_position(position, limit_to_first_applicant=False) -> int:
    """
    Allocates interviews for applicants of a given recruitment position based on available time blocks.

    Args:
        position: The recruitment position for which interviews are being allocated.
        limit_to_first_applicant: If True, the function will return after assigning an interview
                                  to the first available applicant.

    Returns:
        The number of interviews allocated.

    Raises:
        NoTimeBlocksAvailableError: If no time blocks are available.
        NoApplicationsWithoutInterviewsError: If no applications without interviews exist.
        AllApplicantsUnavailableError: If all applicants are unavailable for the remaining time blocks.
        NoAvailableInterviewersError: If no interviewers are available for any time slot.
        InsufficientTimeBlocksError: If there are not enough time blocks for all applications.
    """
    interview_duration = timedelta(minutes=30)  # Each interview lasts 30 minutes

    # Generate and sort time blocks by rating (higher rating first)
    timeblocks = generate_interview_timeblocks(position)
    timeblocks.sort(key=lambda block: (-block['rating'], block['start_dt']))

    if not timeblocks:
        raise NoTimeBlocksAvailableError(f'No available time blocks for position: {position.name_en}')

    # Fetch all applications without assigned interviews
    applications = list(RecruitmentApplication.objects.filter(recruitment_position=position, withdrawn=False, interview__isnull=True))
    if not applications:
        raise NoApplicationsWithoutInterviewsError(f'No applications without interviews for position: {position.name_en}')

    interviewer_unavailability = defaultdict(list)

    # Get all existing interviews and mark interviewer unavailability
    existing_interviews = Interview.objects.filter(applications__recruitment_position__recruitment=position.recruitment)
    for interview in existing_interviews:
        for interviewer in interview.interviewers.all():
            interviewer_unavailability[interviewer.id].append((interview.interview_time, interview.interview_time + interview_duration))

    interview_count = 0
    all_applicants_unavailable = True
    current_time = timezone.now() + timedelta(hours=24)  # Only consider time slots 24 hours or more in the future

    future_blocks = [block for block in timeblocks if block['end_dt'] > current_time]
    if not future_blocks:
        raise NoFutureTimeSlotsError(f'No time slots available at least 24 hours in the future for position: {position.name_en}')

    # Allocate interviews within available future time blocks
    for block in future_blocks:
        block_start = max(block['start_dt'], current_time)  # Ensure the block start is at least the current time
        current_time = block_start

        # Allocate interviews within the block's time range
        while current_time + interview_duration <= block['end_dt'] and applications:
            interview_end_time = current_time + interview_duration

            # Skip the block if there's an existing interview at the current time
            if any(interview.interview_time == current_time for interview in existing_interviews):
                current_time += interview_duration
                continue

            available_interviewers = get_available_interviewers(block['available_interviewers'], current_time, interview_end_time, interviewer_unavailability)

            # If there are no available interviewers, move to the next time block
            if not available_interviewers:
                current_time += interview_duration
                continue

            # Try to assign interviews to applicants
            for application in applications[:]:
                applicant = application.user

                if is_applicant_available(applicant, current_time, interview_end_time, position.recruitment):
                    all_applicants_unavailable = False
                    interview = Interview.objects.create(
                        interview_time=current_time,
                        interview_location=f'Location for {position.name_en}',
                        room=None,
                    )
                    interview.interviewers.set(available_interviewers)
                    interview.save()

                    application.interview = interview  # Assign the interview to the application
                    application.save()

                    # Mark the interviewers as unavailable for this time slot
                    mark_interviewers_unavailable(available_interviewers, current_time, interview_end_time, interviewer_unavailability)

                    existing_interviews = list(existing_interviews) + [interview]

                    interview_count += 1
                    applications.remove(application)  # Remove the assigned applicant from the list

                    # If we're only allocating to the first applicant, return early
                    if limit_to_first_applicant:
                        return interview_count

                    break  # Move to the next time block

            current_time += interview_duration

        # If all applications have been processed, stop early
        if not applications:
            break

    # Raise errors based on the results of the allocation
    if interview_count == 0:
        if all_applicants_unavailable:
            raise AllApplicantsUnavailableError(f'All applicants are unavailable for the remaining time slots for position: {position.name_en}')
        raise NoAvailableInterviewersError(f'No available interviewers for any time slot for position: {position.name_en}')

    if applications:
        raise InsufficientTimeBlocksError(
            f'Not enough time blocks to accommodate all applications for position: {position.name_en}. Allocated {interview_count} interviews.'
        )

    return interview_count


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


def get_available_interviewers(interviewers: list[User], start_dt: datetime, end_dt: datetime, interviewer_unavailability: defaultdict[Any, list]) -> list:
    """
    Filters interviewers who are available for a specific time slot.

    Args:
        interviewers: List of interviewers to check availability for.
        start_dt: The start datetime of the interview slot.
        end_dt: The end datetime of the interview slot.
        interviewer_unavailability: Dictionary of interviewers and their unavailable time slots.

    Returns:
        A list of available interviewers.
    """
    return [interviewer for interviewer in interviewers if is_interviewer_available(interviewer, start_dt, end_dt, interviewer_unavailability)]


def is_interviewer_available(interviewer: User, start_dt: datetime, end_dt: datetime, unavailability: defaultdict[Any, list]) -> bool:
    """
    Checks if a specific interviewer is available during a given time range.

    Args:
        interviewer: The interviewer to check.
        start_dt: The start datetime of the interview slot.
        end_dt: The end datetime of the interview slot.
        unavailability: List of unavailable time slots for the interviewer.

    Returns:
        A boolean indicating whether the interviewer is available for the given time range.
    """
    return all(
        not (unavail_start < end_dt and unavail_end > start_dt) for unavail_start, unavail_end in unavailability.get(interviewer.id, [])
    )  # Return True if the interviewer is available


def mark_interviewers_unavailable(interviewers: list[Any], start_dt: datetime, end_dt: datetime, unavailability: defaultdict[Any, list]) -> None:
    """
    Marks a group of interviewers as unavailable during a given time range.

    Args:
        interviewers: List of interviewers to mark as unavailable.
        start_dt: The start datetime of the interview slot.
        end_dt: The end datetime of the interview slot.
        unavailability: Dictionary to store the unavailable times for each interviewer.
    """
    for interviewer in interviewers:
        unavailability[interviewer.id].append((start_dt, end_dt))
