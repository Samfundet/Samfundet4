from __future__ import annotations

from django.core import mail
from django.test import TestCase
from django.urls import reverse

from django.utils import timezone  
from datetime import timedelta  
from root.settings.base import TEST_EMAIL_FILE

from samfundet.models.general import User
from samfundet.models.recruitment import (
    Recruitment,
    RecruitmentApplication,
    Organization,
)
from samfundet.models.model_choices import RecruitmentStatusChoices


class SendRejectionMailViewTests(TestCase):

    def setUp(self):
        # Create a recruitment
        self.recruitment = Recruitment.objects.create(
            name_nb='Test Recruitment NB',
            name_en='Test Recruitment EN',
            visible_from=timezone.now() - timedelta(days=1),
            actual_application_deadline=timezone.now() + timedelta(days=5),  # Must be before reprioritization deadlines
            shown_application_deadline=timezone.now() + timedelta(days=4),
            reprioritization_deadline_for_applicant=timezone.now() + timedelta(days=6),  # Must be after actual_application_deadline
            reprioritization_deadline_for_groups=timezone.now() + timedelta(days=7),  # Must be after reprioritization_deadline_for_applicant
            organization=Organization.objects.create(name='Test Organization')
        )        # Create users
        self.user_rejected = User.objects.create(email='rejected@example.com')
        self.user_withdrawn = User.objects.create(email='withdrawn@example.com')
        self.user_contacted = User.objects.create(email='contacted@example.com')
        self.user_rejected_but_contacted = User.objects.create(email='skurrabompapa@example.com')

        # Create applications
        # Rejected but not contacted (should receive rejection email)
        RecruitmentApplication.objects.create(
            user=self.user_rejected,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.REJECTION,
            withdrawn=False
        )

        # Withdrawn application (should NOT receive rejection email)
        RecruitmentApplication.objects.create(
            user=self.user_withdrawn,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.REJECTION,
            withdrawn=True
        )

        # Contacted with an offer (should NOT receive rejection email)
        RecruitmentApplication.objects.create(
            user=self.user_contacted,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
            withdrawn=False
        )

        # User with a rejected application and has been contacted in another application (rejected but also contacted)
        # Should NOT receive rejection email
        RecruitmentApplication.objects.create(
            user=self.user_rejected_but_contacted,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.REJECTION,
            withdrawn=False
        )

        RecruitmentApplication.objects.create(
            user=self.user_rejected_but_contacted,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
            withdrawn=False
        )

    def test_rejection_email_sent_to_eligible_users(self):
        # Send the rejection email
        response = self.client.post(reverse('send-rejection-mail'), {
            'subject': 'Rejection',
            'text': 'You have been rejected. Womp womp',
            'recruitment': self.recruitment.id
        })

        self.assertEqual(response.status_code, 200)

        # Verify that emails were sent to eligible users only
        self.assertEqual(len(mail.outbox), 1)  # Only one email should be sent
        sent_emails = [email.to[0] for email in mail.outbox]
        self.assertIn('rejected@example.com', sent_emails)  # Rejected but not contacted
        self.assertNotIn('withdrawn@example.com', sent_emails)  # Withdrawn should not receive
        self.assertNotIn('contacted@example.com', sent_emails)  # Contacted should not receive
        self.assertNotIn('mixed@example.com', sent_emails)  # Mixed should not receive



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
    with open(TEST_EMAIL_FILE, 'w') as f:
        f.write(f'Subject: {email.subject}\n')
        f.write(f'From: {email.from_email}\n')
        f.write(f"To: {', '.join(email.to)}\n")
        f.write(f'Message: {email.body}\n')
