#
# This file contains models spesific to the recruitment system
#

from __future__ import annotations
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db import models

from root.utils.mixins import FullCleanSaveMixin
from .general import Organization, User, Gang


class Recruitment(FullCleanSaveMixin):
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

    def update_stats(self) -> None:
        if not hasattr(self, 'statistics'):
            self.statistics = RecruitmentStatistics.objects.create(recruitment=self)
        else:
            self.statistics.save()

    def clean(self, *args: tuple, **kwargs: dict) -> None:
        super().clean()

        if not all(
            [
                self.visible_from,
                self.actual_application_deadline,
                self.shown_application_deadline,
                self.reprioritization_deadline_for_applicant,
                self.reprioritization_deadline_for_groups,
            ]
        ):
            raise ValidationError('Missing datetime')

        # All times should be in the future.
        now = timezone.now()
        if any(
            [
                self.actual_application_deadline < now, self.shown_application_deadline < now, self.reprioritization_deadline_for_applicant < now,
                self.reprioritization_deadline_for_groups < now
            ]
        ):
            raise ValidationError('All times should be in the future')

        if self.actual_application_deadline < self.visible_from:
            raise ValidationError('Visible from should be before application deadline')

        if self.actual_application_deadline < self.shown_application_deadline:
            raise ValidationError('Shown application deadline should be before the actual application deadline')

        if self.reprioritization_deadline_for_applicant < self.actual_application_deadline:
            raise ValidationError('Actual application deadline should be before reprioritization deadline for applicants')

        if self.reprioritization_deadline_for_groups < self.reprioritization_deadline_for_applicant:
            raise ValidationError('Reprioritization deadline for applicants should be before reprioritization deadline for groups')

    def __str__(self) -> str:
        return f'Recruitment: {self.name_en} at {self.organization}'


class RecruitmentPosition(FullCleanSaveMixin):
    name_nb = models.CharField(max_length=100, help_text='Name of the position')
    name_en = models.CharField(max_length=100, help_text='Name of the position')

    short_description_nb = models.CharField(max_length=100, help_text='Short description of the position')
    short_description_en = models.CharField(max_length=100, help_text='Short description of the position', null=True, blank=True)

    long_description_nb = models.TextField(help_text='Long description of the position')
    long_description_en = models.TextField(help_text='Long description of the position', null=True, blank=True)

    is_funksjonaer_position = models.BooleanField(help_text='Is this a funksjonær position?')

    default_admission_letter_nb = models.TextField(help_text='Default admission letter for the position')
    default_admission_letter_en = models.TextField(help_text='Default admission letter for the position', null=True, blank=True)

    norwegian_applicants_only = models.BooleanField(help_text='Is this position only for Norwegian applicants?', default=False)

    gang = models.ForeignKey(to=Gang, on_delete=models.CASCADE, help_text='The gang that is recruiting')
    recruitment = models.ForeignKey(
        Recruitment,
        on_delete=models.CASCADE,
        help_text='The recruitment that is recruiting',
        related_name='positions',
        null=True,
        blank=True,
    )

    shared_interview_positions = models.ManyToManyField('self', symmetrical=True, blank=True, help_text='Positions with shared interview')

    # TODO: Implement tag functionality
    tags = models.CharField(max_length=100, help_text='Tags for the position')

    # TODO: Implement interviewer functionality
    interviewers = models.ManyToManyField(to=User, help_text='Interviewers for the position', blank=True, related_name='interviewers')

    def __str__(self) -> str:
        return f'Position: {self.name_en} in {self.recruitment}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        if self.norwegian_applicants_only:
            self.name_en = 'Norwegian speaking applicants only'
            self.short_description_en = 'This position only admits Norwegian speaking applicants'
            self.long_description_en = 'No english applicants'
            self.default_admission_letter_en = 'No english applicants'
        super(RecruitmentPosition, self).save(*args, **kwargs)


class InterviewRoom(FullCleanSaveMixin):
    name = models.CharField(max_length=255, help_text='Name of the room')
    location = models.CharField(max_length=255, help_text='Physical location, eg. campus')
    start_time = models.DateTimeField(help_text='Start time of availability')
    end_time = models.DateTimeField(help_text='End time of availability')
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='The recruitment that is recruiting', related_name='rooms')
    gang = models.ForeignKey(to=Gang, on_delete=models.CASCADE, help_text='The gang that booked the room', related_name='rooms', blank=True, null=True)

    def __str__(self) -> str:
        return self.name

    def clean(self) -> None:
        super().clean()

        if self.start_time > self.end_time:
            raise ValidationError('Start time should be before end time')


class Interview(FullCleanSaveMixin):
    # User visible fields
    interview_time = models.DateTimeField(help_text='The time of the interview', null=True, blank=True)
    interview_location = models.CharField(max_length=255, help_text='The location of the interview', null=True, blank=True)

    # Admin visible fields
    room = models.ForeignKey(
        InterviewRoom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text='Room where the interview is held',
        related_name='interviews',
    )
    notes = models.TextField(help_text='Notes for the interview', null=True, blank=True)


class RecruitmentAdmission(FullCleanSaveMixin):
    admission_text = models.TextField(help_text='Admission text for the admission')
    recruitment_position = models.ForeignKey(
        RecruitmentPosition, on_delete=models.CASCADE, help_text='The recruitment position that is recruiting', related_name='admissions'
    )
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='The recruitment that is recruiting', related_name='admissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='The user that is applying', related_name='admissions')
    applicant_priority = models.IntegerField(help_text='The priority of the admission')

    interview = models.ForeignKey(
        Interview, on_delete=models.SET_NULL, null=True, blank=True, help_text='The interview for the admission', related_name='admissions'
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

    def __str__(self) -> str:
        return f'Admission: {self.user} for {self.recruitment_position} in {self.recruitment}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        """
        If the admission is saved without an interview, try to find an interview from a shared position.
        """
        if not self.recruitment:
            self.recruitment = self.recruitment_position.recruitment
        if not self.interview:
            # Check if there is already an interview for the same user in shared positions
            shared_interview_positions = self.recruitment_position.shared_interview_positions.all()
            shared_interview = RecruitmentAdmission.objects.filter(user=self.user,
                                                                   recruitment_position__in=shared_interview_positions).exclude(interview=None).first()

            if shared_interview:
                self.interview = shared_interview.interview
            else:
                # Create a new interview instance if needed
                self.interview = Interview.objects.create()

        super().save(*args, **kwargs)


class Occupiedtimeslot(FullCleanSaveMixin):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        help_text='Occupied timeslots for user',
        related_name='occupied_timeslots',
    )
    # Mostly only used for deletion, and anonymization.
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='Occupied timeslots for the users for this recruitment')

    # Start and end time of availability
    start_dt = models.DateTimeField(help_text='The time of the interview', null=False, blank=False)
    end_dt = models.DateTimeField(help_text='The time of the interview', null=False, blank=False)


class RecruitmentStatistics(FullCleanSaveMixin):
    recruitment = models.OneToOneField(Recruitment, on_delete=models.CASCADE, blank=True, null=True, related_name='statistics')

    total_applicants = models.PositiveIntegerField(null=True, blank=True, verbose_name='Total applicants')
    total_admissions = models.PositiveIntegerField(null=True, blank=True, verbose_name='Total admissions')

    def save(self, *args: tuple, **kwargs: dict) -> None:
        # TODO make uneditable/unsavable after being anonymized

        self.total_admissions = self.recruitment.admissions.count()
        self.total_applicants = self.recruitment.admissions.values('user').distinct().count()

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'{self.recruitment} stats'
