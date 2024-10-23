#
# This file contains models spesific to the recruitment system
#
from __future__ import annotations

import uuid
from collections import defaultdict

from django.db import models, transaction
from django.utils import timezone
from django.core.exceptions import ValidationError

from root.utils.mixins import CustomBaseModel, FullCleanSaveMixin

from .general import Gang, User, Campus, GangSection, Organization
from .model_choices import RecruitmentStatusChoices, RecruitmentApplicantStates, RecruitmentPriorityChoices
from .utils.genrate_random_color import generate_random_hex_color


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

    max_applications = models.PositiveIntegerField(null=True, blank=True, verbose_name='Max applications per applicant')

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.organization_id
        return self.organization

    def recruitment_progress(self) -> float:
        applications = RecruitmentApplication.objects.filter(recruitment=self)
        if applications.count() == 0:
            return 1
        return applications.exclude(recruiter_status=RecruitmentStatusChoices.NOT_SET).count() / applications.count()

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


class RecruitmentPositionTag(CustomBaseModel):
    name = models.CharField(max_length=15, primary_key=True, help_text='Tags for the position')
    color = models.CharField(max_length=7, null=True, blank=True)

    def save(self, *args: tuple, **kwargs: dict) -> None:
        if not self.color:
            self.color = generate_random_hex_color()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class RecruitmentPositionSharedInterviewGroup(CustomBaseModel):
    recruitment = models.ForeignKey(
        Recruitment,
        on_delete=models.CASCADE,
        help_text='The recruitment that is recruiting',
        related_name='interview_groups',
        null=False,
        blank=True,
    )

    def __str__(self) -> str:
        return f'{self.recruitment} Interviewgroup {self.id}'


class RecruitmentPosition(CustomBaseModel):
    name_nb = models.CharField(max_length=100, help_text='Name of the position')
    name_en = models.CharField(max_length=100, help_text='Name of the position')

    short_description_nb = models.CharField(max_length=100, help_text='Short description of the position')
    short_description_en = models.CharField(max_length=100, help_text='Short description of the position', null=True, blank=True)

    long_description_nb = models.TextField(help_text='Long description of the position')
    long_description_en = models.TextField(help_text='Long description of the position', null=True, blank=True)

    is_funksjonaer_position = models.BooleanField(help_text='Is this a funksjonær position?')

    default_application_letter_nb = models.TextField(help_text='Default application letter for the position')
    default_application_letter_en = models.TextField(help_text='Default application letter for the position', null=True, blank=True)

    norwegian_applicants_only = models.BooleanField(help_text='Is this position only for Norwegian applicants?', default=False)

    gang = models.ForeignKey(to=Gang, on_delete=models.CASCADE, help_text='The gang that is recruiting', null=True, blank=True)
    section = models.ForeignKey(GangSection, on_delete=models.CASCADE, help_text='The section that is recruiting', null=True, blank=True)

    recruitment = models.ForeignKey(
        Recruitment,
        on_delete=models.CASCADE,
        help_text='The recruitment that is recruiting',
        related_name='positions',
        null=True,
        blank=True,
    )

    shared_interview_group = models.ForeignKey(
        RecruitmentPositionSharedInterviewGroup,
        null=True,
        blank=True,
        related_name='positions',
        on_delete=models.SET_NULL,
        help_text='Shared interviewgroup for position',
    )

    tags = models.ManyToManyField(
        RecruitmentPositionTag,
        help_text='tags associated with this position',
        related_name='position_tags',
        blank=True,
    )

    # TODO: Implement interviewer functionality
    interviewers = models.ManyToManyField(to=User, help_text='Interviewers for the position', blank=True, related_name='interviewers')

    def resolve_section(self, *, return_id: bool = False) -> GangSection | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.section_id
        return self.section

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.gang_id
        return self.gang

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.gang.resolve_org(return_id=return_id)

    def __str__(self) -> str:
        return f'Position: {self.name_en} in {self.recruitment}'

    def clean(self) -> None:
        super().clean()

        if (self.gang and self.section) or not (self.gang or self.section):
            raise ValidationError('Position must be owned by either gang or section, not both')

    def save(self, *args: tuple, **kwargs: dict) -> None:
        if self.norwegian_applicants_only:
            self.name_en = 'Norwegian speaking applicants only'
            self.short_description_en = 'This position only admits Norwegian speaking applicants'
            self.long_description_en = 'No english applicants'
            self.default_application_letter_en = 'No english applicants'
        super().save(*args, **kwargs)


class RecruitmentSeparatePosition(CustomBaseModel):
    name_nb = models.CharField(max_length=100, help_text='Name of the position')
    name_en = models.CharField(max_length=100, help_text='Name of the position')
    description_nb = models.CharField(max_length=100, help_text='Short description of the position (NB)', null=True, blank=True)
    description_en = models.CharField(max_length=100, help_text='Short description of the position (EN)', null=True, blank=True)

    url = models.URLField(help_text='URL to website of separate recruitment')

    recruitment = models.ForeignKey(
        Recruitment,
        on_delete=models.CASCADE,
        help_text='The recruitment that is recruiting',
        related_name='separate_positions',
        null=True,
        blank=True,
    )

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment.resolve_org(return_id=return_id)

    def __str__(self) -> str:
        return f'Separate recruitment: {self.name_nb} ({self.recruitment})'


class InterviewRoom(CustomBaseModel):
    name = models.CharField(max_length=255, help_text='Name of the room')
    location = models.CharField(max_length=255, help_text='Physical location, eg. campus')
    start_time = models.DateTimeField(help_text='Start time of availability')
    end_time = models.DateTimeField(help_text='End time of availability')
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='The recruitment that is recruiting', related_name='rooms')
    gang = models.ForeignKey(to=Gang, on_delete=models.CASCADE, help_text='The gang that booked the room', related_name='rooms', blank=True, null=True)

    def __str__(self) -> str:
        return self.name

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment.resolve_org(return_id=return_id)

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.gang_id
        return self.gang

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

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.room.resolve_org(return_id=return_id)

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int:
        return self.room.resolve_gang(return_id=return_id)


class RecruitmentApplication(CustomBaseModel):
    # UUID so that applicants cannot see recruitment info with their own id number
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application_text = models.TextField(help_text='Application text')
    recruitment_position = models.ForeignKey(
        RecruitmentPosition, on_delete=models.CASCADE, help_text='The position which is recruiting', related_name='applications'
    )
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='The recruitment that is recruiting', related_name='applications')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='The user that is applying', related_name='applications')
    applicant_priority = models.PositiveIntegerField(null=True, blank=True, help_text='The priority of the application')

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)

    # Foreign Key because UKA and KSG have shared interviews (multiple applications share the same interview)
    interview = models.ForeignKey(
        Interview, on_delete=models.SET_NULL, null=True, blank=True, help_text='The interview for the application', related_name='applications'
    )
    withdrawn = models.BooleanField(default=False, blank=True, null=True)
    # TODO: Important that the following is not sent along with the rest of the object whenever a user retrieves its application
    recruiter_priority = models.IntegerField(
        choices=RecruitmentPriorityChoices.choices, default=RecruitmentPriorityChoices.NOT_SET, help_text='The priority of the application'
    )

    recruiter_status = models.IntegerField(
        choices=RecruitmentStatusChoices.choices, default=RecruitmentStatusChoices.NOT_SET, help_text='The status of the application'
    )

    applicant_state = models.IntegerField(
        choices=RecruitmentApplicantStates.choices, default=RecruitmentApplicantStates.NOT_SET, help_text='The state of the applicant for the recruiter'
    )

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment.resolve_org(return_id=return_id)

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int:
        return self.recruitment_position.resolve_gang(return_id=return_id)

    def organize_priorities(self) -> None:
        """Organizes priorites from 1 to n, so that it is sequential with no gaps"""
        applications_for_user = RecruitmentApplication.objects.filter(recruitment=self.recruitment, user=self.user).order_by('applicant_priority')
        for i in range(len(applications_for_user)):
            correct_position = i + 1
            if applications_for_user[i].applicant_priority != correct_position:
                applications_for_user[i].applicant_priority = correct_position
                applications_for_user[i].save()

    def update_priority(self, direction: int) -> None:
        """
        Method for moving priorites up or down,
        positive direction indicates moving it to higher priority,
        negative direction indicates moving it to lower priority,
        can move n positions up or down

        """
        # Use order for more simple an unified for direction
        ordering = f"{'' if direction < 0 else '-' }applicant_priority"
        applications_for_user = RecruitmentApplication.objects.filter(recruitment=self.recruitment, user=self.user).order_by(ordering)
        direction = abs(direction)  # convert to absolute
        for i in range(len(applications_for_user)):
            if applications_for_user[i].id == self.id:  # find current
                # Find index of which to switch  priority with
                switch = len(applications_for_user) - 1 if i + direction >= len(applications_for_user) else i + direction
                new_priority = applications_for_user[switch].applicant_priority
                # Move priorites down in direction
                for ii in range(switch, i, -1):
                    applications_for_user[ii].applicant_priority = applications_for_user[ii - 1].applicant_priority
                    applications_for_user[ii].save()
                # update priority
                applications_for_user[i].applicant_priority = new_priority
                applications_for_user[i].save()
                break
        self.organize_priorities()

    REAPPLY_TOO_MANY_APPLICATIONS_ERROR = 'Can not reapply application, too many active application'
    TOO_MANY_APPLICATIONS_ERROR = 'Too many applications for recruitment'

    def clean(self, *args: tuple, **kwargs: dict) -> None:
        super().clean()
        errors: dict[str, list[ValidationError]] = defaultdict(list)

        # If there is max applications, check if applicant have applied to not to many
        # Cant use not self.pk, due to UUID generating it before save.
        if self.recruitment.max_applications:
            user_applications_count = RecruitmentApplication.objects.filter(user=self.user, recruitment=self.recruitment, withdrawn=False).count()
            current_application = RecruitmentApplication.objects.filter(pk=self.pk).first()
            if user_applications_count >= self.recruitment.max_applications:
                if not current_application:
                    # attempts to create new application when too many applications
                    errors['recruitment'].append(self.TOO_MANY_APPLICATIONS_ERROR)
                elif current_application.withdrawn and not self.withdrawn:
                    # If it attempts to withdraw, when to many active applications
                    errors['recruitment'].append(self.REAPPLY_TOO_MANY_APPLICATIONS_ERROR)
        raise ValidationError(errors)

    def __str__(self) -> str:
        return f'Application: {self.user} for {self.recruitment_position} in {self.recruitment}'

    def save(self, *args: tuple, **kwargs: dict) -> None:  # noqa: C901
        """
        If the application is saved without an interview,
        try to find an interview from a shared position.
        """
        if not self.recruitment:
            self.recruitment = self.recruitment_position.recruitment
        # If the application is saved without an interview, try to find an interview from a shared position.
        if not self.applicant_priority:
            self.organize_priorities()
            current_applications_count = RecruitmentApplication.objects.filter(user=self.user, recruitment=self.recruitment).count()
            # Set the applicant_priority to the number of applications + 1 (for the current application)
            self.applicant_priority = current_applications_count + 1
        # If the application is saved without an interview, try to find an interview from a shared position.
        if self.withdrawn:
            self.recruiter_priority = RecruitmentPriorityChoices.NOT_WANTED
            self.recruiter_status = RecruitmentStatusChoices.AUTOMATIC_REJECTION
        if not self.interview and self.recruitment_position.shared_interview_group:
            shared_interview = (
                RecruitmentApplication.objects.filter(user=self.user, recruitment_position__in=self.recruitment_position.shared_interview_group.positions.all())
                .exclude(interview=None)
                .first()
            )
            if shared_interview:
                self.interview = shared_interview.interview

        super().save(*args, **kwargs)

    def get_total_interviews(self) -> int:
        return RecruitmentApplication.objects.filter(user=self.user, recruitment=self.recruitment, withdrawn=False).exclude(interview=None).count()

    def get_total_applications(self) -> int:
        return RecruitmentApplication.objects.filter(user=self.user, recruitment=self.recruitment, withdrawn=False).count()

    def update_applicant_state(self) -> None:
        applications = RecruitmentApplication.objects.filter(user=self.user, recruitment=self.recruitment).order_by('applicant_priority')
        # Get top priority
        top_wanted = applications.filter(recruiter_priority=RecruitmentPriorityChoices.WANTED).order_by('applicant_priority').first()
        top_reserved = applications.filter(recruiter_priority=RecruitmentPriorityChoices.RESERVE).order_by('applicant_priority').first()
        with transaction.atomic():
            for application in applications:
                # I hate conditionals, so instead of checking all forms of condtions
                # I use memory array indexing formula (col+row_size*row) for matrixes, to index into state
                has_priority = 0
                if top_reserved and top_reserved.applicant_priority < application.applicant_priority:
                    has_priority = 1
                if top_wanted and top_wanted.applicant_priority < application.applicant_priority:
                    has_priority = 2
                application.applicant_state = application.recruiter_priority + 3 * has_priority
                if application.recruiter_priority == RecruitmentPriorityChoices.NOT_WANTED:
                    application.applicant_state = RecruitmentApplicantStates.NOT_WANTED
                application.save()


class RecruitmentInterviewAvailability(CustomBaseModel):
    """This models all possible times for interviews for the given recruitment.

    If position is null, this instance will be used to display the possible timeslots applicants may mark as
    unavailable. There must only exist one such instance per recruitment. If position is set, this will be used for the
    automatic interview booking logic.
    """

    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='Which recruitment this availability applies to')
    position = models.ForeignKey(RecruitmentPosition, on_delete=models.CASCADE, help_text='Which position this availability applies to', null=True, blank=True)
    start_date = models.DateField(help_text='First possible date for interviews', null=False, blank=False)
    end_date = models.DateField(help_text='Last possible date for interviews', null=False, blank=False)
    start_time = models.TimeField(help_text='First possible time of day for interviews', default='08:00:00', null=False, blank=False)
    end_time = models.TimeField(help_text='Last possible time of day for interviews', default='23:00:00', null=False, blank=False)
    timeslot_interval = models.PositiveSmallIntegerField(help_text='The time interval (in minutes) between each timeslot', default=30)

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment.resolve_org(return_id=return_id)


class OccupiedTimeslot(FullCleanSaveMixin):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        help_text='Occupied timeslots for user',
        related_name='occupied_timeslots',
    )
    # Mostly only used for deletion, and anonymization.
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE, help_text='Which recruitment this occupancy applies to')

    # Start and end time of availability
    start_dt = models.DateTimeField(help_text='Start of occupied time', null=False, blank=False)
    end_dt = models.DateTimeField(help_text='End of occupied time', null=False, blank=False)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'recruitment', 'start_dt', 'end_dt'], name='occupied_UNIQ')]

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment.resolve_org(return_id=return_id)


class RecruitmentStatistics(FullCleanSaveMixin):
    recruitment = models.OneToOneField(Recruitment, on_delete=models.CASCADE, blank=True, null=True, related_name='statistics')

    total_applicants = models.PositiveIntegerField(null=True, blank=True, verbose_name='Total applicants')
    total_applications = models.PositiveIntegerField(null=True, blank=True, verbose_name='Total applications')

    # Total withdrawn applications
    total_withdrawn = models.PositiveIntegerField(null=True, blank=True, verbose_name='Total Withdrawn applications')

    # Total accepted applicants
    total_accepted = models.PositiveIntegerField(null=True, blank=True, verbose_name='Total accepted applicants')

    # Average amount of different gangs an applicant applies for
    average_gangs_applied_to_per_applicant = models.FloatField(null=True, blank=True, verbose_name='Gang diversity')

    # Average amount of applications for an applicant
    average_applications_per_applicant = models.FloatField(null=True, blank=True, verbose_name='Gang diversity')

    def save(self, *args: tuple, **kwargs: dict) -> None:
        self.total_applications = self.recruitment.applications.count()
        self.total_applicants = self.recruitment.applications.values('user').distinct().count()
        self.total_withdrawn = self.recruitment.applications.filter(withdrawn=True).count()
        self.total_accepted = (
            self.recruitment.applications.filter(recruiter_status=RecruitmentStatusChoices.CALLED_AND_ACCEPTED).values('user').distinct().count()
        )
        if self.total_applicants > 0:
            self.average_gangs_applied_to_per_applicant = (
                self.recruitment.applications.values('user', 'recruitment_position__gang').distinct().count() / self.total_applicants
            )
            self.average_applications_per_applicant = self.total_applications / self.total_applicants if self.total_applicants > 0 else 0
        else:
            self.average_gangs_applied_to_per_applicant = 0
            self.average_applications_per_applicant = 0
        super().save(*args, **kwargs)
        self.generate_time_stats()
        self.generate_date_stats()
        self.generate_campus_stats()
        self.generate_gang_stats()

    def __str__(self) -> str:
        return f'{self.recruitment} stats'

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment.resolve_org(return_id=return_id)

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

    def generate_gang_stats(self) -> None:
        for gang in Gang.objects.filter(id__in=self.recruitment.positions.values_list('gang', flat=True)):
            gang_stat, created = RecruitmentGangStat.objects.get_or_create(recruitment_stats=self, gang=gang)
            if not created:
                gang_stat.save()


class RecruitmentTimeStat(models.Model):
    recruitment_stats = models.ForeignKey(RecruitmentStatistics, on_delete=models.CASCADE, blank=False, null=False, related_name='time_stats')
    hour = models.PositiveIntegerField(null=False, blank=False, verbose_name='Time')
    count = models.PositiveIntegerField(null=False, blank=False, verbose_name='Count')

    def __str__(self) -> str:
        return f'{self.recruitment_stats} {self.hour} {self.count}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        count = 0
        for application in self.recruitment_stats.recruitment.applications.all():
            if application.created_at.hour == self.hour:
                count += 1
        self.count = count
        super().save(*args, **kwargs)

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment_stats.resolve_org(return_id=return_id)


class RecruitmentDateStat(models.Model):
    recruitment_stats = models.ForeignKey(RecruitmentStatistics, on_delete=models.CASCADE, blank=False, null=False, related_name='date_stats')
    date = models.DateField(null=False, blank=False, verbose_name='Time')
    count = models.PositiveIntegerField(null=False, blank=False, verbose_name='Count')

    def __str__(self) -> str:
        return f'{self.recruitment_stats} {self.date} {self.count}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        count = 0
        for application in self.recruitment_stats.recruitment.applications.all():
            if application.created_at.date() == self.date:
                count += 1
        self.count = count
        super().save(*args, **kwargs)

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment_stats.resolve_org(return_id=return_id)


class RecruitmentCampusStat(models.Model):
    recruitment_stats = models.ForeignKey(RecruitmentStatistics, on_delete=models.CASCADE, blank=False, null=False, related_name='campus_stats')
    campus = models.ForeignKey(Campus, on_delete=models.CASCADE, blank=False, null=False, related_name='date_stats')

    count = models.PositiveIntegerField(null=False, blank=False, verbose_name='Count')
    applicant_percentage = models.PositiveIntegerField(null=True, blank=True, default=0, verbose_name='Percentages of enrolled students applied for campus')

    def __str__(self) -> str:
        return f'{self.recruitment_stats} {self.campus} {self.count}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        self.count = User.objects.filter(
            id__in=self.recruitment_stats.recruitment.applications.values_list('user', flat=True).distinct(), campus=self.campus
        ).count()
        self.applicant_percentage = self.count / (self.campus.total_students if self.campus.total_students else 1)
        super().save(*args, **kwargs)

    def normalized_applicant_percentage(self) -> float:
        applicant_percentages = list(
            RecruitmentCampusStat.objects.filter(recruitment_stats=self.recruitment_stats).values_list('applicant_percentage', flat=True)
        )
        max_percent = max(applicant_percentages)
        min_percent = min(applicant_percentages)
        if max_percent - min_percent == 0:
            return 0
        return (self.applicant_percentage - min_percent) / (max_percent - min_percent)

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.recruitment_stats.resolve_org(return_id=return_id)


class RecruitmentGangStat(models.Model):
    recruitment_stats = models.ForeignKey(RecruitmentStatistics, on_delete=models.CASCADE, blank=False, null=False, related_name='gang_stats')
    gang = models.ForeignKey(Gang, on_delete=models.CASCADE, blank=False, null=False, related_name='date_stats')

    application_count = models.PositiveIntegerField(null=False, blank=False, verbose_name='Count')
    applicant_count = models.PositiveIntegerField(null=False, blank=False, verbose_name='Count')

    average_priority = models.FloatField(null=True, blank=True, verbose_name='Average priority')
    total_accepted = models.PositiveIntegerField(null=True, blank=True, verbose_name='Total accepted')
    total_rejected = models.PositiveIntegerField(null=True, blank=True, verbose_name='Total called and rejected')

    def __str__(self) -> str:
        return f'{self.recruitment_stats} {self.gang} {self.application_count}'

    def save(self, *args: tuple, **kwargs: dict) -> None:
        applications = RecruitmentApplication.objects.filter(recruitment=self.recruitment_stats.recruitment, recruitment_position__gang=self.gang)
        self.application_count = applications.count()
        self.applicant_count = applications.values('user').distinct().count()

        self.average_priority = applications.aggregate(models.Avg('applicant_priority'))['applicant_priority__avg'] if len(applications) > 0 else 0
        self.total_accepted = applications.filter(recruiter_status=RecruitmentStatusChoices.CALLED_AND_ACCEPTED).values('user').distinct().count()
        self.total_rejected = applications.filter(recruiter_status=RecruitmentStatusChoices.CALLED_AND_REJECTED).values('user').distinct().count()
        super().save(*args, **kwargs)
