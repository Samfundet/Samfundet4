from datetime import datetime, timedelta

import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone

from samfundet.models.general import Booking, Organization
from samfundet.models.recruitment import Recruitment


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


@pytest.mark.django_db
def test_recruitment_time_constraints(fixture_recruitment: Recruitment):
    now = timezone.now()
    one_hour = timedelta(hours=1)

    # Change actual_application_deadline to the past, should fail.
    fixture_recruitment.actual_application_deadline = now - one_hour
    expected_msg = 'All times should be in the future'
    with pytest.raises(ValidationError, match=expected_msg):
        fixture_recruitment.clean()

    # Reset actual_application_deadline and change visible_from to be after actual_application_deadline, should fail.
    fixture_recruitment.actual_application_deadline = now + 3 * one_hour
    fixture_recruitment.visible_from = now + 4 * one_hour
    expected_msg = 'Application deadline should be after visible from'
    with pytest.raises(ValidationError, match=expected_msg):
        fixture_recruitment.clean()

    # Reset visible_from and change shown_application_deadline to be after actual_application_deadline, should fail.
    fixture_recruitment.visible_from = now
    fixture_recruitment.shown_application_deadline = now + 4 * one_hour
    expected_msg = 'Shown application deadline should be before the actual application deadline'
    with pytest.raises(ValidationError, match=expected_msg):
        fixture_recruitment.clean()
