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
            assert field in dict(error.value).keys()
            assert len(dict(error.value).keys()) == 1

    def test_visible_from_before_application_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'visible_from': future_more})
        assert 'actual_application_deadline' in dict(error.value).keys()
        assert 'visible_from' in dict(error.value).keys()
        assert len(dict(error.value).keys()) == 2

    def test_application_deadline_before_reprioritization_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'actual_application_deadline': future_more})

        assert 'actual_application_deadline' in dict(error.value).keys()
        assert 'reprioritization_deadline_for_applicant' in dict(error.value).keys()
        assert len(dict(error.value).keys()) == 2

    def test_reprioritization_deadline_for_applicant_before_reprioritization_deadline_for_groups(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'reprioritization_deadline_for_applicant': future_more})
        assert 'reprioritization_deadline_for_groups' in dict(error.value).keys()
        assert 'reprioritization_deadline_for_applicant' in dict(error.value).keys()
        assert len(dict(error.value).keys()) == 2

    def test_actual_deadline_before_shown_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'shown_application_deadline': future_more})
        assert 'actual_application_deadline' in dict(error.value).keys()
        assert 'shown_application_deadline' in dict(error.value).keys()
        assert len(dict(error.value).keys()) == 2
