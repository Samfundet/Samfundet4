from __future__ import annotations

import uuid

from django.db import models
from django.utils import timezone

from root.utils.mixins import CustomBaseModel


class SiteBanner(CustomBaseModel):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    text_nb = models.CharField(max_length=80)
    text_en = models.CharField(max_length=80)

    url = models.CharField(max_length=500, blank=True, null=True)
    new_tab = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    start_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Site banner'
        verbose_name_plural = 'Site banners'

    def __str__(self) -> str:
        return f'{self.text_nb[:40]}'

    def is_currently_active(self, *, now: timezone.datetime | None = None) -> bool:
        now = now or timezone.now()
        if not self.is_active:
            return False
        if self.start_at and self.start_at > now:
            return False
        return not (self.end_at and self.end_at < now)

    @classmethod
    def active(cls) -> models.QuerySet:
        now = timezone.now()
        return cls.objects.filter(is_active=True).filter(
            models.Q(start_at__isnull=True) | models.Q(start_at__lte=now),
            models.Q(end_at__isnull=True) | models.Q(end_at__gte=now),
        )
