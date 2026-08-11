from __future__ import annotations

from typing import Any

from django.db import models
from django.core.validators import RegexValidator

from root.constants import PHONE_NUMBER_REGEX


class LowerCaseField(models.CharField):
    def to_python(self, value: str) -> str:
        return super().to_python(value.lower())


class LowerCaseSlugField(models.SlugField):
    """Slug which is always stored in lowercase, and which is looked up case insensitively."""

    def to_python(self, value: Any) -> Any:
        value = super().to_python(value)
        return value.lower() if isinstance(value, str) else value

    def get_prep_value(self, value: Any) -> Any:
        """Lowercases anything on its way into a query"""
        value = super().get_prep_value(value)
        return value.lower() if isinstance(value, str) else value


class PhoneNumberField(models.CharField):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        kwargs['max_length'] = 15
        self.validators = [
            RegexValidator(
                regex=PHONE_NUMBER_REGEX,
                message='Enter a valid phonenumber',
            ),
        ]
        super().__init__(*args, **kwargs)
