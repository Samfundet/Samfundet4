from __future__ import annotations

import pytest

from django.utils import timezone
from django.core.exceptions import ValidationError

from samfundet.models.general import User, Campus
from samfundet.models.recruitment import Recruitment, Organization, RecruitmentPosition, RecruitmentApplication
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
        """Check if statistics are updated on new admissions"""
        assert fixture_recruitment.statistics.total_admissions == 0
        assert fixture_recruitment.statistics.total_applicants == 0

        # Creat new admission
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
        assert fixture_recruitment.statistics.total_admissions == 1
        assert fixture_recruitment.statistics.total_applicants == 1

    def test_recruitmentstats_multiple_applications_single_user(
        self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        """Check if only admissions are updated if same user creates an additional admission"""
        assert fixture_recruitment.statistics.total_applicants == 0
        assert fixture_recruitment.statistics.total_admissions == 0
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.total_admissions == 1
        assert fixture_recruitment.statistics.total_applicants == 1

        # Create simple copy of a new position for new admission
        fixture_recruitment_position_copy = fixture_recruitment_position
        fixture_recruitment_position.pk = None
        fixture_recruitment_position_copy.save()

        # create new admission for same user
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position_copy,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        # check if only admissions are updated
        assert fixture_recruitment.statistics.total_admissions == 2
        assert fixture_recruitment.statistics.total_applicants == 1

    def test_recruitmentstats_multiple_applications_multiple_users(
        self, fixture_user: User, fixture_user2: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        """Check if both applicatats and admissiosn are updated"""
        assert fixture_recruitment.statistics.total_applicants == 0
        assert fixture_recruitment.statistics.total_admissions == 0
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
        assert fixture_recruitment.statistics.total_admissions == 1
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
        assert fixture_recruitment.statistics.total_admissions == 2
        assert fixture_recruitment.statistics.total_applicants == 2

    def test_recruitmentstats_campus(
        self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment, fixture_campus: Campus
    ):
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.campus_stats.filter(campus=fixture_campus).first().count == 0
        RecruitmentAdmission.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            admission_text='I have applied',
            applicant_priority=1,
        )
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.campus_stats.filter(campus=fixture_campus).first().count == 1

    def test_recruitmentstats_hour(self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment):
        adm = RecruitmentAdmission.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            admission_text='I have applied',
            applicant_priority=1,
        )
        assert fixture_recruitment.statistics.time_stats.filter(hour=adm.created_at.hour).first().count == 0
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.time_stats.filter(hour=adm.created_at.hour).first().count == 1

    def test_recruitmentstats_date(self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment):
        adm = RecruitmentAdmission.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            admission_text='I have applied',
            applicant_priority=1,
        )
        assert fixture_recruitment.statistics.date_stats.filter(date=adm.created_at.strftime('%Y-%m-%d')).first().count == 0
        # Needs to be manually done
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.date_stats.filter(date=adm.created_at.strftime('%Y-%m-%d')).first().count == 1


class TestRecruitmentApplication:
    def test_check_withdraw_sets_unwanted(self, fixture_recruitment_application: RecruitmentApplication):
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_SET

        fixture_recruitment_application.withdrawn = True
        fixture_recruitment_application.save()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)

        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION
        assert fixture_recruitment_application.recruiter_priority == RecruitmentPriorityChoices.NOT_WANTED

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
        Tests for each state where one admission is wanted,
        and how that affects other admissions state
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
        Tests for each state where one admission is wanted,
        and how that affects other admissions state
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
        """Tests that the newest admission gets automatically the lowest applicant priority"""
        # intial priority
        assert fixture_recruitment_application.applicant_priority == 1

        new_admission = RecruitmentApplication.objects.create(
            application_text='Test admission text 2',
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment_position2.recruitment,
            user=fixture_recruitment_application.user,
        )
        assert new_admission.applicant_priority == 2
