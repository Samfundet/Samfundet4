from __future__ import annotations

from django.core import mail

from django.test import TestCase, Client
from django.test import override_settings
from unittest.mock import patch
from django.core import mail
from samfundet.views import SendRejectionMailView


def test_send_email_and_save_to_file():
    subject = 'Subject here'
    message = 'Here is the message.'
    from_email = 'from@example.com'
    recipients = ['to@example.com']

    mail.send_mail(
        subject,
        message,
        from_email,
        recipients,
        fail_silently=False,
    )

    assert len(mail.outbox) == 1
    email = mail.outbox[0]

    assert email.subject == subject
    assert email.from_email == from_email
    assert email.to == recipients
    assert email.body == message

    # Writing email to a file for inspection
    with open('/backend/logs/test_email.txt', 'w') as f:
        f.write(f'Subject: {email.subject}\n')
        f.write(f'From: {email.from_email}\n')
        f.write(f"To: {', '.join(email.to)}\n")
        f.write(f'Message: {email.body}\n')
