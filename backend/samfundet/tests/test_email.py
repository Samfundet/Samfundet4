from django.core import mail


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
