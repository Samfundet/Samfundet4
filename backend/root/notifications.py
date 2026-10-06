from __future__ import annotations

import time
import hashlib
import logging

from django.db import transaction
from django.conf import settings
from django.core.mail import send_mail

from samfundet.models.role import UserGangSectionRole
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
    background operation. Returns True only when the email was actually handed to the
    mail backend, False when it was skipped (no recipients, a duplicate within the
    rate-limit window, the category budget is exhausted) or could not be sent.

    Recipients are resolved per category: an explicit override in
    settings.NOTIFICATION_RECIPIENTS (if present, including an empty list to disable
    the category) wins. Otherwise, categories in settings.NOTIFICATION_WEB_CATEGORIES
    default to the members of the MG::Web section (falling back to settings.ADMINS);
    all other categories are disabled (no recipients).

    When dedupe_key is given, repeated notifications with the same key within
    'rate_limit_seconds' (default settings.NOTIFICATION_RATE_LIMIT_SECONDS) collapse
    into a single email. The dedupe claim is made atomically before sending and
    released again if sending fails, so a transient failure never suppresses retries.
    A per-category budget bounds the number of emails sent per hour.
    """
    recipients = _recipients_for_category(category)
    if not recipients:
        LOG.warning('notification_no_recipients', extra={'category': category})
        return False

    window = _rate_limit_window(rate_limit_seconds)
    if not _claim(category, dedupe_key, window):
        LOG.info('notification_skipped_duplicate', extra={'category': category, 'dedupe_key': dedupe_key})
        return False

    if not _deliver(category, subject, body, recipients):
        _release(category, dedupe_key)
        return False

    LOG.info('notification_sent', extra={'category': category, 'recipients': recipients, 'subject': subject})
    return True


def _recipients_for_category(category: str) -> list[str]:
    """Resolve recipients for a category.

    Order of precedence:
    1. An explicit override in settings.NOTIFICATION_RECIPIENTS (an empty list
       disables the category and never falls back).
    2. For categories in settings.NOTIFICATION_WEB_CATEGORIES, the members of the
       MG::Web section, falling back to settings.ADMINS.
    3. Any other category is disabled (no recipients).
    """
    recipients = settings.NOTIFICATION_RECIPIENTS.get(category)
    if recipients is not None:
        return list(recipients)
    if category in settings.NOTIFICATION_WEB_CATEGORIES:
        web_recipients = _web_section_recipients()
        return web_recipients or _admin_emails()
    return []


def _admin_emails() -> list[str]:
    """Flat list of email addresses from settings.ADMINS."""
    return [email for _, email in settings.ADMINS]


def _web_section_recipients() -> list[str]:
    """Email addresses of active users with a role on the Web section of MG in Samfundet.

    Best-effort and fail-safe: any failure to query the role system returns an empty
    list so the caller falls back to ADMINS.
    """
    try:
        emails = (
            UserGangSectionRole.objects.filter(
                user__is_active=True,
                user__email__isnull=False,
                obj__name_nb__iexact='Web',
                obj__gang__abbreviation__iexact='MG',
                obj__gang__organization__name__iexact='Samfundet',
            )
            .values_list('user__email', flat=True)
            .distinct()
        )
        return [email for email in emails if email]
    except Exception:
        LOG.warning('notification_web_recipients_lookup_failed', exc_info=True)
        return []


def _rate_limit_window(rate_limit_seconds: int | None) -> int:
    if rate_limit_seconds is None:
        return int(settings.NOTIFICATION_RATE_LIMIT_SECONDS)
    return rate_limit_seconds


def _deliver(category: str, subject: str, body: str, recipients: list[str]) -> bool:
    if not _consume_budget(category):
        LOG.info('notification_rate_limited', extra={'category': category})
        return False
    return _send(subject, body, recipients)


def _send(subject: str, body: str, recipients: list[str]) -> bool:
    """Send and report whether the message was actually delivered.

    send_mail runs with fail_silently=True, which swallows SMTP failures and returns
    0 instead of raising. A return count of 0 therefore means nothing was delivered
    and is treated as a failure.
    """
    try:
        return send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, recipients, fail_silently=True) > 0
    except Exception:
        LOG.exception('notification_send_failed', extra={'recipients': recipients})
        return False


def _claim(category: str, dedupe_key: str | None, window: int) -> bool:
    """Atomically reserve the dedupe slot before sending.

    Returns True when this caller owns the slot (or dedupe/rate-limit is disabled),
    False when another caller already claimed it within the window.
    """
    if dedupe_key is None:
        return True
    if window <= 0:
        return True
    return _claim_row(_dedupe_key(category, dedupe_key), window)


def _claim_row(key: str, window: int) -> bool:
    now = time.time()
    try:
        entry, created = KeyValue.objects.get_or_create(key=key, defaults={'value': str(now)})
    except Exception:
        # Fail-open: if dedupe state can't be read (e.g. database down), send anyway.
        LOG.warning('notification_dedupe_check_failed', exc_info=True)
        return True
    if created:
        return True
    if now - _parse_timestamp(entry.value) < window:
        return False
    # Compare-and-swap: only the caller that flips the old value wins the expired slot.
    return KeyValue.objects.filter(key=key, value=entry.value).update(value=str(now)) > 0


def _release(category: str, dedupe_key: str | None) -> None:
    """Delete a dedupe claim so a failed send does not suppress future retries."""
    if dedupe_key is None:
        return
    try:
        KeyValue.objects.filter(key=_dedupe_key(category, dedupe_key)).delete()
    except Exception:
        LOG.warning('notification_release_failed', extra={'category': category}, exc_info=True)


def _consume_budget(category: str) -> bool:
    """Whether the category is still within its per-hour email budget.

    Best-effort: the counter is incremented atomically and checked against the cap.
    Under heavy concurrency a couple of emails may overshoot, which is acceptable for
    a flood guard.
    """
    cap = int(settings.NOTIFICATION_MAX_PER_CATEGORY_PER_HOUR)
    if cap <= 0:
        return True
    try:
        return _increment_budget(_budget_key(category)) <= cap
    except Exception:
        # Fail-open: if the budget can't be tracked, don't block the notification.
        LOG.warning('notification_budget_check_failed', extra={'category': category}, exc_info=True)
        return True


def _increment_budget(key: str) -> int:
    with transaction.atomic():
        entry, _ = KeyValue.objects.select_for_update().get_or_create(key=key, defaults={'value': '0'})
        count = _parse_int(entry.value) + 1
        entry.value = str(count)
        entry.save()
        return count


def _budget_key(category: str) -> str:
    digest = hashlib.sha256(category.encode()).hexdigest()[:16]
    return f'notify:budget:{digest}:{int(time.time() // 3600)}'


def _dedupe_key(category: str, dedupe_key: str) -> str:
    # Truncated to keep the key within KeyValue's 60-char limit; uniqueness of a
    # dedupe key is not security-sensitive.
    digest = hashlib.sha256(f'{category}:{dedupe_key}'.encode()).hexdigest()[:40]
    return f'notify:{digest}'


def _parse_timestamp(value: str) -> float:
    try:
        return float(value)
    except ValueError:
        return 0.0


def _parse_int(value: str) -> int:
    try:
        return int(value)
    except ValueError:
        return 0


def sweep_notification_state(max_age_seconds: int | None = None) -> int:
    """Delete notification state (dedupe/budget rows) older than the retention window.

    Returns the number of rows removed. Best-effort: any failure is logged, not raised.
    """
    age = max_age_seconds if max_age_seconds is not None else int(settings.NOTIFICATION_RETENTION_SECONDS)
    now = time.time()
    cutoff_hour = int((now - age) // 3600)
    try:
        stale_keys = [entry.key for entry in KeyValue.objects.filter(key__startswith='notify:') if _is_stale(entry, now, age, cutoff_hour)]
    except Exception:
        LOG.warning('notification_sweep_failed', exc_info=True)
        return 0
    if not stale_keys:
        return 0
    KeyValue.objects.filter(key__in=stale_keys).delete()
    return len(stale_keys)


def _is_stale(entry: KeyValue, now: float, age: int, cutoff_hour: int) -> bool:
    if entry.key.startswith('notify:budget:'):
        return _budget_hour(entry.key) < cutoff_hour
    return now - _parse_timestamp(entry.value) > age


def _budget_hour(key: str) -> int:
    return int(key.rsplit(':', maxsplit=1)[1])
