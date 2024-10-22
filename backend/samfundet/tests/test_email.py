from __future__ import annotations

from datetime import timedelta

from rest_framework.test import APIClient

from django.core import mail
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from root.utils import routes
from root.settings.base import TEST_EMAIL_FILE

from samfundet.models.general import Gang, User
from samfundet.models.recruitment import (
    Recruitment,
    Organization,
    RecruitmentPosition,
    RecruitmentApplication,
)
from samfundet.models.model_choices import RecruitmentStatusChoices


class SendRejectionMailViewTests(TestCase):
    def setUp(self):
        # Create an organization
        self.organization = Organization.objects.create(name='Test org')

        # Create a gang
        self.gang = Gang.objects.create(name_nb='Test Gang NB', name_en='Test Gang EN', abbreviation='TG', organization=self.organization)

        # Create a recruitment
        self.recruitment = Recruitment.objects.create(
            name_nb='Test Recruitment NB',
            name_en='Test Recruitment EN',
            visible_from=timezone.now() - timedelta(days=1),
            actual_application_deadline=timezone.now() + timedelta(days=5),
            shown_application_deadline=timezone.now() + timedelta(days=4),
            reprioritization_deadline_for_applicant=timezone.now() + timedelta(days=6),
            reprioritization_deadline_for_groups=timezone.now() + timedelta(days=7),
            organization=self.organization,
        )

        # Create a recruitment position
        self.position = RecruitmentPosition.objects.create(
            name_nb='Test Position NB',
            name_en='Test Position EN',
            short_description_nb='Short description NB',
            short_description_en='Short description EN',
            long_description_nb='Long description NB',
            long_description_en='Long description EN',
            is_funksjonaer_position=False,
            default_application_letter_nb='Default letter NB',
            default_application_letter_en='Default letter EN',
            norwegian_applicants_only=False,
            recruitment=self.recruitment,
            gang=self.gang,  # Link the gang to the recruitment position
            tags='some-tag',  # Add the required 'tags' field
        )

        # Create users
        self.user_rejected = User.objects.create(username='rejected-user', email='rejected@example.com')
        self.user_withdrawn = User.objects.create(username='withdrawn-user', email='withdrawn@example.com')
        self.user_contacted = User.objects.create(username='contacted-user', email='contacted@example.com')
        self.user_rejected_but_contacted = User.objects.create(username='skurra-user', email='skurrabompapa@example.com')

        self.admin_user = User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpassword')

        # Assign necessary permissions to the admin user
        # assign_perm('samfundet.send_rejection_email', self.admin_user)
        # Clear permission caches
        # del self.admin_user._user_perm_cache
        # del self.admin_user._perm_cache

        # Initialize APIClient
        self.client = APIClient()

        # Create applications with the recruitment position
        # Rejected but not contacted (should receive rejection email)
        RecruitmentApplication.objects.create(
            user=self.user_rejected,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.REJECTION,
            withdrawn=False,
            recruitment_position=self.position,  # Link to the position
            application_text='Sample application text',  # Add required application_text field
        )

        # Withdrawn application (should NOT receive rejection email)
        RecruitmentApplication.objects.create(
            user=self.user_withdrawn,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.REJECTION,
            withdrawn=True,
            recruitment_position=self.position,  # Link to the position
            application_text='Sample application text',  # Add required application_text field
        )

        # Contacted with an offer (should NOT receive rejection email)
        RecruitmentApplication.objects.create(
            user=self.user_contacted,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
            withdrawn=False,
            recruitment_position=self.position,  # Link to the position
            application_text='Sample application text',  # Add required application_text field
        )

        # Rejected but also contacted (should NOT receive rejection email)
        RecruitmentApplication.objects.create(
            user=self.user_rejected_but_contacted,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.REJECTION,
            withdrawn=False,
            recruitment_position=self.position,  # Link to the position
            application_text='Sample application text',  # Add required application_text field
        )

        RecruitmentApplication.objects.create(
            user=self.user_rejected_but_contacted,
            recruitment=self.recruitment,
            recruiter_status=RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
            withdrawn=False,
            recruitment_position=self.position,  # Link to the position
            application_text='Sample application text',  # Add required application_text field
        )

    def test_rejection_email_sent_to_eligible_users(self):
        # Authenticate the admin user
        self.client.force_authenticate(user=self.admin_user)

        # Send the rejection email
        response = self.client.post(
            reverse(routes.samfundet__rejected_applicants),
            {'subject': 'Rejection', 'text': 'You have been rejected. Womp womp', 'recruitment': self.recruitment.id},
            format='json',  # Ensure data is sent as JSON if needed
        )

        # Verify response status
        self.assertEqual(response.status_code, 200)  # Verify that emails were sent to eligible users only
        self.assertEqual(len(mail.outbox), 1)  # Only one email should be sent
        sent_emails = [email.to[0] for email in mail.outbox]
        self.assertIn('rejected@example.com', sent_emails)  # Rejected but not contacted
        self.assertNotIn('withdrawn@example.com', sent_emails)  # Withdrawn should not receive
        self.assertNotIn('contacted@example.com', sent_emails)  # Contacted should not receive
        self.assertNotIn('skurrabompapa@example.com', sent_emails)  # Rejected but contacted should not receive
