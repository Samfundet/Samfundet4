#
# This file contains models spesific to the recruitment system
#

from __future__ import annotations

from django.db import models


class Recruitment(models.Model):

    ORGANIZATION_CHOICES = (
        ('samfundet', 'Samfundet'),
        ('isfit', 'ISFiT'),
        ('uka', 'UKA'),
    )

    name = models.CharField(max_length=100, help_text='Name of the recruitment')
    visible_from = models.DateTimeField(help_text='When it becomes visible for applicants')
    actual_application_deadline = models.DateTimeField(
        help_text='Last point an application can be sent, typically a bit after the shown deadline to avoid getting a lot of extra mail'
    )
    shown_application_deadline = models.DateTimeField(help_text='The deadline that is shown to applicants')
    reprioritization_deadline_for_applicant = models.DateTimeField(help_text='Before allocation meeting')
    reprioritization_deadline_for_groups = models.DateTimeField(help_text='Reprioritization deadline for groups')
    organization = models.CharField(max_length=10, choices=ORGANIZATION_CHOICES, help_text='Organization')

    class Meta:
        unique_together = ('organization', )
