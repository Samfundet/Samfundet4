from __future__ import annotations

from datetime import datetime, timedelta

from django.utils import timezone

from samfundet.models.general import User
from samfundet.models.recruitment import Interview, RecruitmentPosition, RecruitmentApplication
from samfundet.automatic_interview_allocation.exceptions import (
    NoFutureTimeSlotsError,
    NoTimeBlocksAvailableError,
    InsufficientTimeBlocksError,
    AllApplicantsUnavailableError,
    NoApplicationsWithoutInterviewsError,
)
from samfundet.automatic_interview_allocation.generate_interview_timeblocks import (
    FinalizedTimeBlock,
    generate_and_sort_timeblocks,
)

from .utils import (
    is_applicant_available,
    get_available_interviewers_for_timeslot,
)


def allocate_interviews_for_position(position: RecruitmentPosition) -> int:
    """
    Allocates interviews for applicants of a given recruitment position based on available time blocks.

    Args:
        position: The recruitment position for which interviews are being allocated.
        allocation_limit: If set, limits the number of interviews to allocate. If None, allocates for all applicants.

    Returns:
        The number of interviews allocated.

    Raises:
        NoTimeBlocksAvailableError: If no timeblocks are available.
        NoApplicationsWithoutInterviewsError: If no applications without interviews exist.
        AllApplicantsUnavailableError: If all applicants are unavailable for the remaining time blocks.
        NoAvailableInterviewersError: If no interviewers are available for any time slot.
        InsufficientTimeBlocksError: If there are not enough time blocks for all applications.
    """
    interview_duration = timedelta(minutes=30)  # Each interview lasts 30 minutes

    timeblocks = generate_and_sort_timeblocks(position)
    applications = get_applications_without_interview(position)
    check_timeblocks_and_applications(timeblocks, applications, position)

    interview_count = allocate_all_interviews(
        timeblocks,
        applications,
        position,
        interview_duration,
    )

    check_allocation_completeness(interview_count, applications, position)

    return interview_count


def get_applications_without_interview(position: RecruitmentPosition) -> list[RecruitmentApplication]:
    """Fetch all applications without assigned interviews."""
    return list(RecruitmentApplication.objects.filter(recruitment_position=position, withdrawn=False, interview__isnull=True))


def check_timeblocks_and_applications(timeblocks: list[FinalizedTimeBlock], applications: list[RecruitmentApplication], position: RecruitmentPosition) -> None:
    """Validate that there are available time blocks and applications."""
    if not timeblocks:
        raise NoTimeBlocksAvailableError(f'No available time blocks for position: {position.name_en}')
    if not applications:
        raise NoApplicationsWithoutInterviewsError(f'No applications without interviews for position: {position.name_en}')


def allocate_all_interviews(
    timeblocks: list[FinalizedTimeBlock],
    applications: list[RecruitmentApplication],
    position: RecruitmentPosition,
    interview_duration: timedelta,
) -> int:
    """Allocate interviews within available future time blocks."""
    interview_count = 0
    current_time = timezone.now() + timedelta(hours=24)  # Only consider time slots 24 hours or more in the future

    future_blocks = [block for block in timeblocks if block['end'] > current_time]
    if not future_blocks:
        raise NoFutureTimeSlotsError(f'No time slots available at least 24 hours in the future for position: {position.name_en}')

    for block in future_blocks:
        block_interview_count = place_interviews_in_block(block, applications, position, interview_duration, current_time)
        interview_count += block_interview_count

    return interview_count


def place_interviews_in_block(
    block: FinalizedTimeBlock,
    applications: list[RecruitmentApplication],
    position: RecruitmentPosition,
    interview_duration: timedelta,
    current_time: datetime,
) -> int:
    """Allocate interviews within a single time block."""
    block_interview_count = 0
    block_start = max(block['start'], current_time)
    current_time = block_start

    while current_time + interview_duration <= block['end'] and applications:
        application = applications[0]  # Get the next application to process
        if allocate_interview(current_time, block, application, position, interview_duration):
            applications.pop(0)  # Remove the application that was just allocated an interview
            block_interview_count += 1
        current_time += interview_duration

    return block_interview_count


def allocate_interview(
    current_time: datetime,
    block: FinalizedTimeBlock,
    application: RecruitmentApplication,
    position: RecruitmentPosition,
    interview_duration: timedelta,
) -> bool:
    """Attempt to allocate a single interview at the current time."""
    interview_end_time = current_time + interview_duration

    # Check for existing interviews
    if Interview.objects.filter(applications__recruitment_position__recruitment=position.recruitment, interview_time=current_time).exists():
        return False

    available_interviewers = get_available_interviewers_for_timeslot(
        list(block['available_interviewers']), current_time, interview_end_time, position.recruitment
    )

    if not available_interviewers:
        return False

    if is_applicant_available(application.user, current_time, interview_end_time, position.recruitment):
        create_interview(application, current_time, position, available_interviewers)
        return True

    return False


def create_interview(application: RecruitmentApplication, interview_time: datetime, position: RecruitmentPosition, available_interviewers: list[User]) -> None:
    """Create and save an interview for the given application."""
    interview = Interview.objects.create(
        interview_time=interview_time,
        interview_location=f'Location for {position.name_en}',
        room=None,
    )
    interview.interviewers.set(available_interviewers)
    interview.save()
    application.interview = interview  # Assign the interview to the application
    application.save()


def check_allocation_completeness(interview_count: int, applications: list[RecruitmentApplication], position: RecruitmentPosition) -> None:
    """Handle the results of the interview allocation process."""
    if interview_count == 0:
        raise AllApplicantsUnavailableError(f'All applicants are unavailable for the remaining time slots for position: {position.name_en}')
    if applications:
        raise InsufficientTimeBlocksError(
            f'Not enough time blocks to accommodate all applications for position: {position.name_en}. Allocated {interview_count} interviews.'
        )