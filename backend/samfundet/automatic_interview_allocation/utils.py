from __future__ import annotations

from datetime import datetime
from collections import defaultdict

from django.db.models import Q, QuerySet

from samfundet.models.general import User, GangSection
from samfundet.models.recruitment import Interview, Recruitment, OccupiedTimeslot, RecruitmentPosition

UserIdType = int
TimeSlotType = tuple[datetime, datetime]

UnavailabilityTypeDict = dict[UserIdType, list[TimeSlotType]]


def get_available_interviewers_for_timeslot(interviewers: list[User], start_dt: datetime, end_dt: datetime, recruitment: Recruitment) -> list[User]:
    """
    Filters interviewers who are available for a specific time slot.
    Args:
        interviewers: List of interviewers to check availability for.
        start_dt: The start datetime of the interview slot.
        end_dt: The end datetime of the interview slot.
        recruitment: The recruitment for which to check availability.
    Returns:
        A list of available interviewers.
    """
    unavailable_interviewer_ids = (
        OccupiedTimeslot.objects.filter(user__in=interviewers, recruitment=recruitment)
        .filter(
            Q(start_dt__lt=end_dt, end_dt__gt=start_dt)  # Overlaps with the start
            | Q(start_dt__lt=end_dt, end_dt__gt=end_dt)  # Overlaps with the end
            | Q(start_dt__gte=start_dt, end_dt__lte=end_dt)  # Fully within the interval
        )
        .values_list('id', flat=True)
    )

    return [interviewer for interviewer in interviewers if interviewer.id not in unavailable_interviewer_ids]


# def is_interviewer_available(interviewer: User, start_dt: datetime, end_dt: datetime, recruitment: Recruitment) -> bool:
#     """
#     Checks if a specific interviewer is available during a given time range.
#     Args:
#         interviewer: The interviewer to check.
#         start_dt: The start datetime of the interview slot.
#         end_dt: The end datetime of the interview slot.
#         recruitment: The recruitment for which to check availability.
#     Returns:
#         A boolean indicating whether the interviewer is available for the given time range.
#     """
#     interviewer_unavailable = (
#         OccupiedTimeslot.objects.filter(user=interviewer, recruitment=recruitment)
#         .filter(
#             Q(start_dt__lt=end_dt, end_dt__gt=start_dt)  # Overlaps with the start
#             | Q(start_dt__lt=end_dt, end_dt__gt=end_dt)  # Overlaps with the end
#             | Q(start_dt__gte=start_dt, end_dt__lte=end_dt)  # Fully within the interval
#         )
#         .exists()
#     )

#     return not interviewer_unavailable


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
    # Check for existing interviews
    existing_interview = Interview.objects.filter(
        applications__user=applicant, applications__recruitment=recruitment, interview_time__lt=end_dt, interview_time__gte=start_dt
    ).exists()

    if existing_interview:
        return False

    # Check applicant's unavailability
    applicant_unavailable = (
        OccupiedTimeslot.objects.filter(user=applicant, recruitment=recruitment)
        .filter(
            Q(start_dt__lt=end_dt, end_dt__gt=start_dt)  # Overlaps with the start
            | Q(start_dt__lt=end_dt, end_dt__gt=end_dt)  # Overlaps with the end
            | Q(start_dt__gte=start_dt, end_dt__lte=end_dt)  # Fully within the interval
        )
        .exists()
    )

    return not applicant_unavailable


# def mark_interviewers_unavailable(interviewers: list[User], start_dt: datetime, end_dt: datetime, unavailability: UnavailabilityTypeDict) -> None:
#     """
#     Marks a group of interviewers as unavailable during a given time range.
#     Args:
#         interviewers: List of interviewers to mark as unavailable.
#         start_dt: The start datetime of the interview slot.
#         end_dt: The end datetime of the interview slot.
#         unavailability: Dictionary to store the unavailable times for each interviewer.
#     """
#     for interviewer in interviewers:
#         if interviewer.id not in unavailability:
#             unavailability[interviewer.id] = []
#         unavailability[interviewer.id].append((start_dt, end_dt))


def get_interviewers_grouped_by_section(recruitment_position: RecruitmentPosition) -> dict[GangSection, QuerySet[User]]:
    interviewers_by_section = defaultdict(set)

    positions = recruitment_position.shared_interview_group.positions.all() if recruitment_position.shared_interview_group else [recruitment_position]

    for position in positions:
        if position.section:
            interviewers_by_section[position.section].update(position.interviewers.all())

    return {section: User.objects.filter(id__in=[u.id for u in interviewers]) for section, interviewers in interviewers_by_section.items()}
