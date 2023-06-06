#
# This file contains models spesific to the recruitment system
#

from __future__ import annotations
from django.core.exceptions import ValidationError
from django.utils import timezone

from django.db import models

from .general import Organization


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
