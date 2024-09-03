from __future__ import annotations

from django.core import mail

from django.test import TestCase, Client
from django.test import override_settings
from unittest.mock import patch
from django.core import mail
from samfundet.views import SendRejectionMailView


class SendRejectionMailViewTest(TestCase):
    def setUp(self):
        self.client = Client()

    @patch('samfundet.views.send_mail')
    @override_settings(EMAIL_HOST_USER='test@samfundet.no')
    def test_post(self, mock_send_mail):
        # Prepare data
        data = {'subject': 'Test Subject', 'text': 'Test Text'}
        # Call the post method
        response = self.client.post('rejected_applicants/', data)
        # Check the status code
        self.assertEqual(response.status_code, 200)
        # Check the send_mail call
        mock_send_mail.assert_called_once_with(
            'Test Subject',
            'Test Text',
            'test@samfundet.no',
            ANY,  # This should be the list of rejected user emails
            fail_silently=False,
        )


def test_send_email():
    # Send email
    subject = 'Subject here'
    message = 'Here is the message.'
    from_email = 'from@example.com'
    recievers = ['to@example.com']
    mail.send_mail(
        subject,
        message,
        from_email,
        recievers,
        fail_silently=False,
    )

    # Check that one message has been sent
    assert len(mail.outbox) == 1

    # Check the subject of the first message
    assert mail.outbox[0].subject == subject

    # Check the recipient of the first message
    assert mail.outbox[0].to == recievers

    # Check the body of the first message
    assert mail.outbox[0].body == message
