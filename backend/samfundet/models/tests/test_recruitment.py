import pytest

from django.utils import timezone
from django.core.exceptions import ValidationError

from samfundet.models.recruitment import (
    Recruitment,
    Organization,
    RecruitmentPosition,
    RecruitmentAdmission,
)
from samfundet.models.general import User

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
        error_msg = 'All times should be in the future'
        past = timezone.now() - timezone.timedelta(days=2)

        for field in datetime_fields_expecting_error:
            with pytest.raises(ValidationError, match=error_msg):
                _create_recruitment_with_dt(overrides={field: past})

    def test_visible_from_before_application_deadline(self, fixture_org):
        error_msg = 'Visible from should be before application deadline'
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError, match=error_msg):
            _create_recruitment_with_dt(overrides={'visible_from': future_more})

    def test_application_deadline_before_reprioritization_deadline(self, fixture_org):
        error_msg = 'Actual application deadline should be before reprioritization deadline for applicants'
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError, match=error_msg):
            _create_recruitment_with_dt(overrides={'actual_application_deadline': future_more})

    def test_reprioritization_deadline_for_applicant_before_reprioritization_deadline_for_groups(self, fixture_org):
        error_msg = 'Reprioritization deadline for applicants should be before reprioritization deadline for groups'
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError, match=error_msg):
            _create_recruitment_with_dt(overrides={'reprioritization_deadline_for_applicant': future_more})


class TestRecruitmentStats:

    def test_recruitment_has_stats(self, fixture_recruitment: Recruitment):
        fixture_recruitment.save()
        assert fixture_recruitment.statistics

    def test_recruitmentstats_update_signal(self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment):
        assert fixture_recruitment.statistics.total_applicants == 0

        admission = RecruitmentAdmission(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            admission_text='I have applied',
            applicant_priority=1,
        )
        admission.save()
        assert fixture_recruitment.statistics.total_admissions == 1
        assert fixture_recruitment.statistics.total_applicants == 1

    def test_recruitmentstats_multiple_applications_single_user(
        self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        assert fixture_recruitment.statistics.total_applicants == 0
        assert fixture_recruitment.statistics.total_admissions == 0

        RecruitmentAdmission.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            admission_text='I have applied',
            applicant_priority=1,
        )
        assert fixture_recruitment.statistics.total_admissions == 1
        assert fixture_recruitment.statistics.total_applicants == 1

        # Create simple copy
        fixture_recruitment_position_copy = fixture_recruitment_position
        fixture_recruitment_position.pk == None
        fixture_recruitment_position_copy.save()

        RecruitmentAdmission.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position_copy,
            recruitment=fixture_recruitment,
            admission_text='I have applied',
            applicant_priority=1,
        )

        assert fixture_recruitment.statistics.total_admissions == 2
        assert fixture_recruitment.statistics.total_applicants == 1

    def test_recruitmentstats_multiple_applications_multiple_users(
        self, fixture_user: User, fixture_user2: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        assert fixture_recruitment.statistics.total_applicants == 0
        assert fixture_recruitment.statistics.total_admissions == 0

        RecruitmentAdmission.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            admission_text='I have applied',
            applicant_priority=1,
        )
        assert fixture_recruitment.statistics.total_admissions == 1
        assert fixture_recruitment.statistics.total_applicants == 1

        RecruitmentAdmission.objects.create(
            user=fixture_user2,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            admission_text='I have applied',
            applicant_priority=1,
        )

        assert fixture_recruitment.statistics.total_admissions == 2
        assert fixture_recruitment.statistics.total_applicants == 2
