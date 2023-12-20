from datetime import datetime, timedelta

import pytest
from datetime import date
from django.core.exceptions import ValidationError

from samfundet.models.general import Booking, Table, Venue, Reservation


@pytest.mark.django_db
def test_booking_duration_constraint_less_than_2_hours():
    from_dt = datetime(hour=20, day=2, month=12, year=2022)
    one_hour = timedelta(hours=1)
    three_hours = timedelta(hours=3)

    # Less than 2 hours should work.
    booking = Booking.objects.create(from_dt=from_dt, to_dt=from_dt + one_hour)
    assert booking.id  # Check if model was saved and received id.

    # Change to three hours, should fail.
    booking.to_dt = from_dt + three_hours
    expected_msg = 'Duration cannot be longer than 2 hours.'
    with pytest.raises(ValidationError, match=expected_msg):
        booking.save()
