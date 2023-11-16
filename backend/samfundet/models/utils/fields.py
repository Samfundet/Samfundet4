from django.db import models
from django.core.validators import RegexValidator
from typing import Any
from root.constants import PHONE_NUMBER_REGEX


class LowerCaseField(models.CharField):

    def to_python(self, value: str) -> str:
        return super().to_python(value.lower())


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
