from __future__ import annotations

from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from root.utils.mixins import CustomBaseModel

from samfundet.validators import validate_site_banner_url


class SiteBanner(CustomBaseModel):
    text_nb = models.CharField(max_length=128)
    text_en = models.CharField(max_length=128)

    url = models.CharField(max_length=500, blank=True, null=True, validators=[validate_site_banner_url])
    new_tab = models.BooleanField(default=False)

    start_at = models.DateTimeField()
    end_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Site banner'
        verbose_name_plural = 'Site banners'
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_at__isnull=True) | models.Q(end_at__gt=models.F('start_at')),
                name='site_banner_end_after_start',
            ),
        ]

    def __str__(self) -> str:
        return f'{self.text_nb[:40]}'

    def clean(self) -> None:
        super().clean()

        self.text_nb = self._strip_text(self.text_nb)
        self.text_en = self._strip_text(self.text_en)
        if self.url is not None:
            self.url = self.url.strip() or None
        blank_text_errors = {field_name: 'Banner text cannot be blank.' for field_name in ('text_nb', 'text_en') if not getattr(self, field_name)}
        if blank_text_errors:
            raise ValidationError(blank_text_errors)

        if self.start_at and self.end_at and self.end_at <= self.start_at:
            raise ValidationError({'end_at': 'End time must be after start time.'})

    @staticmethod
    def _strip_text(value: str | None) -> str:
        return value.strip() if value else ''

    @classmethod
    def active(cls) -> models.QuerySet:
        now = timezone.now()
        return cls.objects.filter(
            start_at__lte=now,
        ).filter(
            models.Q(end_at__isnull=True) | models.Q(end_at__gte=now),
        )
