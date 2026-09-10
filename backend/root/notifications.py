from __future__ import annotations

import hashlib
import logging
import time
from typing import TYPE_CHECKING

from django.conf import settings
from django.core.mail import send_mail

if TYPE_CHECKING:
    from samfundet.models.general import KeyValue

LOG = logging.getLogger('root.notifications')


def notify(
    category: str,
    subject: str,
    body: str,
    *,
    dedupe_key: str | None = None,
    rate_limit_seconds: int | None = None,
) -> bool:
    """
    Send an operational notification email to the recipients configured for a category.

    Fail-safe by design: never raises, so it is safe to call from any request or
    background operation. Returns True when the email was dispatched, False when it
    was skipped (no recipients, or a duplicate within the rate-limit window) or
    could not be sent.

    Recipients come from settings.NOTIFICATION_RECIPIENTS, falling back to
    settings.ADMINS for unknown categories.

    When dedupe_key is given, repeated notifications with the same key within
    'rate_limit_seconds' (default settings.NOTIFICATION_RATE_LIMIT_SECONDS) collapse
    into a single email. Dedupe state is stored in the KeyValue model.
    """
    recipients = _recipients_for_category(category)
    if not recipients:
        LOG.warning('notification_no_recipients', extra={'category': category})
        return False

    window = _rate_limit_window(rate_limit_seconds)
    if _is_duplicate(category, dedupe_key, window):
        LOG.info('notification_skipped_duplicate', extra={'category': category, 'dedupe_key': dedupe_key})
        return False

    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, recipients, fail_silently=True)
    except Exception:
        LOG.exception('notification_send_failed', extra={'category': category, 'recipients': recipients})
        return False

    if dedupe_key is not None:
        _mark_sent(category, dedupe_key)

    LOG.info('notification_sent', extra={'category': category, 'recipients': recipients, 'subject': subject})
    return True


def _recipients_for_category(category: str) -> list[str]:
    """Resolve recipients for a category, falling back to ADMINS for unknown ones."""
    recipients = settings.NOTIFICATION_RECIPIENTS.get(category)
    if recipients:
        return list(recipients)
    return _admin_emails()


def _admin_emails() -> list[str]:
    """Flat list of email addresses from settings.ADMINS."""
    return [admin if isinstance(admin, str) else admin[1] for admin in settings.ADMINS]


def _rate_limit_window(rate_limit_seconds: int | None) -> int:
    if rate_limit_seconds is None:
        return int(settings.NOTIFICATION_RATE_LIMIT_SECONDS)
    return rate_limit_seconds


def _is_duplicate(category: str, dedupe_key: str | None, window: int) -> bool:
    """Whether a notification with this key was sent within the window.

    Notifications without a dedupe_key, or windows <= 0 (disabled), are never
    considered duplicates. The check is best-effort: if the dedupe state cannot be
    read (e.g. database unavailable), returns False so the notification is sent
    rather than silently dropped.
    """
    if dedupe_key is None or window <= 0:
        return False
    entry = _get_key_value(_dedupe_key(category, dedupe_key))
    if entry is None:
        return False
    try:
        sent_at = float(entry.value)
    except ValueError:
        return False
    return time.time() - sent_at < window


def _mark_sent(category: str, dedupe_key: str) -> None:
    """Record that a notification with this key was just sent.

    Best-effort: a failure to record is logged but never raised, so it cannot break
    the caller (the email has already been dispatched).
    """
    try:
        from samfundet.models.general import KeyValue

        KeyValue.objects.update_or_create(key=_dedupe_key(category, dedupe_key), defaults={'value': str(time.time())})
    except Exception:
        LOG.warning('notification_dedupe_record_failed', extra={'category': category, 'dedupe_key': dedupe_key}, exc_info=True)


def _dedupe_key(category: str, dedupe_key: str) -> str:
    # Truncated to keep the key within KeyValue's 60-char limit; uniqueness of a
    # dedupe key is not security-sensitive.
    digest = hashlib.sha256(f'{category}:{dedupe_key}'.encode()).hexdigest()[:40]
    return f'notify:{digest}'


def _get_key_value(key: str) -> KeyValue | None:
    """Look up a KeyValue row, returning None when unavailable instead of raising."""
    try:
        from samfundet.models.general import KeyValue

        return KeyValue.objects.filter(key=key).first()
    except Exception:
        LOG.warning('notification_dedupe_check_failed', exc_info=True)
        return None
