from __future__ import annotations

from django.db import models


class NotificationState(models.Model):
    """Short-lived internal state for the notification layer.

    Used by root.notifications for deduplication and per-category rate limiting.
    This is runtime state, not configuration, and must not be exposed through the
    public API. Expired rows are removed by the cleanup_notifications command.
    """

    key = models.CharField(max_length=60, unique=True)
    value = models.CharField(max_length=60, default='', blank=True)
    expires_at = models.DateTimeField(db_index=True)

    class Meta:
        verbose_name = 'NotificationState'
        verbose_name_plural = 'NotificationStates'

    def __str__(self) -> str:
        return f'{self.key} (expires {self.expires_at:%Y-%m-%d %H:%M:%S})'
