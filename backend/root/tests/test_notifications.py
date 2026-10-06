from __future__ import annotations

import sys
import time
import logging
from unittest import mock

from django.conf import settings
from django.core import mail
from django.http import HttpRequest, HttpResponse
from django.test import Client, TestCase, override_settings
from django.urls import path

from root import notifications
from root.settings.base import _parse_admins
from root.custom_classes.notification_email_handler import NotificationEmailHandler

from samfundet.models.role import Role, UserGangSectionRole
from samfundet.models.general import User, KeyValue
from samfundet.organization.models import Gang, GangSection, Organization

NOTIFICATION_RECIPIENTS = {
    'errors': ['errors@example.com'],
}


def exploding_view(request: HttpRequest) -> HttpResponse:
    raise RuntimeError('boom')


# Minimal URLConf used by ServerErrorEmailTests via ROOT_URLCONF.
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
    def test_notify_unconfigured_category_is_disabled(self) -> None:
        sent = notifications.notify('unknown-category', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(NOTIFICATION_RECIPIENTS={}, ADMINS=[])
    def test_notify_without_recipients_returns_false(self) -> None:
        sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(NOTIFICATION_RECIPIENTS={'errors': []}, ADMINS=[('Ops', 'ops@example.com')])
    def test_notify_disabled_category_does_not_fall_back(self) -> None:
        sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_send_zero_count_is_failure(self) -> None:
        with mock.patch('root.notifications.send_mail', return_value=0):
            sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_send_raise_is_non_fatal(self) -> None:
        with mock.patch('root.notifications.send_mail', side_effect=RuntimeError('smtp down')):
            sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_notify_failed_send_releases_claim(self) -> None:
        with mock.patch('root.notifications.send_mail', return_value=0):
            first = notifications.notify('errors', 'Subject', 'Body', dedupe_key='x')

        second = notifications.notify('errors', 'Subject', 'Body', dedupe_key='x')

        self.assertFalse(first)
        self.assertTrue(second)
        self.assertEqual(len(mail.outbox), 1)


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
        with mock.patch.object(KeyValue.objects, 'get_or_create', side_effect=RuntimeError('db down')):
            sent = notifications.notify('errors', 'Subject', 'Body', dedupe_key='x')

        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 1)


class NotifyBudgetTests(TestCase):
    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS, NOTIFICATION_MAX_PER_CATEGORY_PER_HOUR=1)
    def test_notify_budget_caps_emails(self) -> None:
        first = notifications.notify('errors', 'Subject', 'Body', dedupe_key='a')
        second = notifications.notify('errors', 'Subject', 'Body', dedupe_key='b')

        self.assertTrue(first)
        self.assertFalse(second)
        self.assertEqual(len(mail.outbox), 1)

    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS, NOTIFICATION_MAX_PER_CATEGORY_PER_HOUR=0)
    def test_notify_budget_disabled_sends_every_time(self) -> None:
        notifications.notify('errors', 'Subject', 'Body', dedupe_key='a')
        notifications.notify('errors', 'Subject', 'Body', dedupe_key='b')

        self.assertEqual(len(mail.outbox), 2)


class NotifySweepTests(TestCase):
    @override_settings(NOTIFICATION_RECIPIENTS=NOTIFICATION_RECIPIENTS)
    def test_sweep_removes_stale_dedupe_state(self) -> None:
        notifications.notify('errors', 'Subject', 'Body', dedupe_key='stale')

        key = notifications._dedupe_key('errors', 'stale')
        entry = KeyValue.objects.get(key=key)
        entry.value = str(time.time() - 7200)
        entry.save()

        removed = notifications.sweep_notification_state(max_age_seconds=3600)

        self.assertGreaterEqual(removed, 1)
        self.assertFalse(KeyValue.objects.filter(key=key).exists())


class WebRecipientsTests(TestCase):
    def setUp(self) -> None:
        self.organization = Organization.objects.create(name='Samfundet')
        self.gang = Gang.objects.create(
            name_nb='Markedsføringsgjengen',
            name_en='Markedsføringsgjengen',
            abbreviation='MG',
            organization=self.organization,
        )
        self.web_section = GangSection.objects.create(name_nb='Web', name_en='Web', gang=self.gang)
        self.role = Role.objects.create(name='gang_member')

    def _make_member(self, email: str, *, active: bool = True) -> None:
        user = User.objects.create_user(username=email.split('@', maxsplit=1)[0], email=email, password='test123', is_active=active)
        UserGangSectionRole.objects.create(user=user, role=self.role, obj=self.web_section)

    @override_settings(NOTIFICATION_RECIPIENTS={})
    def test_web_section_members_receive_errors(self) -> None:
        self._make_member('webdev@samfundet.no')

        sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['webdev@samfundet.no'])

    @override_settings(NOTIFICATION_RECIPIENTS={'errors': ['ops@example.com']})
    def test_explicit_override_wins_over_web_members(self) -> None:
        self._make_member('webdev@samfundet.no')

        sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertTrue(sent)
        self.assertEqual(mail.outbox[0].to, ['ops@example.com'])

    @override_settings(NOTIFICATION_RECIPIENTS={}, ADMINS=[('Ops', 'ops@example.com')])
    def test_falls_back_to_admins_without_web_members(self) -> None:
        sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertTrue(sent)
        self.assertEqual(mail.outbox[0].to, ['ops@example.com'])

    @override_settings(NOTIFICATION_RECIPIENTS={}, ADMINS=[])
    def test_inactive_web_member_is_excluded(self) -> None:
        self._make_member('webdev@samfundet.no', active=False)

        sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(NOTIFICATION_RECIPIENTS={}, ADMINS=[('Ops', 'ops@example.com')])
    def test_non_web_category_does_not_use_web_members(self) -> None:
        self._make_member('webdev@samfundet.no')

        sent = notifications.notify('payments', 'Subject', 'Body')

        self.assertFalse(sent)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(NOTIFICATION_RECIPIENTS={}, ADMINS=[('Ops', 'ops@example.com')])
    def test_web_lookup_failure_falls_back_to_admins(self) -> None:
        self._make_member('webdev@samfundet.no')
        with mock.patch.object(UserGangSectionRole, 'objects') as manager:
            manager.filter.side_effect = RuntimeError('db down')
            sent = notifications.notify('errors', 'Subject', 'Body')

        self.assertTrue(sent)
        self.assertEqual(mail.outbox[0].to, ['ops@example.com'])


class ParseAdminsTests(TestCase):
    def test_bare_email_becomes_empty_name_tuple(self) -> None:
        self.assertEqual(_parse_admins('mg-web@samfundet.no'), [('', 'mg-web@samfundet.no')])

    def test_name_email_tuple(self) -> None:
        self.assertEqual(_parse_admins('Drifts <drift@samfundet.no>'), [('Drifts', 'drift@samfundet.no')])

    def test_multiple_and_empty_entries(self) -> None:
        self.assertEqual(_parse_admins('a@x.no, , B <b@x.no>'), [('', 'a@x.no'), ('B', 'b@x.no')])


def make_record(message: str = 'boom', *, exc_info: bool = False, request: HttpRequest | None = None) -> logging.LogRecord:
    info = None
    if exc_info:
        try:
            raise ValueError('boom')
        except ValueError:
            info = sys.exc_info()
    record = logging.LogRecord('django.request', logging.ERROR, __file__, 1, message, None, info)
    record.request = request
    return record


class NotificationEmailHandlerTests(TestCase):
    def test_subject_does_not_contain_raw_message(self) -> None:
        record = make_record('secret <token>\nsecond line', request=HttpRequest())

        handler = NotificationEmailHandler()
        subject = handler._render_subject(record)

        self.assertIn('ERROR', subject)
        self.assertNotIn('secret', subject)

    def test_body_contains_message_and_traceback(self) -> None:
        record = make_record(exc_info=True, request=HttpRequest())

        handler = NotificationEmailHandler()
        body = handler._render_body(record)

        self.assertIn('boom', body)
        self.assertIn('ValueError', body)

    def test_dedupe_key_shape(self) -> None:
        request = HttpRequest()
        request.path = '/boom/'
        record = make_record(exc_info=True, request=request)

        handler = NotificationEmailHandler()
        key = handler._dedupe_key(record)

        self.assertEqual(key, 'unhandled:/boom/:ValueError:boom')

    def test_dedupe_key_none_without_exception(self) -> None:
        record = make_record(exc_info=False)

        handler = NotificationEmailHandler()
        self.assertIsNone(handler._dedupe_key(record))


@override_settings(
    ROOT_URLCONF='root.tests.test_notifications',
    DEBUG=False,
    ALLOWED_HOSTS=['testserver'],
    ADMINS=[('Ops', 'ops@example.com')],
    NOTIFICATION_RECIPIENTS={'errors': ['ops@example.com']},
)
class ServerErrorEmailTests(TestCase):
    def test_unhandled_500_emails_admins(self) -> None:
        client = Client(raise_request_exception=False)
        response = client.get('/boom/')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertEqual(email.to, ['ops@example.com'])
        self.assertIn('boom', email.subject + email.body)

    def test_repeated_500s_are_deduplicated(self) -> None:
        client = Client(raise_request_exception=False)
        client.get('/boom/')
        client.get('/boom/')

        self.assertEqual(len(mail.outbox), 1)
