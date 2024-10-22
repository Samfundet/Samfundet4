from __future__ import annotations

from datetime import timedelta
from unittest.mock import patch

import pytest

from django.utils import timezone

from samfundet.models.general import Gang, User, GangSection, Organization
from samfundet.models.recruitment import Recruitment, OccupiedTimeslot, RecruitmentPosition, RecruitmentPositionSharedInterviewGroup
from samfundet.automatic_interview_allocation.utils import is_applicant_available, get_interviewers_grouped_by_section, get_available_interviewers_for_timeslot


@pytest.fixture
def setup_recruitment():
    organization = Organization.objects.create(name='Test Org')
    now = timezone.now()
    recruitment = Recruitment.objects.create(
        name_nb='Test Recruitment',
        name_en='Test Recruitment',
        organization=organization,
        visible_from=now,
        actual_application_deadline=now + timedelta(days=30),
        shown_application_deadline=now + timedelta(days=28),
        reprioritization_deadline_for_applicant=now + timedelta(days=35),
        reprioritization_deadline_for_groups=now + timedelta(days=40),
    )
    return organization, recruitment


@pytest.fixture
def setup_users():
    user1 = User.objects.create(username='user1', email='user1@example.com')
    user2 = User.objects.create(username='user2', email='user2@example.com')
    user3 = User.objects.create(username='user3', email='user3@example.com')
    return user1, user2, user3


@pytest.mark.django_db
def test_get_available_interviewers_for_timeslot(setup_recruitment, setup_users):
    recruitment = setup_recruitment
    user1, user2, user3 = setup_users

    with patch('samfundet.models.recruitment.OccupiedTimeslot.objects.filter') as mock_filter:
        mock_filter.return_value.filter.return_value.values_list.return_value = [user1.id]

        start_dt = timezone.now()
        end_dt = start_dt + timedelta(hours=1)

        available_interviewers = get_available_interviewers_for_timeslot([user1, user2, user3], start_dt, end_dt, recruitment)

        assert len(available_interviewers) == 2
        assert user1 not in available_interviewers
        assert user2 in available_interviewers
        assert user3 in available_interviewers


@pytest.mark.django_db
def test_is_applicant_available(setup_recruitment, setup_users):
    recruitment = setup_recruitment
    user1 = setup_users

    with (
        patch('samfundet.models.recruitment.Interview.objects.filter') as mock_interview_filter,
        patch('samfundet.models.recruitment.OccupiedTimeslot.objects.filter') as mock_occupied_filter,
    ):
        # Test when applicant is available
        mock_interview_filter.return_value.exists.return_value = False
        mock_occupied_filter.return_value.filter.return_value.exists.return_value = False

        start_dt = timezone.now()
        end_dt = start_dt + timedelta(hours=1)

        is_available = is_applicant_available(user1, start_dt, end_dt, recruitment)
        assert is_available is True

        # Test when applicant has an interview
        mock_interview_filter.return_value.exists.return_value = True

        is_available = is_applicant_available(user1, start_dt, end_dt, recruitment)
        assert is_available is False

        # Test when applicant has an occupied timeslot
        mock_interview_filter.return_value.exists.return_value = False
        mock_occupied_filter.return_value.filter.return_value.exists.return_value = True

        is_available = is_applicant_available(user1, start_dt, end_dt, recruitment)
        assert is_available is False


@pytest.mark.django_db
def test_get_interviewers_grouped_by_section(setup_recruitment, setup_users):
    organization, recruitment = setup_recruitment
    user1, user2, user3 = setup_users

    gang1 = Gang.objects.create(name_nb='Gang 1', name_en='Gang 1', organization=organization)
    gang2 = Gang.objects.create(name_nb='Gang 2', name_en='Gang 2', organization=organization)

    section1 = GangSection.objects.create(name_nb='Section 1', name_en='Section 1', gang=gang1)
    section2 = GangSection.objects.create(name_nb='Section 2', name_en='Section 2', gang=gang2)

    position1 = RecruitmentPosition.objects.create(
        name_nb='Position 1',
        name_en='Position 1',
        section=section1,
        recruitment=recruitment,
        short_description_nb='Short description 1',
        short_description_en='Short description 1 EN',
        long_description_nb='Long description 1',
        long_description_en='Long description 1 EN',
        is_funksjonaer_position=False,
        default_application_letter_nb='Default application letter 1',
        default_application_letter_en='Default application letter 1 EN',
        tags='tag1,tag2',
    )
    position2 = RecruitmentPosition.objects.create(
        name_nb='Position 2',
        name_en='Position 2',
        section=section2,
        recruitment=recruitment,
        short_description_nb='Short description 2',
        short_description_en='Short description 2 EN',
        long_description_nb='Long description 2',
        long_description_en='Long description 2 EN',
        is_funksjonaer_position=False,
        default_application_letter_nb='Default application letter 2',
        default_application_letter_en='Default application letter 2 EN',
        tags='tag2,tag3',
    )

    position1.interviewers.add(user1, user2)
    position2.interviewers.add(user2, user3)

    shared_group = RecruitmentPositionSharedInterviewGroup.objects.create(recruitment=recruitment)
    shared_group.positions.add(position1, position2)

    recruitment_position = RecruitmentPosition.objects.create(
        name_nb='Shared Position',
        name_en='Shared Position',
        recruitment=recruitment,
        short_description_nb='Short description shared',
        short_description_en='Short description shared EN',
        long_description_nb='Long description shared',
        long_description_en='Long description shared EN',
        is_funksjonaer_position=False,
        default_application_letter_nb='Default application letter shared',
        default_application_letter_en='Default application letter shared EN',
        tags='tag1,tag2,tag3',
        gang=gang1,
    )
    recruitment_position.shared_interview_group = shared_group
    recruitment_position.save()

    result = get_interviewers_grouped_by_section(recruitment_position)

    assert len(result) == 2
    assert section1 in result
    assert section2 in result
    assert result[section1].count() == 2
    assert result[section2].count() == 2
    assert user1 in result[section1]
    assert user2 in result[section1]
    assert user2 in result[section2]
    assert user3 in result[section2]


# New tests start here


@pytest.mark.django_db
def test_get_available_interviewers_no_interviewers(setup_recruitment):
    organization, recruitment = setup_recruitment
    start_dt = timezone.now()
    end_dt = start_dt + timedelta(hours=1)

    available_interviewers = get_available_interviewers_for_timeslot([], start_dt, end_dt, recruitment)
    assert len(available_interviewers) == 0


@pytest.mark.django_db
def test_get_available_interviewers_all_occupied(setup_recruitment, setup_users):
    recruitment = setup_recruitment
    user1, user2, user3 = setup_users
    start_dt = timezone.now()
    end_dt = start_dt + timedelta(hours=1)

    with patch('samfundet.models.recruitment.OccupiedTimeslot.objects.filter') as mock_filter:
        mock_filter.return_value.filter.return_value.values_list.return_value = {user1.id, user2.id, user3.id}
        available_interviewers = get_available_interviewers_for_timeslot([user1, user2, user3], start_dt, end_dt, recruitment)
        assert len(available_interviewers) == 0


@pytest.mark.django_db
def test_get_available_interviewers_complex_overlap(setup_recruitment, setup_users):
    recruitment = setup_recruitment
    user1, user2, user3 = setup_users
    start_dt = timezone.now()
    mid_dt = start_dt + timedelta(minutes=30)
    end_dt = start_dt + timedelta(hours=1)

    with patch('samfundet.models.recruitment.OccupiedTimeslot.objects.filter') as mock_filter:
        mock_filter.return_value.filter.return_value.values_list.return_value = {
            user1.id,  # user1 is occupied for the entire period
            user2.id,  # user2 is occupied for the first half
        }
        available_interviewers = get_available_interviewers_for_timeslot([user1, user2, user3], start_dt, end_dt, recruitment)
        assert len(available_interviewers) == 1
        assert user3 in available_interviewers

        # Now check for the second half of the time period
        mock_filter.return_value.filter.return_value.values_list.return_value = {
            user1.id,  # user1 is still occupied
            user3.id,  # user3 is now occupied
        }
        available_interviewers = get_available_interviewers_for_timeslot([user1, user2, user3], mid_dt, end_dt, recruitment)
        assert len(available_interviewers) == 1
        assert user2 in available_interviewers


@pytest.mark.django_db
def test_is_applicant_available_multiple_conflicts(setup_recruitment, setup_users):
    recruitment = setup_recruitment
    user1, _, _ = setup_users
    start_dt = timezone.now()
    end_dt = start_dt + timedelta(hours=2)

    with (
        patch('samfundet.models.recruitment.Interview.objects.filter') as mock_interview_filter,
        patch('samfundet.models.recruitment.OccupiedTimeslot.objects.filter') as mock_occupied_filter,
    ):
        mock_interview_filter.return_value.exists.return_value = True
        mock_occupied_filter.return_value.filter.return_value.exists.return_value = True

        is_available = is_applicant_available(user1, start_dt, end_dt, recruitment)
        assert is_available is False


@pytest.mark.django_db
def test_is_applicant_available_edge_cases(setup_recruitment, setup_users):
    recruitment = setup_recruitment
    user1, _, _ = setup_users
    start_dt = timezone.now()
    end_dt = start_dt + timedelta(microseconds=1)

    with (
        patch('samfundet.models.recruitment.Interview.objects.filter') as mock_interview_filter,
        patch('samfundet.models.recruitment.OccupiedTimeslot.objects.filter') as mock_occupied_filter,
    ):
        mock_interview_filter.return_value.exists.return_value = False
        mock_occupied_filter.return_value.filter.return_value.exists.return_value = False

        is_available = is_applicant_available(user1, start_dt, end_dt, recruitment)
        assert is_available is True


@pytest.mark.django_db
def test_get_interviewers_grouped_by_section_complex(setup_recruitment, setup_users):
    organization, recruitment = setup_recruitment
    user1, user2, user3 = setup_users

    gang1 = Gang.objects.create(name_nb='Gang 1', name_en='Gang 1', organization=organization)
    gang2 = Gang.objects.create(name_nb='Gang 2', name_en='Gang 2', organization=organization)

    section1 = GangSection.objects.create(name_nb='Section 1', name_en='Section 1', gang=gang1)
    section2 = GangSection.objects.create(name_nb='Section 2', name_en='Section 2', gang=gang2)
    section3 = GangSection.objects.create(name_nb='Section 3', name_en='Section 3', gang=gang1)

    position1 = RecruitmentPosition.objects.create(
        name_nb='Position 1',
        name_en='Position 1',
        section=section1,
        recruitment=recruitment,
        short_description_nb='Short 1',
        short_description_en='Short 1 EN',
        long_description_nb='Long 1',
        long_description_en='Long 1 EN',
        is_funksjonaer_position=False,
        default_application_letter_nb='Default 1',
        default_application_letter_en='Default 1 EN',
        tags='tag1',
    )
    position2 = RecruitmentPosition.objects.create(
        name_nb='Position 2',
        name_en='Position 2',
        section=section2,
        recruitment=recruitment,
        short_description_nb='Short 2',
        short_description_en='Short 2 EN',
        long_description_nb='Long 2',
        long_description_en='Long 2 EN',
        is_funksjonaer_position=False,
        default_application_letter_nb='Default 2',
        default_application_letter_en='Default 2 EN',
        tags='tag2',
    )
    position3 = RecruitmentPosition.objects.create(
        name_nb='Position 3',
        name_en='Position 3',
        section=section3,
        recruitment=recruitment,
        short_description_nb='Short 3',
        short_description_en='Short 3 EN',
        long_description_nb='Long 3',
        long_description_en='Long 3 EN',
        is_funksjonaer_position=False,
        default_application_letter_nb='Default 3',
        default_application_letter_en='Default 3 EN',
        tags='tag3',
    )

    position1.interviewers.add(user1, user2)
    position2.interviewers.add(user2, user3)
    position3.interviewers.add(user1, user3)

    shared_group = RecruitmentPositionSharedInterviewGroup.objects.create(recruitment=recruitment)
    shared_group.positions.add(position1, position2, position3)

    recruitment_position = RecruitmentPosition.objects.create(
        name_nb='Shared Position',
        name_en='Shared Position',
        recruitment=recruitment,
        short_description_nb='Short shared',
        short_description_en='Short shared EN',
        long_description_nb='Long shared',
        long_description_en='Long shared EN',
        is_funksjonaer_position=False,
        default_application_letter_nb='Default shared',
        default_application_letter_en='Default shared EN',
        tags='tag1,tag2,tag3',
        gang=gang1,
    )
    recruitment_position.shared_interview_group = shared_group
    recruitment_position.save()

    result = get_interviewers_grouped_by_section(recruitment_position)

    assert len(result) == 3
    assert section1 in result
    assert section2 in result
    assert section3 in result
    assert result[section1].count() == 2
    assert result[section2].count() == 2
    assert result[section3].count() == 2
    assert user1 in result[section1]
    assert user2 in result[section1]
    assert user2 in result[section2]
    assert user3 in result[section2]
    assert user1 in result[section3]
    assert user3 in result[section3]


@pytest.mark.django_db
def test_get_available_interviewers_for_timeslot_filtering(setup_recruitment, setup_users):
    """Test the get_available_interviewers_for_timeslot function with various scenarios."""
    organization, recruitment = setup_recruitment  # Fixed: properly unpack the tuple
    user1, user2, user3 = setup_users
    user4, user5, user6 = [User.objects.create(username=f'user{i}', email=f'user{i}@example.com') for i in range(4, 7)]
    start_dt = timezone.now()
    end_dt = start_dt + timedelta(hours=2)

    def create_occupied_timeslot(user: User, start_offset: timedelta, end_offset: timedelta) -> OccupiedTimeslot:
        return OccupiedTimeslot.objects.create(user=user, recruitment=recruitment, start_dt=start_dt + start_offset, end_dt=start_dt + end_offset)

    # Create OccupiedTimeslots for different scenarios
    scenarios = [
        (user1, timedelta(hours=-1), timedelta(minutes=30)),  # Overlaps start
        (user2, timedelta(hours=1, minutes=30), timedelta(hours=3)),  # Overlaps end
        (user3, timedelta(minutes=30), timedelta(hours=1, minutes=30)),  # Fully within
        (user4, timedelta(hours=-2), timedelta(hours=-1)),  # Before interval
        (user5, timedelta(hours=3), timedelta(hours=4)),  # After interval
        (user6, timedelta(hours=-1), timedelta(hours=3)),  # Completely encompasses interval
    ]

    for user, start_offset, end_offset in scenarios:
        create_occupied_timeslot(user, start_offset, end_offset)

    # Test with the exact interval
    available_interviewers = get_available_interviewers_for_timeslot([user1, user2, user3, user4, user5, user6], start_dt, end_dt, recruitment)
    assert set(available_interviewers) == {user4, user5}

    # Add detailed checks immediately after the exact interval test
    assert user1 not in available_interviewers, 'User1 should be unavailable due to overlap with start'
    assert user2 not in available_interviewers, 'User2 should be unavailable due to overlap with end'
    assert user3 not in available_interviewers, 'User3 should be unavailable due to being fully within interval'
    assert user4 in available_interviewers, 'User4 should be available (occupied time is before interval)'
    assert user5 in available_interviewers, 'User5 should be available (occupied time is after interval)'
    assert user6 not in available_interviewers, 'User6 should be unavailable (occupied time encompasses interval)'

    # Test with a smaller interval
    smaller_end_dt = start_dt + timedelta(hours=1)
    available_interviewers_smaller = get_available_interviewers_for_timeslot([user1, user2, user3, user4, user5, user6], start_dt, smaller_end_dt, recruitment)
    assert set(available_interviewers_smaller) == {user2, user4, user5}

    # Test with a larger interval
    larger_end_dt = start_dt + timedelta(hours=3)
    available_interviewers_larger = get_available_interviewers_for_timeslot([user1, user2, user3, user4, user5, user6], start_dt, larger_end_dt, recruitment)

    # Since user5's occupied time is after the requested interval, they should be available
    assert set(available_interviewers_larger) == {user4, user5}

    # Detailed assertions
    assert user1 not in available_interviewers, 'User1 should be unavailable due to overlap with start'
    assert user2 not in available_interviewers, 'User2 should be unavailable due to overlap with end'
    assert user3 not in available_interviewers, 'User3 should be unavailable due to being fully within interval'
    assert user4 in available_interviewers, 'User4 should be available (occupied time is before interval)'
    assert user5 in available_interviewers, 'User5 should be available (occupied time is after interval)'
    assert user6 not in available_interviewers, 'User6 should be unavailable (occupied time encompasses interval)'

    # Test with no interviewers
    assert len(get_available_interviewers_for_timeslot([], start_dt, end_dt, recruitment)) == 0

    # Test with no occupied timeslots
    OccupiedTimeslot.objects.all().delete()
    all_available = get_available_interviewers_for_timeslot([user1, user2, user3, user4, user5, user6], start_dt, end_dt, recruitment)
    assert set(all_available) == {user1, user2, user3, user4, user5, user6}
