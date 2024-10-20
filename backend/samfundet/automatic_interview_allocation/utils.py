from __future__ import annotations

from datetime import datetime

from samfundet.models.general import User

UserIdType = int
TimeSlotType = tuple[datetime, datetime]

UnavailabilityTypeDict = dict[UserIdType, list[TimeSlotType]]


def get_available_interviewers_for_timeslot(
    interviewers: list[User], start_dt: datetime, end_dt: datetime, interviewer_unavailability: UnavailabilityTypeDict
) -> list[User]:
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


def is_interviewer_available(interviewer: User, start_dt: datetime, end_dt: datetime, unavailability: UnavailabilityTypeDict) -> bool:
    """
    Checks if a specific interviewer is available during a given time range.
    Args:
        interviewer: The interviewer to check.
        start_dt: The start datetime of the interview slot.
        end_dt: The end datetime of the interview slot.
        unavailability: Dictionary of unavailable time slots for interviewers.
    Returns:
        A boolean indicating whether the interviewer is available for the given time range.
    """
    return all(not (unavail_start < end_dt and unavail_end > start_dt) for unavail_start, unavail_end in unavailability.get(interviewer.id, []))


def mark_interviewers_unavailable(interviewers: list[User], start_dt: datetime, end_dt: datetime, unavailability: UnavailabilityTypeDict) -> None:
    """
    Marks a group of interviewers as unavailable during a given time range.
    Args:
        interviewers: List of interviewers to mark as unavailable.
        start_dt: The start datetime of the interview slot.
        end_dt: The end datetime of the interview slot.
        unavailability: Dictionary to store the unavailable times for each interviewer.
    """
    for interviewer in interviewers:
        if interviewer.id not in unavailability:
            unavailability[interviewer.id] = []
        unavailability[interviewer.id].append((start_dt, end_dt))
