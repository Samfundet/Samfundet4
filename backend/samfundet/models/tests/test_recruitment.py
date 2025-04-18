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
    'reprioritization_deadline_for_gangs',
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

    fields = dict.fromkeys(datetime_fields_expecting_error, future)
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

    def test_reprioritization_deadline_for_applicant_before_reprioritization_deadline_for_gangs(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'reprioritization_deadline_for_applicant': future_more})
        e = dict(error.value)
        assert Recruitment.REPRIORITIZATION_GROUP_BEFORE_APPLICANT in e['reprioritization_deadline_for_gangs']
        assert Recruitment.REPRIORITIZATION_APPLICANT_AFTER_GROUP in e['reprioritization_deadline_for_applicant']

    def test_actual_deadline_before_shown_deadline(self, fixture_org):
        future_more = timezone.now() + timezone.timedelta(days=FUTURE_DAYS + 2)
        with pytest.raises(ValidationError) as error:
            _create_recruitment_with_dt(overrides={'shown_application_deadline': future_more})
        e = dict(error.value)
        assert Recruitment.ACTUAL_BEFORE_SHOWN_ERROR in e['actual_application_deadline']
        assert Recruitment.SHOWN_AFTER_ACTUAL_ERROR in e['shown_application_deadline']


class TestRecruitmentPosition:
    default_data = {
        'name_en': 'Name_en',
        'name_nb': 'Name_nb',
        'short_description_nb': 'short_description_nb',
        'short_description_en': 'short_description_en',
        'long_description_nb': 'long_description_nb',
        'long_description_en': 'long_description_en',
        'is_funksjonaer_position': False,
        'default_application_letter_nb': 'default_application_letter_nb',
        'default_application_letter_en': 'default_application_letter_en',
        'norwegian_applicants_only': False,
        'tags': 'tag1, tag2, tag3',
    }

    def test_create_recruitmentposition_gang(self, fixture_gang: Gang):
        test_position = RecruitmentPosition.objects.create(**self.default_data, gang=fixture_gang)
        assert test_position.id

    def test_create_recruitmentposition_section(self, fixture_gang_section: GangSection):
        test_position = RecruitmentPosition.objects.create(**self.default_data, section=fixture_gang_section)
        assert test_position.id

    def test_create_recruitmentposition_no_section(self):
        with pytest.raises(ValidationError) as error:
            RecruitmentPosition.objects.create(**self.default_data)
        e = dict(error.value)
        assert RecruitmentPosition.NO_OWNER_ERROR in e['section']
        assert RecruitmentPosition.NO_OWNER_ERROR in e['gang']

    def test_create_recruitmentposition_only_one_owner(self, fixture_gang_section: GangSection, fixture_gang: Gang):
        with pytest.raises(ValidationError) as error:
            RecruitmentPosition.objects.create(**self.default_data, section=fixture_gang_section, gang=fixture_gang)
        e = dict(error.value)
        assert RecruitmentPosition.ONLY_ONE_OWNER_ERROR in e['section']
        assert RecruitmentPosition.ONLY_ONE_OWNER_ERROR in e['gang']

    def test_create_recruitmentposition_file_upload_no_description(self, fixture_gang_section: GangSection):
        with pytest.raises(ValidationError) as error:
            RecruitmentPosition.objects.create(**self.default_data, section=fixture_gang_section, has_file_upload=True)
        e = dict(error.value)
        assert RecruitmentPosition.FILE_DESCRIPTION_REQUIRED_ERROR in e['file_description_nb']
        assert RecruitmentPosition.FILE_DESCRIPTION_REQUIRED_ERROR in e['file_description_en']

        with pytest.raises(ValidationError) as error:
            RecruitmentPosition.objects.create(**self.default_data, section=fixture_gang_section, has_file_upload=True, file_description_en='Description')
        e = dict(error.value)
        assert RecruitmentPosition.FILE_DESCRIPTION_REQUIRED_ERROR in e['file_description_nb']

        with pytest.raises(ValidationError) as error:
            RecruitmentPosition.objects.create(**self.default_data, section=fixture_gang_section, has_file_upload=True, file_description_nb='Description')
        e = dict(error.value)
        assert RecruitmentPosition.FILE_DESCRIPTION_REQUIRED_ERROR in e['file_description_en']

    def test_create_recruitmentposition_file_upload(self, fixture_gang_section: GangSection):
        test_position = RecruitmentPosition.objects.create(
            **self.default_data, section=fixture_gang_section, has_file_upload=True, file_description_en='Description', file_description_nb='Description'
        )
        assert test_position.id


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
        shared_group = RecruitmentPositionSharedInterviewGroup.objects.create(recruitment=fixture_recruitment, name_en='name', name_nb='navn')
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
        shared_group = RecruitmentPositionSharedInterviewGroup.objects.create(recruitment=fixture_recruitment, name_en='name', name_nb='navn')
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


class TestRecruitmentPositionStats:
    def test_recruitmentstats_position_update_reprioritization_no_interviews(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment: Recruitment,
    ):
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0
        # Without Interview2
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        # Without Interview2
        application2 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=2,
        )

        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

        # Move application 2, postion 2 up
        application2.update_priority(1)

        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

    def test_recruitmentstats_position_update_reprioritization_before_interview(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment: Recruitment,
    ):
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

        interview = Interview.objects.create(interview_time=timezone.now() + timezone.timedelta(hours=3), interview_location='Eurovision 2024')

        # Without Interview2
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            interview=interview,
            applicant_priority=1,
        )

        interview2 = Interview.objects.create(interview_time=timezone.now() + timezone.timedelta(hours=4), interview_location='Eurovision 2025')

        # Without Interview2
        application2 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            interview=interview2,
            applicant_priority=2,
        )

        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

        # Move application 2, postion 2 up
        application2.update_priority(1)
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

    def test_recruitmentstats_position_update_reprioritization_one_interview(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment: Recruitment,
    ):
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

        interview = Interview.objects.create(interview_time=timezone.now() - timezone.timedelta(hours=3), interview_location='Eurovision 2024')

        # Without Interview2
        application = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            interview=interview,
            applicant_priority=1,
        )

        # Without Interview2
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=2,
        )

        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

        # Move application 1, 1 position down
        application.update_priority(-1)
        fixture_recruitment.statistics.save()
        position_stats = fixture_recruitment.statistics.position_stats.filter(recruitment_position=fixture_recruitment_position).first()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0
        assert position_stats.repriorization_value == -1
        assert position_stats.repriorization_count == 1
        assert position_stats.normalized_repriorization_value() == -1.0

        application.update_priority(1)
        fixture_recruitment.statistics.save()
        position_stats = fixture_recruitment.statistics.position_stats.filter(recruitment_position=fixture_recruitment_position).first()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0
        assert position_stats.repriorization_value == 0
        assert position_stats.repriorization_count == 2
        assert position_stats.normalized_repriorization_value() == 0.0

    def test_recruitmentstats_position_update_reprioritization_two_interview(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment: Recruitment,
    ):
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).repriorization_count == 0
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

        interview = Interview.objects.create(interview_time=timezone.now() - timezone.timedelta(hours=3), interview_location='Eurovision 2024')

        # Without Interview2
        application = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            interview=interview,
            applicant_priority=1,
        )

        interview2 = Interview.objects.create(interview_time=timezone.now() - timezone.timedelta(hours=3), interview_location='Eurovision 2024')

        # Without Interview2
        RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            interview=interview2,
            applicant_priority=2,
        )

        assert fixture_recruitment.statistics.position_stats.filter(recruitment_position=fixture_recruitment_position).first()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2).repriorization_count == 0

        # Move application 1, 1 position down
        application.update_priority(-1)
        fixture_recruitment.statistics.save()
        position_stats = fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position)
        position_stats2 = fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2)

        assert position_stats.repriorization_value == -1
        assert position_stats.repriorization_count == 1
        assert position_stats.normalized_repriorization_value() == -1.0
        assert position_stats2.repriorization_value == 1
        assert position_stats2.repriorization_count == 1
        assert position_stats2.normalized_repriorization_value() == 1.0

        application.update_priority(1)
        fixture_recruitment.statistics.save()
        position_stats = fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position)
        position_stats2 = fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position2)

        assert position_stats.repriorization_value == 0
        assert position_stats.repriorization_count == 2
        assert position_stats.normalized_repriorization_value() == 0.0
        assert position_stats2.repriorization_value == 0
        assert position_stats2.repriorization_count == 2
        assert position_stats2.normalized_repriorization_value() == 0.0

    def test_recruitmentstats_position_test_withdrawnrate(
        self, fixture_user: User, fixture_user2: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).withdrawn_rate == 0
        application1 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).withdrawn_rate == 0
        application1.withdrawn = True
        application1.save()
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).withdrawn_rate == 1.0

        application2 = RecruitmentApplication.objects.create(
            user=fixture_user2,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).withdrawn_rate == 0.5
        application2.withdrawn = True
        application2.save()
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).withdrawn_rate == 1.0
        application2.withdrawn = False
        application2.save()
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).withdrawn_rate == 0.5
        application1.withdrawn = False
        application1.save()
        fixture_recruitment.statistics.save()
        assert fixture_recruitment.statistics.position_stats.get(recruitment_position=fixture_recruitment_position).withdrawn_rate == 0.0


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
    def test_check_withdraw_does_not_change_applicant_state(self, fixture_recruitment_application: RecruitmentApplication):
        """tests that withdrawing an application does not change recruiter priority and recruiter status (priority and status of applicant)"""
        initial_status = fixture_recruitment_application.recruiter_status
        initial_priority = fixture_recruitment_application.recruiter_priority
        fixture_recruitment_application.withdrawn = True
        fixture_recruitment_application.save()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        assert fixture_recruitment_application.withdrawn is True
        assert fixture_recruitment_application.recruiter_status == initial_status  # Status shouldn't change
        assert fixture_recruitment_application.recruiter_priority == initial_priority  # Priority should not change

    def test_check_reactivate_does_not_change_applicant_state(self, fixture_recruitment_application: RecruitmentApplication):
        """tests that reactivating an application does not change recruiter priority and recruiter status (priority and status of applicant)"""
        initial_status = fixture_recruitment_application.recruiter_status
        initial_priority = fixture_recruitment_application.recruiter_priority
        fixture_recruitment_application.withdrawn = True
        fixture_recruitment_application.save()
        fixture_recruitment_application.withdrawn = False
        fixture_recruitment_application.save()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        assert fixture_recruitment_application.withdrawn is False
        assert fixture_recruitment_application.recruiter_status == initial_status  # Status shouldn't change
        assert fixture_recruitment_application.recruiter_priority == initial_priority  # Priority should not change

    def test_recruitmentapplication_total_applications_two_gangs(
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

        test_application1 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        test_application2 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=2,
        )
        test_application1.save()
        test_application2.save()
        assert test_application1.get_total_applications() > 0
        assert test_application1.get_total_applications() == test_application2.get_total_applications()
        assert test_application1.get_total_applications_for_gang() == 1
        assert test_application2.get_total_applications_for_gang() == 1
        assert test_application1.get_total_applications_for_gang() != test_application1.get_total_applications()
        assert test_application2.get_total_applications_for_gang() != test_application2.get_total_applications()

    def test_recruitmentapplication_total_applications_single_gang(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment: Recruitment,
    ):
        test_application1 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        test_application2 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=2,
        )
        test_application1.save()
        test_application2.save()
        assert test_application1.get_total_applications() > 0
        assert test_application1.get_total_applications() == test_application2.get_total_applications()
        assert test_application1.get_total_applications_for_gang() == test_application2.get_total_applications_for_gang()
        assert test_application1.get_total_applications_for_gang() == test_application1.get_total_applications()

    def test_recruitmentapplication_total_interviews_two_gangs(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_gang2: Gang,
        fixture_recruitment: Recruitment,
    ):
        fixture_recruitment_position2.gang = fixture_gang2
        fixture_recruitment_position2.save()
        # Create two interviews with separate gangs
        assert fixture_recruitment_position2.gang != fixture_recruitment_position.gang

        test_application1 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        test_application2 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=2,
        )
        # assign 1 interview to one of them
        test_application1.interview = Interview.objects.create()
        test_application1.save()
        test_application2.save()
        assert test_application1.get_total_interviews() > 0
        assert test_application1.get_total_interviews() == test_application2.get_total_interviews()
        assert test_application1.get_total_interviews_for_gang() == test_application1.get_total_interviews()
        assert test_application2.get_total_interviews_for_gang() != test_application2.get_total_interviews()

        # test with both having an interview each
        test_application2.interview = Interview.objects.create()
        test_application1.save()
        test_application2.save()
        assert test_application1.get_total_interviews() > 0
        assert test_application1.get_total_interviews() == test_application2.get_total_interviews()
        assert test_application1.get_total_interviews_for_gang() == test_application2.get_total_interviews_for_gang()
        assert test_application1.get_total_interviews_for_gang() != test_application1.get_total_interviews()
        assert test_application2.get_total_interviews_for_gang() != test_application2.get_total_interviews()

    def test_recruitmentapplication_total_interviews_single_gang(
        self,
        fixture_user: User,
        fixture_recruitment_position: RecruitmentPosition,
        fixture_recruitment_position2: RecruitmentPosition,
        fixture_recruitment: Recruitment,
    ):
        test_application1 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        test_application2 = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position2,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=2,
        )
        test_application1.interview = Interview.objects.create()
        test_application1.save()
        test_application2.save()
        assert test_application1.get_total_interviews() > 0
        assert test_application1.get_total_interviews() == test_application2.get_total_interviews()
        assert test_application1.get_total_interviews_for_gang() == test_application2.get_total_interviews_for_gang()
        assert test_application1.get_total_interviews_for_gang() == test_application1.get_total_interviews()

        test_application2.interview = Interview.objects.create()
        test_application1.save()
        test_application2.save()
        assert test_application1.get_total_interviews() > 0
        assert test_application1.get_total_interviews() == test_application2.get_total_interviews()
        assert test_application1.get_total_interviews_for_gang() == test_application2.get_total_interviews_for_gang()
        assert test_application1.get_total_interviews_for_gang() == test_application1.get_total_interviews()


class TestRecruitmentApplicationStatus:
    def test_recruitmentstats_create(self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment):
        application = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        assert application.id

    def test_recruitmentstats_no_doubleapplication_for_position(
        self, fixture_user: User, fixture_recruitment_position: RecruitmentPosition, fixture_recruitment: Recruitment
    ):
        application = RecruitmentApplication.objects.create(
            user=fixture_user,
            recruitment_position=fixture_recruitment_position,
            recruitment=fixture_recruitment,
            application_text='I have applied',
            applicant_priority=1,
        )
        assert application.id
        with pytest.raises(ValidationError) as error:
            RecruitmentApplication.objects.create(
                user=application.user,
                recruitment_position=application.recruitment_position,
                recruitment=application.recruitment,
                application_text='I have applied a secound time!',
                applicant_priority=1,
            )
        e = dict(error.value)
        assert RecruitmentApplication.ALREADY_APPLIED_ERROR in e['recruitment_position']

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
        """this tests that changing recruiter status does not effect the withdrawn state of the application"""
        # Check initial states
        assert fixture_recruitment_application.recruiter_status == RecruitmentStatusChoices.NOT_SET
        assert fixture_recruitment_application2.recruiter_status == RecruitmentStatusChoices.NOT_SET

        # Store initial recruiter status
        initial_recruiter_status = fixture_recruitment_application2.recruiter_status

        # Withdraw the application
        fixture_recruitment_application2.withdrawn = True
        fixture_recruitment_application2.save()

        # Verify withdrawal worked but didn't affect recruiter status
        assert fixture_recruitment_application2.withdrawn is True
        assert fixture_recruitment_application2.recruiter_status == initial_recruiter_status

    def test_check_applicant_state_all_not_set(
        self,
        fixture_recruitment: Recruitment,
        fixture_user: User,
        fixture_recruitment_application: RecruitmentApplication,
        fixture_recruitment_application2: RecruitmentApplication,
    ):
        """this tests check that update_applicant_state works as expected"""
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
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_PRI_WANTED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.WANTED_ELSEWHERE_UNPROCESSED_HERE

        # Test higher pri reserved other
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.RESERVE
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_PRI_WANTED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.WANTED_ELSEWHERE_RESERVE_HERE

        # Test higher pri wanted other
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.WANTED
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_PRI_WANTED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.WANTED_ELSEWHERE_WANTED_HERE

        # Test flipped, swap priority
        fixture_recruitment_application.update_priority(-1)  # Move down one position (from 1 to 2)
        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority > fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.WANTED_ELSEWHERE_WANTED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.TOP_PRI_WANTED_HERE

        # One is at top but not set, but other has top, but has less priority
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.NOT_SET
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority > fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_PRI_WANTED_HERE
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
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_PRI_RESERVED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.RESERVED_ELSEWHERE_UNPROCESSED_HERE

        # Test higher pri reserved other
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.RESERVE
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_PRI_RESERVED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.RESERVED_ELSEWHERE_RESERVED_HERE

        # Test higher pri wanted other
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.WANTED
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()
        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority < fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_PRI_RESERVED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.RESERVED_ELSEWHERE_WANTED_HERE

        # Test flipped, swap priority
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.RESERVE
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_priority(-1)  # Move first application down
        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority > fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.RESERVED_ELSEWHERE_RESERVED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.TOP_PRI_RESERVED_HERE
        # One is at top but not set, but other has top, but has less priority
        fixture_recruitment_application2.recruiter_priority = RecruitmentPriorityChoices.NOT_SET
        fixture_recruitment_application2.save()
        fixture_recruitment_application.update_applicant_state()

        fixture_recruitment_application = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        fixture_recruitment_application2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        assert fixture_recruitment_application.applicant_priority > fixture_recruitment_application2.applicant_priority
        assert fixture_recruitment_application.applicant_state == RecruitmentApplicantStates.TOP_PRI_RESERVED_HERE
        assert fixture_recruitment_application2.applicant_state == RecruitmentApplicantStates.NOT_SET

    def test_priority_up(self, fixture_recruitment_application: RecruitmentApplication, fixture_recruitment_application2: RecruitmentApplication):
        """tests that applicant changig priorty has the expected outcome"""
        # Verify initial state
        assert fixture_recruitment_application.applicant_priority == 1
        assert fixture_recruitment_application2.applicant_priority == 2

        # Move application2 up in priority - this should trigger a swap with application1
        fixture_recruitment_application2.update_priority(1)

        # Refresh both applications from database to get current state
        app1 = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        app2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        # After moving app2 up, app2 should have priority 1 and app1 should have priority 2
        assert app2.applicant_priority == 1, 'App2 should have been moved to priority 1'
        assert app1.applicant_priority == 2, 'App1 should have been moved to priority 2'

        # Test that moving up when already at top doesn't change anything
        app2.update_priority(1)

        # Refresh again
        app1 = RecruitmentApplication.objects.get(id=fixture_recruitment_application.id)
        app2 = RecruitmentApplication.objects.get(id=fixture_recruitment_application2.id)

        # Priorities should remain the same
        assert app2.applicant_priority == 1, 'App2 should have remained at priority 1'
        assert app1.applicant_priority == 2, 'App1 should have remained at priority 2'

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


def test_lowest_priority_equals_active_applications(
    fixture_user: User,
    fixture_recruitment: Recruitment,
    fixture_recruitment_position: RecruitmentPosition,
    fixture_recruitment_position2: RecruitmentPosition,
):
    """tests that the lowest priority (a number) is the same as the count of active applications of an applicant"""
    # Create two applications for the same user.
    _app1 = RecruitmentApplication.objects.create(
        user=fixture_user,
        recruitment_position=fixture_recruitment_position,
        recruitment=fixture_recruitment,
        application_text='Application 1',
    )
    _app2 = RecruitmentApplication.objects.create(
        user=fixture_user,
        recruitment_position=fixture_recruitment_position2,
        recruitment=fixture_recruitment,
        application_text='Application 2',
    )

    # Get all active (non-withdrawn) applications for the user.
    active_apps = RecruitmentApplication.objects.filter(user=fixture_user, recruitment=fixture_recruitment, withdrawn=False)
    active_count = active_apps.count()

    # The highest applicant_priority among active applications should equal the active count.
    max_priority = max(app.applicant_priority for app in active_apps)
    assert max_priority == active_count, f'Expected highest priority to be {active_count}, but got {max_priority}'


def test_priority_adjusts_on_withdrawal(
    fixture_user: User,
    fixture_recruitment: Recruitment,
    fixture_recruitment_position: RecruitmentPosition,
    fixture_recruitment_position2: RecruitmentPosition,
):
    """Tests that witdrawal updates priority correctly"""
    # Create two applications.
    app1 = RecruitmentApplication.objects.create(
        user=fixture_user,
        recruitment_position=fixture_recruitment_position,
        recruitment=fixture_recruitment,
        application_text='Application 1',
    )
    _app2 = RecruitmentApplication.objects.create(
        user=fixture_user,
        recruitment_position=fixture_recruitment_position2,
        recruitment=fixture_recruitment,
        application_text='Application 2',
    )

    # Initially, there should be two active applications.
    active_apps = RecruitmentApplication.objects.filter(user=fixture_user, recruitment=fixture_recruitment, withdrawn=False)
    assert active_apps.count() == 2
    max_priority = max(app.applicant_priority for app in active_apps)
    assert max_priority == 2

    # Withdraw the first application. Save should trigger reordering.
    app1.withdrawn = True
    app1.save()

    # Re-fetch active applications.
    active_apps = RecruitmentApplication.objects.filter(user=fixture_user, recruitment=fixture_recruitment, withdrawn=False)
    active_count = active_apps.count()
    max_priority = max(app.applicant_priority for app in active_apps)
    # Now there should only be one active application and its applicant_priority should be 1.
    assert active_count == 1
    assert max_priority == 1, f'After withdrawal, expected highest priority to be 1, but got {max_priority}'


def test_reapplication_updates_priority(
    fixture_user: User,
    fixture_recruitment: Recruitment,
    fixture_recruitment_position: RecruitmentPosition,
    fixture_recruitment_position2: RecruitmentPosition,
):
    """tests that reactivating an application updates priority correctly"""
    # Create two applications on different positions
    app1 = RecruitmentApplication.objects.create(
        user=fixture_user,
        recruitment_position=fixture_recruitment_position,
        recruitment=fixture_recruitment,
        application_text='Application 1',
    )
    app2 = RecruitmentApplication.objects.create(
        user=fixture_user,
        recruitment_position=fixture_recruitment_position2,
        recruitment=fixture_recruitment,
        application_text='Application 2',
    )
    # Initially, app1 should have priority 1 and app2 priority 2.
    assert app1.applicant_priority == 1
    assert app2.applicant_priority == 2

    # Withdraw the first application.
    app1.withdrawn = True
    app1.save()

    # Check that only one active application remains.
    active_apps = RecruitmentApplication.objects.filter(user=fixture_user, recruitment=fixture_recruitment, withdrawn=False)
    assert active_apps.count() == 1
    # The highest (and only) applicant_priority should be 1.
    max_priority = max(app.applicant_priority for app in active_apps)
    assert max_priority == 1

    # Simulate a reapplication by updating the withdrawn application to active.
    # (Since the clean() method prevents creating a new application for the same recruitment position.)
    app1.withdrawn = False
    app1.application_text = 'Reapplied'
    app1.save()

    # Now, there should be two active applications, and the highest applicant_priority must equal 2.
    active_apps = RecruitmentApplication.objects.filter(user=fixture_user, recruitment=fixture_recruitment, withdrawn=False)
    active_count = active_apps.count()
    max_priority = max(app.applicant_priority for app in active_apps)
    assert active_count == 2
    assert max_priority == active_count, f'Expected highest priority to be {active_count}, but got {max_priority}'
