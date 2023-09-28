#
# This file contains models spesific to the recruitment system
#

from __future__ import annotations
from django.core.exceptions import ValidationError
from django.utils import timezone

from django.db import models

from .general import Organization, User, Gang


class Recruitment(models.Model):
    name_nb = models.CharField(max_length=100, help_text='Name of the recruitment')
    name_en = models.CharField(max_length=100, help_text='Name of the recruitment')
    visible_from = models.DateTimeField(help_text='When it becomes visible for applicants')
    actual_application_deadline = models.DateTimeField(
        help_text='Last point an application can be sent, typically a bit after the shown deadline to avoid getting a lot of extra mail'
    )
    shown_application_deadline = models.DateTimeField(help_text='The deadline that is shown to applicants')
    reprioritization_deadline_for_applicant = models.DateTimeField(help_text='Before allocation meeting')
    reprioritization_deadline_for_groups = models.DateTimeField(help_text='Reprioritization deadline for groups')
    organization = models.ForeignKey(to=Organization, on_delete=models.CASCADE, help_text='The organization that is recruiting')

    def is_active(self) -> bool:
        return self.visible_from < timezone.now() < self.actual_application_deadline

    def clean(self) -> None:
        # All times should be in the future
        now = timezone.now()
        if any(
            [
                self.actual_application_deadline < now, self.shown_application_deadline < now, self.reprioritization_deadline_for_applicant < now,
                self.reprioritization_deadline_for_groups < now
            ]
        ):
            raise ValidationError('All times should be in the future')

        # Deadline should be after visible from
        if self.visible_from > self.actual_application_deadline:
            raise ValidationError('Application deadline should be after visible from')

        # Shown deadline should be before the actual deadline
        if self.shown_application_deadline > self.actual_application_deadline:
            raise ValidationError('Shown application deadline should be before the actual application deadline')

        # Actual deadline should be before reprioritization deadline for applicants
        if self.actual_application_deadline > self.reprioritization_deadline_for_applicant:
            raise ValidationError('Actual application deadline should be before reprioritization deadline for applicants')

        # Reprioritization deadline for applicants should be before reprioritization deadline for groups
        if self.reprioritization_deadline_for_applicant > self.reprioritization_deadline_for_groups:
            raise ValidationError('Reprioritization deadline for applicants should be before reprioritization deadline for groups')

        super().clean()

    def __str__(self) -> str:
        return f'Recruitment: {self.name_en} at {self.organization}'


class RecruitmentPosition(models.Model):
    name_nb = models.CharField(max_length=100, help_text='Name of the position')
    name_en = models.CharField(max_length=100, help_text='Name of the position')

    short_description_nb = models.CharField(max_length=100, help_text='Short description of the position')
    short_description_en = models.CharField(max_length=100, help_text='Short description of the position')

    long_description_nb = models.TextField(help_text='Long description of the position')
    long_description_en = models.TextField(help_text='Long description of the position')

    is_funksjonaer_position = models.BooleanField(help_text='Is this a funksjonær position?')

    default_admission_letter_nb = models.TextField(help_text='Default admission letter for the position')
    default_admission_letter_en = models.TextField(help_text='Default admission letter for the position')

    gang = models.ForeignKey(to=Gang, on_delete=models.CASCADE, help_text='The gang that is recruiting')
    recruitment = models.ForeignKey(
        Recruitment,
        on_delete=models.CASCADE,
        help_text='The recruitment that is recruiting',
        related_name='positions',
        null=True,
        blank=True,
    )

    # TODO: Implement tag functionality
    tags = models.CharField(max_length=100, help_text='Tags for the position')

    # TODO: Implement interviewer functionality
    interviewers = models.ManyToManyField(to=User, help_text='Interviewers for the position', blank=True, related_name='interviews')

    def __str__(self) -> str:
        return f'Position: {self.name_en} in {self.recruitment}'


class InterviewRoom(models.Model):
    name = models.CharField(max_length=255, help_text='Name of the room')
    location = models.CharField(max_length=255, help_text='Physical location, eg. campus')
    start_time = models.DateTimeField(help_text='Start time of availability')
    end_time = models.DateTimeField(help_text='End time of availability')
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='The recruitment that is recruiting', related_name='rooms')
    gang = models.ForeignKey(to=Gang, on_delete=models.CASCADE, help_text='The gang that booked the room', related_name='rooms', blank=True, null=True)

    def __str__(self) -> str:
        return self.name

    def clean(self) -> None:
        if self.start_time > self.end_time:
            raise ValidationError('Start time should be before end time')

        super().clean()


class InterviewNotes(models.Model):
    notes = models.TextField(help_text='Notes for the interview')
    timestamp = models.DateTimeField(help_text='Timestamp of the notes')


class RecruitmentAdmission(models.Model):
    admission_text = models.TextField(help_text='Admission text for the admission')
    recruitment_position = models.ForeignKey(
        RecruitmentPosition, on_delete=models.CASCADE, help_text='The recruitment position that is recruiting', related_name='admissions'
    )
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='The recruitment that is recruiting', related_name='admissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='The user that is applying', related_name='admissions')
    applicant_priority = models.IntegerField(help_text='The priority of the admission')

    interview_time = models.DateTimeField(help_text='The time of the interview', null=True, blank=True)
    interview_location = models.CharField(max_length=100, help_text='Where the intevjuee should wait', null=True, blank=True)
    room = models.ForeignKey(
        InterviewRoom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text='Room where the interview is held',
        related_name='interviews',
    )

    PRIORITY_CHOICES = [
        (0, 'Not Set'),
        (1, 'Not Wanted'),
        (2, 'Wanted'),
        (3, 'Reserve'),
    ]

    STATUS_CHOICES = [
        (0, 'Nothing'),
        (1, 'Called and Accepted'),
        (2, 'Called and Rejected'),
        (3, 'Automatic Rejection'),
    ]

    # TODO: Important that the following is not sent along with the rest of the object whenever a user retrieves its admission
    recruiter_priority = models.IntegerField(choices=PRIORITY_CHOICES, default=0, help_text='The priority of the admission')

    recruiter_status = models.IntegerField(choices=STATUS_CHOICES, default=0, help_text='The status of the admission')

    interview_notes = models.ForeignKey(InterviewNotes, on_delete=models.SET_NULL, help_text='Notes for the interview', blank=True, null=True)

    def __str__(self) -> str:
        return f'Admission: {self.user} for {self.recruitment_position} in {self.recruitment}'
