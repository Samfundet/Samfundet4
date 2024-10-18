from __future__ import annotations

from typing import Any
from datetime import datetime
from collections import defaultdict

from samfundet.models.general import User


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
