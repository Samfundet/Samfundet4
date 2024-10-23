from __future__ import annotations

import pytest

from django.utils import timezone
from django.core.exceptions import ValidationError

from samfundet.models.general import Gang, User, Campus, GangSection
from samfundet.models.recruitment import (
    Interview,
    Recruitment,
    Organization,
    RecruitmentPosition,
    RecruitmentApplication,
    RecruitmentPositionSharedInterviewGroup,
)
from samfundet.models.model_choices import RecruitmentStatusChoices, RecruitmentApplicantStates, RecruitmentPriorityChoices

datetime_fields_expecting_error = [
    # 'visible_from', # Allowed to be in the past.
    'actual_application_deadline',
    'shown_application_deadline',
    'reprioritization_deadline_for_applicant',
    'reprioritization_deadline_for_groups',
]


@pytest.fixture
def fixture_org():
    org = Organization.objects.create(name='Samf')
    yield org
    org.delete()


FUTURE_DAYS = 20


def _create_recruitment_with_dt(*, overrides: dict[str, timezone.datetime]) -> Recruitment:
    """Override fields with kwargs."""
    future = timezone.now() + timezone.timedelta(days=FUTURE_DAYS)

    fields = {field: future for field in datetime_fields_expecting_error}
    fields['visible_from'] = future
    fields.update(overrides)

    Recruitment.objects.create(
        **fields,
        name_nb='Navn',
        name_en='Name',
        organization=Organization.objects.get(name='Samf'),
    )


class TestRecruitmentClean:
    def test_all_datetimes_is_in_the_future(self, fixture_org):
        past = timezone.now() - timezone.timedelta(days=2)

        for field in datetime_fields_expecting_error:
            with pytest.raises(ValidationError) as error:
                _create_recruitment_with_dt(overrides={field: past})
            assert Recruitment.NOT_IN_FUTURE_ERROR in dict(error.value)[field]

            # cant take length test, since one future error affects other errors aswell

    def test_visible_from_before_application_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'visible_from': future_more})
        e = dict(error.value)
        assert Recruitment.SHOWN_BEFORE_VISIBLE_ERROR in e['actual_application_deadline']
        assert Recruitment.VISIBLE_AFTER_SHOWN_ERROR in e['visible_from']

    def test_application_deadline_before_reprioritization_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'actual_application_deadline': future_more})
        e = dict(error.value)
        assert Recruitment.ACTUAL_AFTER_REPRIORITIZATION in e['actual_application_deadline']
        assert Recruitment.REPRIORITIZATION_BEFORE_ACTUAL in e['reprioritization_deadline_for_applicant']

    def test_reprioritization_deadline_for_applicant_before_reprioritization_deadline_for_groups(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'reprioritization_deadline_for_applicant': future_more})
        e = dict(error.value)
        assert Recruitment.REPRIORITIZATION_GROUP_BEFORE_APPLICANT in e['reprioritization_deadline_for_groups']
        assert Recruitment.REPRIORITIZATION_APPLICANT_AFTER_GROUP in e['reprioritization_deadline_for_applicant']

    def test_actual_deadline_before_shown_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'shown_application_deadline': future_more})
        e = dict(error.value)
        assert Recruitment.ACTUAL_BEFORE_SHOWN_ERROR in e['actual_application_deadline']
        assert Recruitment.SHOWN_AFTER_ACTUAL_ERROR in e['shown_application_deadline']


class TestRecruitmentStats:
    def test_recruitment_has_stats(self, fixture_recruitment: Recruitment):
        """Check if fixture_recruitment has the related object"""
        assert fixture_recruitment.statistics

    def test_recruitmentstats_update_signal(self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment):
        """Check if statistics are updated on new applications"""
        assert fixture_recruitment.statistics.total_applications == 0
        assert fixture_recruitment.statistics.total_applicants == 0

        # Creat new application
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Check if updated
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.total_applications == 1
        assert fixture_recruitment.statistics.total_applicants == 1

    def test_recruitmentstats_multiple_applications_single_user(
        self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        """Check if only applications are updated if same user creates an additional application"""
        assert fixture_recruitment.statistics.total_applicants == 0
        assert fixture_recruitment.statistics.total_applications == 0
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.total_applications == 1
        assert fixture_recruitment.statistics.total_applicants == 1

        # Create simple copy of a new position for new application
        fixture_recruitment_position_copy = fixture_recruitment_position
        fixture_recruitment_position.pk = None
        fixture_recruitment_position_copy.save()

        # create new application for same user
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position_copy,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        # check if only applications are updated
        assert fixture_recruitment.statistics.total_applications == 2
        assert fixture_recruitment.statistics.total_applicants == 1

    def test_recruitmentstats_multiple_applications_multiple_users(
        self, fixture_user: User, fixture_user2: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        """Check if both applicants and applications are updated"""
        assert fixture_recruitment.statistics.total_applicants == 0
        assert fixture_recruitment.statistics.total_applications == 0
        # Test for one user
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.total_applications == 1
        assert fixture_recruitment.statistics.total_applicants == 1

        # Test for both for extra user
        RecruitmentApplication.objects.create(
            user=fixture_user2,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.total_applications == 2
        assert fixture_recruitment.statistics.total_applicants == 2

    def test_recruitmentstats_date(self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment):
        assert fixture_recruitment.statistics.date_stats.filter(date=timezone.now().strftime('%Y-%m-%d')).first().count == 0

        application = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.date_stats.filter(date=application.created_at.strftime('%Y-%m-%d')).first().count == 1

    def test_recruitmentstats_time(self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment):
        assert fixture_recruitment.statistics.time_stats.filter(hour=timezone.now().hour).first().count == 0

        application = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.time_stats.filter(hour=application.created_at.hour).first().count == 1

    def test_recruitmentstats_campus(
        self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment, fixture_campus: Campus
    ):
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.campus_stats.filter(campus=fixture_campus).first().count == 0
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.campus_stats.filter(campus=fixture_campus).first().count == 1


class TestRecruitmentInterview:
    def test_interview_group_autoadd_on_create(
        self,
        fixture_recruitment: Recruitment,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment_application: RecruitmentApplication,
    ):
        # assert initial state
        assert fixture_recruitment_position.shared_interview_group is None
        assert fixture_recruitment_application.interview is None
        assert fixture_recruitment_position.shared_interview_group is None
        assert fixture_recruitment_position2.shared_interview_group is None

        # setup interview group
        shared_group = RecruitmentPositionSharedInterviewGroup.objects.create(recruitment=fixture_recruitment)
        fixture_recruitment_position.shared_interview_group = shared_group
        fixture_recruitment_position2.shared_interview_group = shared_group
        fixture_recruitment_position.save()
        fixture_recruitment_position2.save()
        assert fixture_recruitment_position.shared_interview_group == shared_group
        assert fixture_recruitment_position.shared_interview_group == fixture_recruitment_position2.shared_interview_group

        # Give application an interview
        interview = Interview.objects.create(interview_time=timezone.now(), interview_location='Eurovision 2024')
        fixture_recruitment_application.interview = interview
        fixture_recruitment_application.save()
        assert fixture_recruitment_application.interview == interview

        # Check if new application for shared group has same interview on create
        new_application = RecruitmentApplication.objects.create(
            user=fixture_recruitment_application.user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment_application.recruitment,
            application_text='I already have an interview!',
        )
        assert new_application.interview == interview

    def test_interview_group_autoset_on_set(
        self,
        fixture_recruitment: Recruitment,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment_application: RecruitmentApplication,
        fixture_recruitment_application2: RecruitmentApplication,
    ):
        # assert initial state
        assert fixture_recruitment_position.shared_interview_group is None
        assert fixture_recruitment_application.interview is None
        assert fixture_recruitment_position.shared_interview_group is None
        assert fixture_recruitment_position2.shared_interview_group is None
        assert fixture_recruitment_application.recruitment_position == fixture_recruitment_position
        assert fixture_recruitment_application2.recruitment_position == fixture_recruitment_position2

        # setup interview group
        shared_group = RecruitmentPositionSharedInterviewGroup.objects.create(recruitment=fixture_recruitment)
        fixture_recruitment_position.shared_interview_group = shared_group
        fixture_recruitment_position2.shared_interview_group = shared_group
        fixture_recruitment_position.save()
        fixture_recruitment_position2.save()
        assert fixture_recruitment_position.shared_interview_group == shared_group
        assert fixture_recruitment_position.shared_interview_group == fixture_recruitment_position2.shared_interview_group

        # Give application an interview
        interview = Interview.objects.create(interview_time=timezone.now(), interview_location='Eurovision 2024')
        fixture_recruitment_application.interview = interview
        fixture_recruitment_application.save()
        assert fixture_recruitment_application.interview == interview

        # check if other application has saved that new application
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(pk=fixture_recruitment_application2.pk)
        assert fixture_recruitment_application2.interview == interview


class TestRecruitmentGangStat:
    def test_recruitmentstats_gang_single_application_single_gang(
        self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first() is None

        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first().applicant_count == 1
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first().application_count == 1

    def test_recruitmentstats_gang_two_applications_two_users_single_gang(
        self, fixture_user: User, fixture_user2: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first() is None
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )

        RecruitmentApplication.objects.create(
            user=fixture_user2,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )

        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first().applicant_count == 2
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first().application_count == 2

    def test_recruitmentstats_gang_two_applications_two_gangs(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_gang2: Gang,
        fixture_recruitment: Recruitment,
    ):
        fixture_recruitment_position2.gang = fixture_gang2
        fixture_recruitment_position2.save()

        assert fixture_recruitment_position2.gang != fixture_recruitment_position.gang
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first() is None
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position2.gang).first() is None

        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=2,
        )

        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first().applicant_count == 1
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first().application_count == 1
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position2.gang).first().applicant_count == 1
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position2.gang).first().application_count == 1

    def test_recruitmentstats_gang_two_applications_single_user_single_gang(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment: Recruitment,
    ):
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first() is None
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=2,
        )
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first().applicant_count == 1
        assert fixture_recruitment.statistics.gang_stats.filter(gang=fixture_recruitment_position.gang).first().application_count == 2


class TestRecruitmentApplication:
    def test_check_withdraw_sets_unwanted(self, fixture_recruitment_application: RecruitmentApplication):
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_SET

        fixture_recruitment_application.withdrawn = True
        fixture_recruitment_application.save()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)

        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION
        assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_WANTED


class TestRecruitmentApplicationStatus:
    def test_check_called_accepted_sets_auto_rejection(
        self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication
    ):
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        fixture_recruitment_application.save()

        # Fetch most recent values
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION

    def test_check_called_rejected_sets_auto_rejection(
        self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication
    ):
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.CALLED_AND_REJECTED
        fixture_recruitment_application.save()

        # Fetch most recent values
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_REJECTED
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION

    def test_check_autorejection_sets_nothing(
        self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication
    ):
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.AUTOMATIC_REJECTION
        fixture_recruitment_application.save()

        # Fetch most recent values
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

    def test_check_revert_called_sets_unset_if_not_rejected(
        self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication
    ):
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        fixture_recruitment_application.save()

        # Fetch most recent values, check gets set to autorejection
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.NOT_SET
        fixture_recruitment_application.save()

        # Fetch most recent values, check gets set to autorejection
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

    def test_check_revert_called_does_not_change_rejected(
        self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication
    ):
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

        fixture_recruitment_application2.recruiter_status = RecruitmentStatusChoices.REJECTION
        fixture_recruitment_application2.save()
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.REJECTION

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        fixture_recruitment_application.save()

        # Fetch most recent values, check gets set to autorejection
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.REJECTION

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.NOT_SET
        fixture_recruitment_application.save()

        # Fetch most recent values, check gets set to autorejection
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.REJECTION

    def test_check_revert_called_does_not_change_withdrawn(
        self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication
    ):
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

        fixture_recruitment_application2.withdrawn = True
        fixture_recruitment_application2.save()
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        fixture_recruitment_application.save()

        # Fetch most recent values, check gets set to autorejection
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION

        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.NOT_SET
        fixture_recruitment_application.save()

        # Fetch most recent values, check gets set to autorejection
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION

    def test_check_applicant_state_all_not_set(
        self,
        fixture_recruitment: Recruitment,
        fixture_user: User,
        fixture_recruitment_application: RecruitmentApplication,
        fixture_recruitment_application2: RecruitmentApplication,
    ):
        assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_SET
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.NOT_SET

        # Set priority to get this to work
        fixture_recruitment_application2.applicant_priority = 2
        fixture_recruitment_application2.save()

        assert fixture_recruitment_application2.recruiter_priority == RecruitmentPriorityChoices.NOT_SET
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.NOT_SET

        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.NOT_SET
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.NOT_SET

    def test_check_applicant_state_wanted(
        self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication
    ):
        """
        Tests for each state where one application is wanted,
        and how that affects other applications state
        Possible states tested here are:
        - WANTED is above all others, others are unset
        - WANTED is above all others, others are reserved
        - WANTED is above all others, others are wanted
        - Both are wanted, but swap which has highest applicant priority
        - An unset is above a wanted
        """
        assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_SET
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.NOT_SET

        assert fixture_recruitment_application2.recruiter_priority == RecruitmentPriorityChoices.NOT_SET
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.NOT_SET

        # Test higher pri unset other
        fixture_recruitment_application.recruiter_priority = RecruitmentPriorityChoices.WANTED
        fixture_recruitment_application.save()
        fixture_recruitment_application2.applicant_priority = 2
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_WANTED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.LESS_WANT

        # Test higher pri reserved other
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.RESERVE
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_WANTED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.LESS_WANT_RESERVED

        # Test higher pri wanted other
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.WANTED
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_WANTED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.LESS_WANT_WANTED

        # Test flipped, swap priority
        fixture_recruitment_application.applicant_priority = 2
        fixture_recruitment_application.save()
        fixture_recruitment_application2.applicant_priority = 1
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority > fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.LESS_WANT_WANTED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.TOP_WANTED

        # One is at top but not set, but other has top, but has less priority
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.NOT_SET
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority > fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_WANTED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.NOT_SET

    def test_check_applicant_state_reserve(
        self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication
    ):
        """
        Tests for each state where one application is wanted,
        and how that affects other applications state
        Possible states tested here are:
        - RESERVE is above all others, others are unset
        - RESERVE is above all others, others are reserved
        - RESERVE is above all others, others are wanted
        - Both are reserve, but swap which has highest applicant priority
        - An unset is above a reserve
        """
        assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_SET
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.NOT_SET

        assert fixture_recruitment_application2.recruiter_priority == RecruitmentPriorityChoices.NOT_SET
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.NOT_SET

        # Test higher pri unset other
        fixture_recruitment_application.recruiter_priority = RecruitmentPriorityChoices.RESERVE
        fixture_recruitment_application.save()
        fixture_recruitment_application2.applicant_priority = 2
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_RESERVED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.LESS_RESERVE

        # Test higher pri reserved other
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.RESERVE
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_RESERVED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.LESS_RESERVE_RESERVED

        # Test higher pri wanted other
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.WANTED
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_RESERVED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.LESS_RESERVE_WANTED

        # Test flipped, swap priority
        fixture_recruitment_application.applicant_priority = 2
        fixture_recruitment_application.save()
        fixture_recruitment_application2.applicant_priority = 1
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.RESERVE
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority > fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.LESS_RESERVE_RESERVED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.TOP_RESERVED

        # One is at top but not set, but other has top, but has less priority
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.NOT_SET
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority > fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_RESERVED
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.NOT_SET

    def test_priority_up(self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication):
        assert fixture_recruitment_application.applicant_priority == 1
        assert fixture_recruitment_application2.applicant_priority == 2

        # Test general up
        fixture_recruitment_application2.update_priority(1)

        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application.id).applicant_priority == 2
        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id).applicant_priority == 1

        # Test up overloading
        RecruitmentApplication.objects.get(id=fixture_recruitment_application.id).update_priority(2)

        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application.id).applicant_priority == 1
        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id).applicant_priority == 2

        # Test up from top position does not change anything
        RecruitmentApplication.objects.get(id=fixture_recruitment_application.id).update_priority(1)

        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application.id).applicant_priority == 1
        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id).applicant_priority == 2

    def test_priority_down(self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication):
        # intial priority
        assert fixture_recruitment_application.applicant_priority == 1
        assert fixture_recruitment_application2.applicant_priority == 2

        # Test general up
        fixture_recruitment_application.update_priority(-1)

        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application.id).applicant_priority == 2
        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id).applicant_priority == 1

        # Test up overloading
        RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id).update_priority(-2)

        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application.id).applicant_priority == 1
        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id).applicant_priority == 2

        # Test up from top position does not change anything
        RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id).update_priority(-1)

        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application.id).applicant_priority == 1
        assert RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id).applicant_priority == 2

    def test_auto_newest_lowest_pri(self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_position2: RecruitmentPosition):
        """Tests that the newest application gets automatically the lowest applicant priority"""
        # intial priority
        assert fixture_recruitment_application.applicant_priority == 1

        new_application = RecruitmentApplication.objects.create(
            application_text='Test application text 2',
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment_position2.recruitment,
            user=fixture_recruitment_application.user,
        )
        assert new_application.applicant_priority == 2

    def test_recruitment_progress_no_applications(self, fixture_recruitment: Recruitment):
        assert RecruitmentApplication.objects.filter(recruitment=fixture_recruitment).count() == 0
        assert fixture_recruitment.recruitment_progress() == 1

    def test_recruitment_progress_application_no_progress(self, fixture_recruitment: Recruitment, fixture_recruitment_application: RecruitmentApplication):
        assert RecruitmentApplication.objects.filter(recruitment=fixture_recruitment).count() == 1
        assert fixture_recruitment.recruitment_progress() == 0

    def test_recruitment_progress_application_complete_progress(
        self, fixture_recruitment: Recruitment, fixture_recruitment_application: RecruitmentApplication
    ):
        assert RecruitmentApplication.objects.filter(recruitment=fixture_recruitment).count() == 1
        assert fixture_recruitment.recruitment_progress() == 0
        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        fixture_recruitment_application.save()
        assert fixture_recruitment.recruitment_progress() == 1

    def test_recruitment_progress_applications_multiple_new_updates_progress(
        self, fixture_recruitment: Recruitment, fixture_recruitment_application: RecruitmentApplication, fixture_user2: User
    ):
        assert RecruitmentApplication.objects.filter(recruitment=fixture_recruitment).count() == 1
        assert fixture_recruitment.recruitment_progress() == 0
        fixture_recruitment_application.recruiter_status = RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        fixture_recruitment_application.save()
        assert fixture_recruitment.recruitment_progress() == 1

        new_application = RecruitmentApplication.objects.create(
            application_text='Test application text 2',
            recruitment_position=fixture_recruitment_application.recruitment_position,
            recruitment=fixture_recruitment_application.recruitment,
            user=fixture_user2,
        )
        assert fixture_recruitment.recruitment_progress() != 1

        new_application.recruiter_status = RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        new_application.save()
        assert fixture_recruitment.recruitment_progress() == 1


def test_position_must_have_single_owner(fixture_recruitment_position: RecruitmentPosition, fixture_gang: Gang, fixture_gang_section: GangSection):
    fixture_recruitment_position.gang = fixture_gang
    fixture_recruitment_position.section = fixture_gang_section
    with pytest.raises(ValidationError):
        fixture_recruitment_position.save()

    fixture_recruitment_position.gang = None
    fixture_recruitment_position.section = None
    with pytest.raises(ValidationError):
        fixture_recruitment_position.save()

    fixture_recruitment_position.gang = fixture_gang
    fixture_recruitment_position.save()

    fixture_recruitment_position.gang = None
    fixture_recruitment_position.section = fixture_gang_section
    fixture_recruitment_position.save()
