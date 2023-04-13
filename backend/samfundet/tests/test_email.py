import pytest
from django.core import mail


@pytest.mark.django_db
def test_send_email():
    # Send email
    mail.send_mail(
        'Subject here',
        'Here is the message.',
        'from@example.com',
        ['to@example.com'],
        fail_silently=False,
    )

    # Check that one message has been sent
    assert len(mail.outbox) == 1

    # Check the subject of the first message
    assert mail.outbox[0].subject == 'Subject here'

    # Check the recipient of the first message
    assert mail.outbox[0].to == ['to@example.com']

    # Check the body of the first message
    assert mail.outbox[0].body == 'Here is the message.'
