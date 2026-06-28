from __future__ import annotations

from django.db import models
from django.utils import timezone

from root.utils.mixins import CustomBaseModel


class SiteBanner(CustomBaseModel):
    text_nb = models.CharField(max_length=128)
    text_en = models.CharField(max_length=128)

    url = models.CharField(max_length=500, blank=True, null=True)
    new_tab = models.BooleanField(default=False)

    start_at = models.DateTimeField()
    end_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Site banner'
        verbose_name_plural = 'Site banners'

    def __str__(self) -> str:
        return f'{self.text_nb[:40]}'

    @classmethod
    def active(cls) -> models.QuerySet:
        now = timezone.now()
        return cls.objects.filter(
            start_at__lte=now,
        ).filter(
            models.Q(end_at__isnull=True) | models.Q(end_at__gte=now),
        )
