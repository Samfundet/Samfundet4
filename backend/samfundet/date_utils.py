from __future__ import annotations

from datetime import date, datetime, timedelta


def samfundet_date(dt: datetime) -> date:
    """
    Returns logical date for Samfundet.
    A date between 00:00-04:00 belongs to previous day.
    """
    return (dt - timedelta(hours=4)).date()
