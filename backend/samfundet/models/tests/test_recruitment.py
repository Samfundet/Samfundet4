import pytest

from django.utils import timezone
from django.core.exceptions import ValidationError

from samfundet.models.recruitment import Recruitment, Organization

datetime_fields_expecting_error = [
    # 'visible_from', # Allowed to be in the past.
    'actual_application_deadline',
    'shown_application_deadline',
    'reprioritization_deadline_for_applicant',
    'reprioritization_deadline_for_groups',
]

# flake8-in-file-ignores: noqa: E124


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
            assert 'Time should be in the future' in dict(error.value)[field]

            # cant take length test, since one future error affects other errors aswell

    def test_visible_from_before_application_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'visible_from': future_more})
        assert 'Shown application deadline should be after visible' in dict(error.value)['actual_application_deadline']
        assert 'Visible from should be before shown application deadline' in dict(error.value)['visible_from']

    def test_application_deadline_before_reprioritization_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'actual_application_deadline': future_more})

        assert 'Actual application deadline should be before reprioritization deadline for applicants' in dict(error.value)['actual_application_deadline']
        assert 'Reprioritization application deadline should be after actual deadline for applicants' in dict(error.value
                                                                                                             )['reprioritization_deadline_for_applicant']

    def test_reprioritization_deadline_for_applicant_before_reprioritization_deadline_for_groups(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'reprioritization_deadline_for_applicant': future_more})
        assert 'Reprioritization deadline for groups should be after reprioritization deadline for groups' in dict(error.value
                                                                                                                  )['reprioritization_deadline_for_groups']
        assert 'Reprioritization deadline for applicants should be before reprioritization deadline for groups' in dict(
            error.value
        )['reprioritization_deadline_for_applicant']

    def test_actual_deadline_before_shown_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'shown_application_deadline': future_more})
        assert 'Actual application deadline should be after the shown application deadline' in dict(error.value)['actual_application_deadline']
        assert 'Shown application deadline should be before the actual application deadline' in dict(error.value)['shown_application_deadline']
