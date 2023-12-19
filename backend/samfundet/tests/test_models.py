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


class TestReservation:

    def test_check_works(
        self,
        fixture_venue: Venue,
        fixture_date_tuesday: date,
    ):
        full_date = Reservation.fetch_available_times_for_date(venue=fixture_venue.id, date=fixture_date_tuesday, seating=3)
        assert len(full_date) > 0

    def test_check_empty(self, fixture_venue: Venue, fixture_date_monday: date):
        full_date = Reservation.fetch_available_times_for_date(venue=fixture_venue.id, date=fixture_date_monday, seating=100)
        assert len(full_date) == 0

    def test_check_filter_out_hours(
        self,
        fixture_reservation: Reservation,
        fixture_venue: Venue,
        fixture_date_monday: date,
        fixture_date_tuesday: date,
    ):
        full_date = Reservation.fetch_available_times_for_date(venue=fixture_venue.id, date=fixture_date_tuesday, seating=3)
        occupied_date = Reservation.fetch_available_times_for_date(venue=fixture_venue.id, date=fixture_date_monday, seating=3)

        assert len(full_date) > len(occupied_date)

        # check if it has removed removed a value that it should
        assert fixture_reservation.start_time.strftime('%H:%M') not in occupied_date
        assert fixture_reservation.start_time.strftime('%H:%M') in full_date

        # check if it has not removed a value that should not
        assert fixture_venue.opening_monday.strftime('%H:%M') in occupied_date
        assert fixture_venue.opening_monday.strftime('%H:%M') in full_date
