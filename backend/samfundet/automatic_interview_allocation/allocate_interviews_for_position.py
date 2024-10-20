from __future__ import annotations

from datetime import datetime, timedelta
from collections import defaultdict

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
from samfundet.automatic_interview_allocation.generate_position_interview_schedule import (
    FinalizedTimeBlock,
    is_applicant_available,
    create_final_interview_blocks,
)

from .utils import (
    mark_interviewers_unavailable,
    get_available_interviewers_for_timeslot,
)


def allocate_interviews_for_position(position: RecruitmentPosition, *, allocation_limit: int | None = None) -> int:
    """
    Allocates interviews for applicants of a given recruitment position based on available time blocks.

    Args:
        position: The recruitment position for which interviews are being allocated.
        allocation_limit: If set, limits the number of interviews to allocate. If None, allocates for all applicants.

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

    timeblocks = generate_and_sort_timeblocks(position)
    applications = get_applications_without_interviews(position)
    interviewer_unavailability = create_interviewer_unavailability_map(position)

    check_timeblocks_and_applications_availability(timeblocks, applications, position)

    interview_count = allocate_interviews(timeblocks, applications, interviewer_unavailability, position, interview_duration, allocation_limit)

    check_allocation_completeness(interview_count, applications, position)

    return interview_count


def generate_and_sort_timeblocks(position: RecruitmentPosition) -> list[FinalizedTimeBlock]:
    """Generate and sort time blocks by rating (higher rating first)."""
    timeblocks = create_final_interview_blocks(position)
    timeblocks.sort(key=lambda block: (-block['rating'], block['start']))
    return timeblocks


def get_applications_without_interviews(position: RecruitmentPosition) -> list[RecruitmentApplication]:
    """Fetch all applications without assigned interviews."""
    return list(RecruitmentApplication.objects.filter(recruitment_position=position, withdrawn=False, interview__isnull=True))


def create_interviewer_unavailability_map(position: RecruitmentPosition) -> defaultdict[int, list[tuple[datetime, datetime]]]:
    """Get all existing interviews and mark interviewer unavailability."""
    interviewer_unavailability = defaultdict(list)
    existing_interviews = Interview.objects.filter(applications__recruitment_position__recruitment=position.recruitment)
    for interview in existing_interviews:
        for interviewer in interview.interviewers.all():
            interviewer_unavailability[interviewer.id].append((interview.interview_time, interview.interview_time + timedelta(minutes=30)))
    return interviewer_unavailability


def check_timeblocks_and_applications_availability(
    timeblocks: list[FinalizedTimeBlock], applications: list[RecruitmentApplication], position: RecruitmentPosition
) -> None:
    """Validate that there are available time blocks and applications."""
    if not timeblocks:
        raise NoTimeBlocksAvailableError(f'No available time blocks for position: {position.name_en}')
    if not applications:
        raise NoApplicationsWithoutInterviewsError(f'No applications without interviews for position: {position.name_en}')


def allocate_interviews(
    timeblocks: list[FinalizedTimeBlock],
    applications: list[RecruitmentApplication],
    interviewer_unavailability: defaultdict[int, list[tuple[datetime, datetime]]],
    position: RecruitmentPosition,
    interview_duration: timedelta,
    allocation_limit: int | None,
) -> int:
    """Allocate interviews within available future time blocks."""
    interview_count = 0
    current_time = timezone.now() + timedelta(hours=24)  # Only consider time slots 24 hours or more in the future

    future_blocks = [block for block in timeblocks if block['end'] > current_time]
    if not future_blocks:
        raise NoFutureTimeSlotsError(f'No time slots available at least 24 hours in the future for position: {position.name_en}')

    for block in future_blocks:
        block_interview_count = allocate_interviews_in_block(block, applications, interviewer_unavailability, position, interview_duration, current_time)
        interview_count += block_interview_count

        if allocation_limit is not None and interview_count >= allocation_limit:
            # If we've reached or exceeded the allocation limit, stop allocating
            interview_count = min(interview_count, allocation_limit)
            break

        if not applications:
            break

    return interview_count


def allocate_interviews_in_block(
    block: FinalizedTimeBlock,
    applications: list[RecruitmentApplication],
    interviewer_unavailability: defaultdict[int, list[tuple[datetime, datetime]]],
    position: RecruitmentPosition,
    interview_duration: timedelta,
    current_time: datetime,
) -> int:
    """Allocate interviews within a single time block."""
    block_interview_count = 0
    block_start = max(block['start'], current_time)
    current_time = block_start

    while current_time + interview_duration <= block['end'] and applications:
        if allocate_single_interview(current_time, block, applications, interviewer_unavailability, position, interview_duration):
            block_interview_count += 1
        current_time += interview_duration

    return block_interview_count


def allocate_single_interview(
    current_time: datetime,
    block: FinalizedTimeBlock,
    applications: list[RecruitmentApplication],
    interviewer_unavailability: defaultdict[int, list[tuple[datetime, datetime]]],
    position: RecruitmentPosition,
    interview_duration: timedelta,
) -> bool:
    """Attempt to allocate a single interview at the current time."""
    interview_end_time = current_time + interview_duration
    # Skip the block if there's an existing interview at the current time
    if any(
        interview.interview_time == current_time for interview in Interview.objects.filter(applications__recruitment_position__recruitment=position.recruitment)
    ):
        return False

    # Explicitly convert to list
    available_interviewers = get_available_interviewers_for_timeslot(
        list(block.get('available_interviewers', [])), current_time, interview_end_time, interviewer_unavailability
    )

    # If there are no available interviewers, move to the next time block
    if not available_interviewers:
        return False
    # Try to assign interviews to applicants
    for application in applications[:]:
        applicant = application.user
        if is_applicant_available(applicant, current_time, interview_end_time, position.recruitment):
            create_interview(application, current_time, position, available_interviewers)
            mark_interviewers_unavailable(available_interviewers, current_time, interview_end_time, interviewer_unavailability)
            applications.remove(application)  # Remove the assigned applicant from the list
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
