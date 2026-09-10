from __future__ import annotations

import time
from unittest import mock

from django.conf import settings
from django.core import mail
from django.http import HttpRequest, HttpResponse
from django.test import TestCase, override_settings
from django.urls import path

from root import notifications

from samfundet.models.general import KeyValue

NOTIFICATION_RECIPIENTS = {
    'errors': ['errors@example.com'],
    'payments': ['payments@example.com'],
}


def exploding_view(request: HttpRequest) -> HttpResponse:
    raise RuntimeError('boom')


urlpatterns = [path('boom/', exploding_view)]


class NotifyTests(TestCase):
    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_sends_email_to_category_recipients(self) -> None:
        sent = notifications.notify('errors', 'Something failed', 'Details here')

        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertEqual(email.subject, 'Something failed')
        self.assertEqual(email.body, 'Details here')
        self.assertEqual(email.to, ['errors@example.com'])
        self.assertEqual(email.from_email, settings.DEFAULT_FROM_EMAIL)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS, ADMINS=[('Ops', 'ops@example.com')])
    def test_notify_unknown_category_falls_back_to_admins(self) -> None:
        sent = notifications.notify('unknown-category', 'Subject', 'Body')

        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['ops@example.com'])

    @override_settings(NOTIFICATION_RECIPIENTS={}, ADMINS=[])
    def test_notify_without_recipients_returns_false(self) -> None:
        sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_send_failure_is_non_fatal(self) -> None:
        with mock.patch('root.notifications.send_mail', side_effect=RuntimeError('smtp down')):
            sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)


class NotifyRateLimitTests(TestCase):
    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_collapses_identical_duplicates_within_window(self) -> None:
        first = notifications.notify('errors', 'Subject', 'Body', dedupe_key='payment-sync-failed')
        second = notifications.notify('errors', 'Subject', 'Body', dedupe_key='payment-sync-failed')

        self.assertTrue(first)
        self.assertFalse(second)
        self.assertEqual(len(mail.outbox), 1)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_different_dedupe_keys_are_not_collapsed(self) -> None:
        notifications.notify('errors', 'Subject', 'Body', dedupe_key='error-a')
        notifications.notify('errors', 'Subject', 'Body', dedupe_key='error-b')

        self.assertEqual(len(mail.outbox), 2)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_expired_dedupe_sends_again(self) -> None:
        notifications.notify('errors', 'Subject', 'Body', dedupe_key='recurring-error')

        entry = KeyValue.objects.get(key=notifications._dedupe_key('errors', 'recurring-error'))
        entry.value = str(time.time() - 7200)
        entry.save()

        sent = notifications.notify('errors', 'Subject', 'Body', dedupe_key='recurring-error')

        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 2)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_rate_limit_disabled_sends_every_time(self) -> None:
        notifications.notify('errors', 'Subject', 'Body', dedupe_key='x', rate_limit_seconds=0)
        notifications.notify('errors', 'Subject', 'Body', dedupe_key='x', rate_limit_seconds=0)

        self.assertEqual(len(mail.outbox), 2)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_dedupe_check_failure_sends_anyway(self) -> None:
        with mock.patch.object(KeyValue.objects, 'filter', side_effect=RuntimeError('db down')):
            sent = notifications.notify('errors', 'Subject', 'Body', dedupe_key='x')

        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 1)


@override_settings(
    ROOT_URLCONF='root.tests.test_notifications',
    DEBUG=False,
    ALLOWED_HOSTS=['testserver'],
    ADMINS=[('Ops', 'ops@example.com')],
)
class ServerErrorEmailTests(TestCase):
    def test_unhandled_500_emails_admins(self) -> None:
        response = self.client.get('/boom/', raise_request_exception=False)

        self.assertEqual(response.status_code, 500)
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertEqual(email.to, ['ops@example.com'])
        self.assertIn('boom', email.subject + email.body)
