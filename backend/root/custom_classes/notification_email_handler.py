from __future__ import annotations

import logging
import traceback

LOG = logging.getLogger('root.custom_classes.notification_email_handler')


class NotificationEmailHandler(logging.Handler):
    """Logging handler that routes error records through root.notifications.notify().

    A drop-in replacement for django.utils.log.AdminEmailHandler. Instead of rendering
    Django's technical_500 template, it builds a plain-text body from the log record and
    sends it via the project's own notify() layer: category-aware recipients, fail-safe
    by design, and rate-limited/deduplicated.
    """

    def emit(self, record: logging.LogRecord) -> None:
        try:
            # Lazy import so this module stays importable while logging is configured
            # during settings load (before the app registry is ready).
            from root.notifications import notify  # noqa: PLC0415

            notify(
                'errors',
                f'{record.levelname}: {record.getMessage()}',
                self._render_body(record),
                dedupe_key=self._dedupe_key(record),
            )
        except Exception:
            LOG.exception('notification_email_handler_emit_failed')

    def _render_body(self, record: logging.LogRecord) -> str:
        if record.exc_info and record.exc_info[0] is not None:
            return ''.join(traceback.format_exception(*record.exc_info))
        return record.getMessage()

    def _dedupe_key(self, record: logging.LogRecord) -> str | None:
        if not (record.exc_info and record.exc_info[0] is not None):
            return None
        exc_type, exc_value, _ = record.exc_info
        request = getattr(record, 'request', None)
        path = getattr(request, 'path', '')
        return f'unhandled:{path}:{exc_type.__name__}:{exc_value}'
