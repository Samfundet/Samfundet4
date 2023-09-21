from django.db import models
from django.core.validators import RegexValidator


class LowerCaseField(models.CharField):

    def to_python(self, value: str) -> str:
        return super().to_python(value.lower())


class PhoneNumberField(models.CharField):

    def __init__(self, *args, **kwargs) -> None:
        kwargs['max_length'] = 15
        self.validators = [
            RegexValidator(
                regex=r'^([\+]?[(]?[0-9]{3}[)]?[-\s\.]?)?[0-9]{3}[-\s\.]?[0-9]{4,6}$',
                message='Enter a valid phonenumber',
            ),
        ]
        super().__init__(*args, **kwargs)
