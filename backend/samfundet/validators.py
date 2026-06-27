from __future__ import annotations

from datetime import date

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

# Allowed age range for a user's date of birth.
MIN_AGE = 18
MAX_AGE = 110


def validate_date_of_birth(value: date) -> None:
    """
    Sanity check a date of birth: the value must be between MIN_AGE and MAX_AGE years.

    Raises django.core.exceptions.ValidationError, which DRF surfaces as a field error.
    """
    today = date.today()
    age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))

    if age < MIN_AGE:
        raise ValidationError(_('You must be at least %(min_age)d years old.') % {'min_age': MIN_AGE})
    if age > MAX_AGE:
        raise ValidationError(_('Age cannot be above %(max_age)d years.') % {'max_age': MAX_AGE})
