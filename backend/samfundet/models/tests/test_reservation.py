from datetime import date
from samfundet.models.general import Table, Reservation, Venue


class TestReservation:

    def test_check_fetches_times(
        self,
        fixture_venue: Venue,
        fixture_date_tuesday: date,
        fixture_table: Table,
    ):
        full_date = Reservation.fetch_available_times_for_date(venue=fixture_venue.id, date=fixture_date_tuesday, seating=3)
        assert len(full_date) > 0
        assert fixture_venue.opening_tuesday.strftime('%H:%M') in full_date  # Should contain start time
        assert fixture_venue.closing_tuesday.strftime('%H:%M') not in full_date  # should not contain endtime

    def test_check_too_high_seating(
        self,
        fixture_venue: Venue,
        fixture_date_monday: date,
        fixture_table: Table,
    ):
        full_date = Reservation.fetch_available_times_for_date(venue=fixture_venue.id, date=fixture_date_monday, seating=100)
        assert len(full_date) == 0

    def test_check_filter_out_hours(
        self,
        fixture_reservation: Reservation,
        fixture_venue: Venue,
        fixture_date_monday: date,
        fixture_date_tuesday: date,
        fixture_table: Table,
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
