from __future__ import annotations

import pytest

from django.utils import timezone
from django.core.exceptions import ValidationError

from samfundet.models.recruitment import Recruitment, Organization, RecruitmentAdmission
from samfundet.models.model_choices import RecruitmentStatusChoices, RecruitmentPriorityChoices

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


class TestRecruitmentAdmission:
    def test_check_withdraw_sets_unwanted(self, fixture_recruitment_admission: RecruitmentAdmission):
        assert fixture_recruitment_admission.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_admission.recruiter_priority == RecruitmentPriorityChoices.NOT_SET

        fixture_recruitment_admission.withdrawn = True
        fixture_recruitment_admission.save()

        assert fixture_recruitment_admission.recruiter_status == RecruitmentStatusChoices.AUTOMATIC_REJECTION
        assert fixture_recruitment_admission.recruiter_priority == RecruitmentPriorityChoices.NOT_WANTED

    def test_priority_up(self, fixture_recruitment_admission: RecruitmentAdmission, fixture_recruitment_admission2: RecruitmentAdmission):
        assert fixture_recruitment_admission.applicant_priority == 1
        assert fixture_recruitment_admission2.applicant_priority == 2

        # Test general up
        fixture_recruitment_admission2.update_priority(1)

        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission.id).applicant_priority == 2
        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission2.id).applicant_priority == 1

        # Test up overloading
        RecruitmentAdmission.objects.get(id=fixture_recruitment_admission.id).update_priority(2)

        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission.id).applicant_priority == 1
        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission2.id).applicant_priority == 2

        # Test up from top position does not change anything
        RecruitmentAdmission.objects.get(id=fixture_recruitment_admission.id).update_priority(1)

        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission.id).applicant_priority == 1
        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission2.id).applicant_priority == 2

    def test_priority_down(self, fixture_recruitment_admission: RecruitmentAdmission, fixture_recruitment_admission2: RecruitmentAdmission):
        # intial priority
        assert fixture_recruitment_admission.applicant_priority == 1
        assert fixture_recruitment_admission2.applicant_priority == 2

        # Test general up
        fixture_recruitment_admission.update_priority(-1)

        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission.id).applicant_priority == 2
        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission2.id).applicant_priority == 1

        # Test up overloading
        RecruitmentAdmission.objects.get(id=fixture_recruitment_admission2.id).update_priority(-2)

        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission.id).applicant_priority == 1
        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission2.id).applicant_priority == 2

        # Test up from top position does not change anything
        RecruitmentAdmission.objects.get(id=fixture_recruitment_admission2.id).update_priority(-1)

        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission.id).applicant_priority == 1
        assert RecruitmentAdmission.objects.get(id=fixture_recruitment_admission2.id).applicant_priority == 2
