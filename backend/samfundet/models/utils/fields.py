from django.db import models


class LowerCaseField(models.CharField):

    def to_python(self, value: str) -> str:
        return super().to_python(value.lower())
