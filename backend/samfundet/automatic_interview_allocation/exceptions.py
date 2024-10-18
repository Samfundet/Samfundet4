from __future__ import annotations


class InterviewAllocationError(Exception):
    """Base exception for interview allocation errors."""

    pass


class NoTimeBlocksAvailableError(InterviewAllocationError):
    """Raised when there are no available time blocks for interviews."""

    pass


class NoApplicationsWithoutInterviewsError(InterviewAllocationError):
    """Raised when there are no applications without interviews."""

    pass


class NoAvailableInterviewersError(InterviewAllocationError):
    """Raised when there are no available interviewers for a given time slot."""

    pass


class AllApplicantsUnavailableError(InterviewAllocationError):
    """Raised when all applicants are unavailable for the remaining time slots."""

    pass


class InsufficientTimeBlocksError(InterviewAllocationError):
    """Raised when there are not enough time blocks to accommodate all applications."""

    pass


class NoFutureTimeSlotsError(InterviewAllocationError):
    """Raised when there are no time slots available at least 24 hours in the future."""

    pass
