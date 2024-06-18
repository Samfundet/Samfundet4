#
# This file contains models spesific to the recruitment system
#
from __future__ import annotations

import uuid
from collections import defaultdict

from django.db import models, transaction
from django.utils import timezone
from django.db.models import QuerySet
from django.core.exceptions import ValidationError

from root.utils.mixins import CustomBaseModel, FullCleanSaveMixin

from .general import Gang, User, Campus, Organization
from .model_choices import RecruitmentStatusChoices, RecruitmentApplicantStates, RecruitmentPriorityChoices


class Recruitment(CustomBaseModel):
    name_nb = models.CharField(max_length=100, help_text='Name of the recruitment')
    name_en = models.CharField(max_length=100, help_text='Name of the recruitment')
    visible_from = models.DateTimeField(null=False, blank=False, help_text='When it becomes visible for applicants')
    actual_application_deadline = models.DateTimeField(
        null=False,
        blank=False,
        help_text='Last point an application can be sent, typically a bit after the shown deadline to avoid getting a lot of extra mail',
    )
    shown_application_deadline = models.DateTimeField(null=False, blank=False, help_text='The deadline that is shown to applicants')
    reprioritization_deadline_for_applicant = models.DateTimeField(null=False, blank=False, help_text='Before allocation meeting')
    reprioritization_deadline_for_groups = models.DateTimeField(null=False, blank=False, help_text='Reprioritization deadline for groups')
    organization = models.ForeignKey(null=False, blank=False, to=Organization, on_delete=models.CASCADE, help_text='The organization that is recruiting')

    max_admissions = models.PositiveIntegerField(null=True, blank=True, verbose_name='Max admissions per applicant')

    def is_active(self) -> bool:
        return self.visible_from < timezone.now() < self.actual_application_deadline

    def update_stats(self) -> None:
        created = RecruitmentStatistics.objects.get_or_create(recruitment=self)[1]
        if not created:
            self.statistics.save()

    def clean(self, *args: tuple, **kwargs: dict) -> None:  # noqa: C901
        super().clean()
        errors: dict[str, list[ValidationError]] = defaultdict(list)
        # All times should be in the future.
        now = timezone.now()

        for field in [
            'actual_application_deadline',
            'shown_application_deadline',
            'reprioritization_deadline_for_applicant',
            'reprioritization_deadline_for_groups',
        ]:
            if getattr(self, field) < now:
                errors[field].append(self.NOT_IN_FUTURE_ERROR)

        if self.actual_application_deadline < self.visible_from:
            errors['actual_application_deadline'].append(self.SHOWN_BEFORE_VISIBLE_ERROR)
            errors['visible_from'].append(self.VISIBLE_AFTER_SHOWN_ERROR)

        if self.actual_application_deadline < self.shown_application_deadline:
            errors['actual_application_deadline'].append(self.ACTUAL_BEFORE_SHOWN_ERROR)
            errors['shown_application_deadline'].append(self.SHOWN_AFTER_ACTUAL_ERROR)

        if self.reprioritization_deadline_for_applicant < self.actual_application_deadline:
            errors['reprioritization_deadline_for_applicant'].append(self.REPRIORITIZATION_BEFORE_ACTUAL)
            errors['actual_application_deadline'].append(self.ACTUAL_AFTER_REPRIORITIZATION)

        if self.reprioritization_deadline_for_groups < self.reprioritization_deadline_for_applicant:
            errors['reprioritization_deadline_for_groups'].append(self.REPRIORITIZATION_GROUP_BEFORE_APPLICANT)
            errors['reprioritization_deadline_for_applicant'].append(self.REPRIORITIZATION_APPLICANT_AFTER_GROUP)

        raise ValidationError(errors)

    # Error messages
    NOT_IN_FUTURE_ERROR = 'Time should be in the future'
    SHOWN_BEFORE_VISIBLE_ERROR = 'Shown application deadline should be after visible'
    VISIBLE_AFTER_SHOWN_ERROR = 'Visible from should be before shown application deadline'
    ACTUAL_BEFORE_SHOWN_ERROR = 'Actual application deadline should be after the shown application deadline'
    SHOWN_AFTER_ACTUAL_ERROR = 'Shown application deadline should be before the actual application deadline'
    REPRIORITIZATION_BEFORE_ACTUAL = 'Reprioritization application deadline should be after actual deadline for applicants'
    ACTUAL_AFTER_REPRIORITIZATION = 'Actual application deadline should be before reprioritization deadline for applicants'
    REPRIORITIZATION_GROUP_BEFORE_APPLICANT = 'Reprioritization deadline for groups should be after reprioritization deadline for applicants'
    REPRIORITIZATION_APPLICANT_AFTER_GROUP = 'Reprioritization deadline for applicants should be before reprioritization deadline for groups'

    def __str__(self) -> str:
        return f'Recruitment: {self.name_en} at {self.organization}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        super().save(*args, **kwargs)
        if not self.statistics:
            RecruitmentStatistics.objects.create(self)


class RecruitmentPosition(CustomBaseModel):
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
        super().save(*args, **kwargs)


class RecruitmentSeperatePosition(CustomBaseModel):
    name_nb = models.CharField(max_length=100, help_text='Name of the position')
    name_en = models.CharField(max_length=100, help_text='Name of the position')

    url = models.URLField(help_text='URL to website of seperate recruitment')

    recruitment = models.ForeignKey(
        Recruitment,
        on_delete=models.CASCADE,
        help_text='The recruitment that is recruiting',
        related_name='seperate_positions',
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f'Seperate recruitment: {self.name_nb} ({self.recruitment})'


class InterviewRoom(CustomBaseModel):
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


class Interview(CustomBaseModel):
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
    interviewers = models.ManyToManyField(to='samfundet.User', help_text='Interviewers for this interview', blank=True, related_name='interviews')
    notes = models.TextField(help_text='Notes for the interview', null=True, blank=True)


class RecruitmentAdmission(CustomBaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admission_text = models.TextField(help_text='Admission text for the admission')
    recruitment_position = models.ForeignKey(
        RecruitmentPosition, on_delete=models.CASCADE, help_text='The recruitment position that is recruiting', related_name='admissions'
    )
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='The recruitment that is recruiting', related_name='admissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='The user that is applying', related_name='admissions')
    applicant_priority = models.PositiveIntegerField(null=True, blank=True, help_text='The priority of the admission')

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)

    interview = models.ForeignKey(
        Interview, on_delete=models.SET_NULL, null=True, blank=True, help_text='The interview for the admission', related_name='admissions'
    )

    withdrawn = models.BooleanField(default=False, blank=True, null=True)
    # TODO: Important that the following is not sent along with the rest of the object whenever a user retrieves its admission
    recruiter_priority = models.IntegerField(
        choices=RecruitmentPriorityChoices.choices, default=RecruitmentPriorityChoices.NOT_SET, help_text='The priority of the admission'
    )

    recruiter_status = models.IntegerField(
        choices=RecruitmentStatusChoices.choices, default=RecruitmentStatusChoices.NOT_SET, help_text='The status of the admission'
    )

    applicant_state = models.IntegerField(
        choices=RecruitmentApplicantStates.choices, default=RecruitmentApplicantStates.NOT_SET, help_text='The state of the applicant for the recruiter'
    )

    def organize_priorities(self) -> None:
        """Organizes priorites from 1 to n, so that it is sequential with no gaps"""
        admissions_for_user = RecruitmentAdmission.objects.filter(recruitment=self.recruitment, user=self.user).order_by('applicant_priority')
        for i in range(len(admissions_for_user)):
            correct_position = i + 1
            if admissions_for_user[i].applicant_priority != correct_position:
                admissions_for_user[i].applicant_priority = correct_position
                admissions_for_user[i].save()

    def update_priority(self, direction: int) -> None:
        """
        Method for moving priorites up or down,
        positive direction indicates moving it to higher priority,
        negative direction indicates moving it to lower priority,
        can move n positions up or down

        """
        # Use order for more simple an unified for direction
        ordering = f"{'' if direction < 0 else '-' }applicant_priority"
        admissions_for_user = RecruitmentAdmission.objects.filter(recruitment=self.recruitment, user=self.user).order_by(ordering)
        direction = abs(direction)  # convert to absolute
        for i in range(len(admissions_for_user)):
            if admissions_for_user[i].id == self.id:  # find current
                # Find index of which to switch  priority with
                switch = len(admissions_for_user) - 1 if i + direction >= len(admissions_for_user) else i + direction
                new_priority = admissions_for_user[switch].applicant_priority
                # Move priorites down in direction
                for ii in range(switch, i, -1):
                    admissions_for_user[ii].applicant_priority = admissions_for_user[ii - 1].applicant_priority
                    admissions_for_user[ii].save()
                # update priority
                admissions_for_user[i].applicant_priority = new_priority
                admissions_for_user[i].save()
                break
        self.organize_priorities()

    TOO_MANY_ADMISSIONS_ERROR = 'Too many admissions for recruitment'

    def clean(self, *args: tuple, **kwargs: dict) -> None:
        super().clean()
        errors: dict[str, list[ValidationError]] = defaultdict(list)

        # If there is max admissions, check if applicant have applied to not to many
        # Cant use not self.pk, due to UUID generating it before save.
        if self.recruitment.max_admissions and not RecruitmentAdmission.objects.filter(pk=self.pk).first():
            user_admissions_count = RecruitmentAdmission.objects.filter(user=self.user, recruitment=self.recruitment, withdrawn=False).count()
            if user_admissions_count >= self.recruitment.max_admissions:
                errors['recruitment'].append(self.TOO_MANY_ADMISSIONS_ERROR)

        raise ValidationError(errors)

    def __str__(self) -> str:
        return f'Admission: {self.user} for {self.recruitment_position} in {self.recruitment}'

    def save(self, *args: tuple, **kwargs: dict) -> None:  # noqa: C901
        """
        If the admission is saved without an interview,
        try to find an interview from a shared position.
        """
        if not self.recruitment:
            self.recruitment = self.recruitment_position.recruitment
        # If the admission is saved without an interview, try to find an interview from a shared position.
        if not self.applicant_priority:
            self.organize_priorities()
            current_applications_count = RecruitmentAdmission.objects.filter(user=self.user, recruitment=self.recruitment).count()
            # Set the applicant_priority to the number of applications + 1 (for the current application)
            self.applicant_priority = current_applications_count + 1
        # If the admission is saved without an interview, try to find an interview from a shared position.
        if self.withdrawn:
            self.recruiter_priority = RecruitmentPriorityChoices.NOT_WANTED
            self.recruiter_status = RecruitmentStatusChoices.AUTOMATIC_REJECTION
        if not self.interview:
            # Check if there is already an interview for the same user in shared positions
            shared_interview_positions = self.recruitment_position.shared_interview_positions.all()
            shared_interview = (
                RecruitmentAdmission.objects.filter(user=self.user, recruitment_position__in=shared_interview_positions).exclude(interview=None).first()
            )

            if shared_interview:
                self.interview = shared_interview.interview
            else:
                # Create a new interview instance if needed
                self.interview = Interview.objects.create()
        # Auto set not wanted when withdrawn

        super().save(*args, **kwargs)

    def update_applicant_state(self) -> QuerySet[RecruitmentAdmission]:
        admissions = RecruitmentAdmission.objects.filter(user=self.user, recruitment=self.recruitment).order_by('applicant_priority')
        # Get top priority
        top_wanted = admissions.filter(recruiter_priority=RecruitmentPriorityChoices.WANTED).order_by('applicant_priority').first()
        top_reserved = admissions.filter(recruiter_priority=RecruitmentPriorityChoices.RESERVE).order_by('applicant_priority').first()
        with transaction.atomic():
            for adm in admissions:
                # I hate conditionals, so instead of checking all forms of condtions
                # I use memory array indexing formula (col+row_size*row) for matrixes, to index into state
                has_priority = 0
                if top_reserved and top_reserved.applicant_priority < adm.applicant_priority:
                    has_priority = 1
                if top_wanted and top_wanted.applicant_priority < adm.applicant_priority:
                    has_priority = 2
                adm.applicant_state = adm.recruiter_priority + 3 * has_priority
                if adm.recruiter_priority == RecruitmentPriorityChoices.NOT_WANTED:
                    adm.applicant_state = RecruitmentApplicantStates.NOT_WANTED
                adm.save()


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
        self.total_admissions = self.recruitment.admissions.count()
        self.total_applicants = self.recruitment.admissions.values('user').distinct().count()
        super().save(*args, **kwargs)
        self.generate_time_stats()
        self.generate_date_stats()
        self.generate_campus_stats()

    def __str__(self) -> str:
        return f'{self.recruitment} stats'

    def generate_time_stats(self) -> None:
        for h in range(0, 24):
            time_stat, created = RecruitmentTimeStat.objects.get_or_create(recruitment_stats=self, hour=h)
            if not created:
                time_stat.save()

    def generate_date_stats(self) -> None:
        date = self.recruitment.visible_from
        while date < self.recruitment.actual_application_deadline:
            date_stat, created = RecruitmentDateStat.objects.get_or_create(recruitment_stats=self, date=date.strftime('%Y-%m-%d'))
            if not created:
                date_stat.save()
            date += timezone.timedelta(days=1)

    def generate_campus_stats(self) -> None:
        for campus in Campus.objects.all():
            campus_stat, created = RecruitmentCampusStat.objects.get_or_create(recruitment_stats=self, campus=campus)
            if not created:
                campus_stat.save()


class RecruitmentTimeStat(models.Model):
    recruitment_stats = models.ForeignKey(RecruitmentStatistics, on_delete=models.CASCADE, blank=False, null=False, related_name='time_stats')
    hour = models.PositiveIntegerField(null=False, blank=False, verbose_name='Time')
    count = models.PositiveIntegerField(null=False, blank=False, verbose_name='Count')

    def __str__(self) -> str:
        return f'{self.recruitment_stats} {self.hour} {self.count}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        count = 0
        for admission in self.recruitment_stats.recruitment.admissions.all():
            if admission.created_at.hour == self.hour:
                count += 1
        self.count = count
        super().save(*args, **kwargs)


class RecruitmentDateStat(models.Model):
    recruitment_stats = models.ForeignKey(RecruitmentStatistics, on_delete=models.CASCADE, blank=False, null=False, related_name='date_stats')
    date = models.DateField(null=False, blank=False, verbose_name='Time')
    count = models.PositiveIntegerField(null=False, blank=False, verbose_name='Count')

    def __str__(self) -> str:
        return f'{self.recruitment_stats} {self.date} {self.count}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        count = 0
        for admission in self.recruitment_stats.recruitment.admissions.all():
            if admission.created_at.date() == self.date:
                count += 1
        self.count = count
        super().save(*args, **kwargs)


class RecruitmentCampusStat(models.Model):
    recruitment_stats = models.ForeignKey(RecruitmentStatistics, on_delete=models.CASCADE, blank=False, null=False, related_name='campus_stats')
    campus = models.ForeignKey(Campus, on_delete=models.CASCADE, blank=False, null=False, related_name='date_stats')

    count = models.PositiveIntegerField(null=False, blank=False, verbose_name='Count')

    def __str__(self) -> str:
        return f'{self.recruitment_stats} {self.campus} {self.count}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        self.count = User.objects.filter(
            id__in=self.recruitment_stats.recruitment.admissions.values_list('user', flat=True).distinct(), campus=self.campus
        ).count()
        super().save(*args, **kwargs)
