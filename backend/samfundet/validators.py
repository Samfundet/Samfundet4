from __future__ import annotations

from datetime import date
from urllib.parse import urlsplit

from django.urls import Resolver404, resolve
from django.utils.http import url_has_allowed_host_and_scheme
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.utils.translation import gettext_lazy as _

# Allowed age range for a user's date of birth.
MIN_AGE = 18
MAX_AGE = 110

HTTP_URL_VALIDATOR = URLValidator(schemes=['http', 'https'])


def _is_known_frontend_path(value: str) -> bool:
    path = urlsplit(value).path

    try:
        match = resolve(path, urlconf='samfundet.routing.urls')
    except Resolver404:
        return False

    # The frontend URLconf ends with an unnamed catch-all for its 404 page.
    return match.url_name is not None


def validate_site_banner_url(value: str) -> None:
    value = value.strip()

    if not value:
        return

    is_safe_internal_path = value.startswith('/') and url_has_allowed_host_and_scheme(value, allowed_hosts=set())
    if is_safe_internal_path:
        if not _is_known_frontend_path(value):
            raise ValidationError(_('Enter a path to an existing page.'))
        return

    try:
        HTTP_URL_VALIDATOR(value)
    except ValidationError as error:
        raise ValidationError(_('Enter an internal path or a valid HTTP(S) URL.')) from error


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
