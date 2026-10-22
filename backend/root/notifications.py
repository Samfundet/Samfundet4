from __future__ import annotations

import time
import hashlib
import logging
import threading
from datetime import UTC, datetime, timedelta

from django.db import transaction
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail

from root.utils.parsing import parse_int

from samfundet.models import NotificationState
from samfundet.organization.selectors import web_members

LOG = logging.getLogger('root.notifications')

# In-process budget fallback, used only while the database is unavailable. Without
# it, a database outage disables the flood guard exactly when it is needed most (a
# 500 storm caused by the outage itself). It is a degraded mode, not a replacement:
# the state is per process, so with N workers the effective cap is N times the
# configured one, and it is lost on restart.
_LOCAL_BUDGET_MAX_ENTRIES = 1024
_LOCAL_BUDGET: dict[str, tuple[float, int]] = {}
_LOCAL_BUDGET_LOCK = threading.Lock()


def _reset_local_state() -> None:
    """Clear the in-process fallback state (used by tests)."""
    with _LOCAL_BUDGET_LOCK:
        _LOCAL_BUDGET.clear()


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
    A per-category budget bounds the number of send attempts per hour. A slot is
    reserved before each attempt and is deliberately not refunded when delivery
    fails, so a broken mail backend cannot be retried indefinitely within the hour.

    Dedupe and budget state lives in NotificationState and expires automatically;
    it is internal runtime state, not configuration.
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
    """Email addresses of the MG::Web members (single source of truth: web_members()).

    Best-effort and fail-safe: any failure to query the role system returns an empty
    list so the caller falls back to ADMINS.
    """
    try:
        return [member.email for member in web_members() if member.email]
    except Exception:
        LOG.warning('notification_web_recipients_lookup_failed', exc_info=True)
        return []


def _rate_limit_window(rate_limit_seconds: int | None) -> int:
    if rate_limit_seconds is None:
        return int(settings.NOTIFICATION_RATE_LIMIT_SECONDS)
    return rate_limit_seconds


def _deliver(category: str, subject: str, body: str, recipients: list[str]) -> bool:
    """Reserve one budget slot, then attempt delivery.

    The slot is not refunded when delivery fails: the budget guards against floods
    and retry storms, so failed attempts count towards it. The dedupe claim is
    released separately in notify(), so a failure still permits a later retry.
    """
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
    now = timezone.now()
    expires_at = now + timedelta(seconds=window)
    try:
        entry, created = NotificationState.objects.get_or_create(key=key, defaults={'expires_at': expires_at})
    except Exception:
        # Fail-open: if dedupe state can't be read (e.g. database down), send anyway.
        LOG.warning('notification_dedupe_check_failed', exc_info=True)
        return True
    if created:
        return True
    if entry.expires_at > now:
        return False
    # Compare-and-swap: only the caller that flips the expired row wins the slot.
    try:
        return NotificationState.objects.filter(key=key, expires_at=entry.expires_at).update(expires_at=expires_at) > 0
    except Exception:
        # Fail-open, same as above: a broken CAS must not stop the notification.
        LOG.warning('notification_dedupe_check_failed', exc_info=True)
        return True


def _release(category: str, dedupe_key: str | None) -> None:
    """Delete a dedupe claim so a failed send does not suppress future retries."""
    if dedupe_key is None:
        return
    try:
        NotificationState.objects.filter(key=_dedupe_key(category, dedupe_key)).delete()
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
    key = _budget_key(category)
    try:
        return _increment_budget(key) <= cap
    except Exception:
        # Degrade to the in-process counter instead of disabling the flood guard
        # during exactly the outage it protects against.
        LOG.warning('notification_budget_check_failed', extra={'category': category}, exc_info=True)
        return _increment_local_budget(key) <= cap


def _increment_local_budget(key: str) -> int:
    """Increment the in-process budget counter for key, pruning stale entries.

    The key carries its hour bucket, so entries expire at the end of that hour.
    """
    now = time.time()
    expires_at = (_budget_hour(key) + 1) * 3600
    with _LOCAL_BUDGET_LOCK:
        _prune_local_budget(now)
        count = _LOCAL_BUDGET.get(key, (expires_at, 0))[1] + 1
        _LOCAL_BUDGET[key] = (expires_at, count)
        return count


def _prune_local_budget(now: float) -> None:
    """Drop expired entries, then the oldest ones if the store is still too big."""
    for key in [key for key, (expires_at, _) in _LOCAL_BUDGET.items() if expires_at <= now]:
        del _LOCAL_BUDGET[key]
    while len(_LOCAL_BUDGET) > _LOCAL_BUDGET_MAX_ENTRIES:
        del _LOCAL_BUDGET[next(iter(_LOCAL_BUDGET))]


def _increment_budget(key: str) -> int:
    with transaction.atomic():
        entry, _ = NotificationState.objects.select_for_update().get_or_create(
            key=key,
            defaults={'value': '0', 'expires_at': _budget_expires_at(key)},
        )
        count = parse_int(entry.value) + 1
        entry.value = str(count)
        entry.save(update_fields=['value'])
        return count


def _budget_expires_at(key: str) -> datetime:
    """Expiry is the end of the epoch hour encoded in the budget key."""
    return datetime.fromtimestamp((_budget_hour(key) + 1) * 3600, tz=UTC)


def _budget_key(category: str) -> str:
    digest = hashlib.sha256(category.encode()).hexdigest()[:16]
    return f'notify:budget:{digest}:{int(time.time() // 3600)}'


def _dedupe_key(category: str, dedupe_key: str) -> str:
    # Truncated to keep the key within NotificationState's 60-char limit; uniqueness
    # of a dedupe key is not security-sensitive.
    digest = hashlib.sha256(f'{category}:{dedupe_key}'.encode()).hexdigest()[:40]
    return f'notify:{digest}'


def sweep_notification_state() -> int:
    """Delete expired notification state.

    Returns the number of rows removed. Best-effort: any failure is logged, not raised.
    """
    try:
        deleted, _ = NotificationState.objects.filter(expires_at__lt=timezone.now()).delete()
    except Exception:
        LOG.warning('notification_sweep_failed', exc_info=True)
        return 0
    return deleted


def _budget_hour(key: str) -> int:
    return int(key.rsplit(':', maxsplit=1)[1])
