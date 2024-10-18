from __future__ import annotations

from datetime import timezone, timedelta
from collections import defaultdict

from samfundet.models.recruitment import Interview, RecruitmentApplication
from samfundet.automatic_interview_allocation.exceptions import (
    NoFutureTimeSlotsError,
    NoTimeBlocksAvailableError,
    InsufficientTimeBlocksError,
    AllApplicantsUnavailableError,
    NoApplicationsWithoutInterviewsError,
)
from samfundet.automatic_interview_allocation.generate_position_interview_schedule import (
    is_applicant_available,
    create_daily_interview_blocks,
)

from .utils import (
    get_available_interviewers,
    mark_interviewers_unavailable,
)


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
    timeblocks = get_sorted_timeblocks(position)

    # Fetch all applications without assigned interviews
    applications = get_applications_without_interviews(position)

    interviewer_unavailability = get_interviewer_unavailability(position)

    validate_allocation_prerequisites(timeblocks, applications, position)

    interview_count = allocate_interviews(timeblocks, applications, interviewer_unavailability, position, interview_duration, limit_to_first_applicant)

    handle_allocation_results(interview_count, applications, position)

    return interview_count


def get_sorted_timeblocks(position):
    """Generate and sort time blocks by rating (higher rating first)."""
    timeblocks = create_daily_interview_blocks(position)
    timeblocks.sort(key=lambda block: (-block['rating'], block['start']))
    return timeblocks


def get_applications_without_interviews(position):
    """Fetch all applications without assigned interviews."""
    return list(RecruitmentApplication.objects.filter(recruitment_position=position, withdrawn=False, interview__isnull=True))


def get_interviewer_unavailability(position):
    """Get all existing interviews and mark interviewer unavailability."""
    interviewer_unavailability = defaultdict(list)
    existing_interviews = Interview.objects.filter(applications__recruitment_position__recruitment=position.recruitment)
    for interview in existing_interviews:
        for interviewer in interview.interviewers.all():
            interviewer_unavailability[interviewer.id].append((interview.interview_time, interview.interview_time + timedelta(minutes=30)))
    return interviewer_unavailability


def validate_allocation_prerequisites(timeblocks, applications, position):
    """Validate that there are available time blocks and applications."""
    if not timeblocks:
        raise NoTimeBlocksAvailableError(f'No available time blocks for position: {position.name_en}')
    if not applications:
        raise NoApplicationsWithoutInterviewsError(f'No applications without interviews for position: {position.name_en}')


def allocate_interviews(timeblocks, applications, interviewer_unavailability, position, interview_duration, limit_to_first_applicant):
    """Allocate interviews within available future time blocks."""
    interview_count = 0
    current_time = timezone.now() + timedelta(hours=24)  # Only consider time slots 24 hours or more in the future

    future_blocks = [block for block in timeblocks if block['end'] > current_time]
    if not future_blocks:
        raise NoFutureTimeSlotsError(f'No time slots available at least 24 hours in the future for position: {position.name_en}')

    for block in future_blocks:
        interview_count += allocate_interviews_in_block(
            block, applications, interviewer_unavailability, position, interview_duration, current_time, limit_to_first_applicant
        )
        if limit_to_first_applicant and interview_count > 0:
            break
        if not applications:
            break

    return interview_count


def allocate_interviews_in_block(block, applications, interviewer_unavailability, position, interview_duration, current_time, limit_to_first_applicant):
    """Allocate interviews within a single time block."""
    block_interview_count = 0
    block_start = max(block['start'], current_time)
    current_time = block_start

    while current_time + interview_duration <= block['end'] and applications:
        if allocate_single_interview(current_time, block, applications, interviewer_unavailability, position, interview_duration):
            block_interview_count += 1
            if limit_to_first_applicant:
                return block_interview_count
        current_time += interview_duration

    return block_interview_count


def allocate_single_interview(current_time, block, applications, interviewer_unavailability, position, interview_duration):
    """Attempt to allocate a single interview at the current time."""
    interview_end_time = current_time + interview_duration

    # Skip the block if there's an existing interview at the current time
    if any(
        interview.interview_time == current_time for interview in Interview.objects.filter(applications__recruitment_position__recruitment=position.recruitment)
    ):
        return False

    available_interviewers = get_available_interviewers(block['available_interviewers'], current_time, interview_end_time, interviewer_unavailability)

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


def create_interview(application, interview_time, position, available_interviewers):
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


def handle_allocation_results(interview_count, applications, position):
    """Handle the results of the interview allocation process."""
    if interview_count == 0:
        raise AllApplicantsUnavailableError(f'All applicants are unavailable for the remaining time slots for position: {position.name_en}')
    if applications:
        raise InsufficientTimeBlocksError(
            f'Not enough time blocks to accommodate all applications for position: {position.name_en}. Allocated {interview_count} interviews.'
        )
