from __future__ import annotations

from typing import Any
from datetime import time, datetime
from collections.abc import Iterator

import pytest

from rest_framework.test import APIClient

from django.test import Client, TestCase
from django.utils import timezone
from django.core.files.images import ImageFile
from django.contrib.auth.models import Group

import root.management.commands.seed_scripts.billig as billig_seed
from root.settings import BASE_DIR

from samfundet.constants import DEV_PASSWORD
from samfundet.models.event import Event
from samfundet.models.billig import BilligEvent
from samfundet.models.general import Gang, User, Image, Merch, Table, Venue, BlogPost, TextItem, Reservation, Organization, MerchVariation, InformationPage
from samfundet.models.recruitment import Recruitment, RecruitmentPosition, RecruitmentAdmission
from samfundet.models.model_choices import EventTicketType, EventAgeRestriction, RecruitmentStatusChoices, RecruitmentPriorityChoices

"""
This module contains fixtures available in pytests.
These do not need to be imported.

It's recommended to yield objects, and tear them down afterwards.

https://docs.pytest.org/en/7.1.x/how-to/fixtures.html
"""

TestCase.databases = {'default', 'billig'}


@pytest.fixture(autouse=True)
def fixture_setup_keyvalues() -> None:
    """
    This fixture populates the environment variables (KeyValue) in the database.
    This fixture will be used on every test because of 'autouse=True'.
    'db' enables database access to all tests.
    """
    ...


@pytest.fixture(autouse=True)
def fixture_db(db: Any) -> Any:
    """
    'db' is a magic fixture from pytest-django.
    It enables database access for any fixture/test that inherits this one.
    This is simply a wrapper to add a more explanatory docstring.
    """
    yield db


@pytest.fixture(autouse=True)
def fixture_db_billig() -> Iterator[None]:
    billig_seed.create_db()
    yield None


@pytest.fixture
def fixture_rest_client() -> APIClient:
    yield APIClient()


@pytest.fixture
def fixture_django_client() -> Client:
    yield Client()


@pytest.fixture()
def fixture_date_monday() -> Iterator[datetime]:
    yield datetime(day=25, year=2023, month=12)  # monday


@pytest.fixture()
def fixture_date_tuesday() -> Iterator[datetime]:
    yield datetime(day=26, year=2023, month=12)  # tuesday


@pytest.fixture
def fixture_superuser_pw() -> Iterator[str]:
    yield DEV_PASSWORD


@pytest.fixture
def fixture_superuser(fixture_superuser_pw: str) -> Iterator[User]:
    superuser = User.objects.create_superuser(
        username='superuser',
        email='superuser@test.com',
        password=fixture_superuser_pw,
    )
    yield superuser
    superuser.delete()


@pytest.fixture
def fixture_staff_pw() -> Iterator[str]:
    yield DEV_PASSWORD


@pytest.fixture
def fixture_staff(fixture_staff_pw: str) -> Iterator[User]:
    staff = User.objects.create_user(
        username='staff',
        email='staff@test.com',
        password=fixture_staff_pw,
        is_staff=True,
    )
    yield staff
    staff.delete()


@pytest.fixture
def fixture_user_pw() -> Iterator[str]:
    yield DEV_PASSWORD


@pytest.fixture
def fixture_user(fixture_user_pw: str) -> Iterator[User]:
    user = User.objects.create_user(
        username='user',
        email='user@test.com',
        password=fixture_user_pw,
    )
    yield user
    user.delete()


@pytest.fixture
def fixture_user2(fixture_user_pw: str) -> Iterator[User]:
    # Extra user if need
    user = User.objects.create_user(
        username='user2',
        email='user2@test.com',
        password=fixture_user_pw,
    )
    yield user
    user.delete()


@pytest.fixture
def fixture_image() -> Iterator[Image]:
    path = BASE_DIR / 'samfundet' / 'tests' / 'test_image.jpg'
    with open(path, 'rb') as file:
        img = Image.objects.create(title='Image', image=ImageFile(file, name='Image'))
    yield img
    img.delete()


@pytest.fixture
def fixture_billig_event() -> Iterator[BilligEvent]:
    event = BilligEvent.objects.create(
        id=69,
        name='Test Event',
        sale_from=timezone.datetime.now(),
        sale_to=timezone.datetime.now() + timezone.timedelta(days=1),
        hidden=False,
    )
    yield event
    event.delete()


@pytest.fixture
def fixture_event(fixture_image: Image) -> Iterator[Event]:
    event = Event.objects.create(
        title_nb='Test Event',
        title_en='Test Event',
        start_dt=timezone.now(),
        publish_dt=timezone.now() - timezone.timedelta(hours=1),
        duration=60,
        description_long_nb='description',
        description_long_en='description',
        description_short_nb='description',
        description_short_en='description',
        location='location',
        host='host',
        image=fixture_image,
        age_restriction=EventAgeRestriction.AGE_18,
        capacity=100,
    )
    yield event
    event.delete()


@pytest.fixture
def fixture_event_with_billig(fixture_event: Event, fixture_billig_event: BilligEvent) -> Iterator[tuple[Event, BilligEvent]]:
    fixture_event.ticket_type = EventTicketType.BILLIG
    fixture_event.billig_id = fixture_billig_event.id
    fixture_event.save()
    yield fixture_event, fixture_billig_event


@pytest.fixture
def fixture_group() -> Iterator[Group]:
    group = Group.objects.create(name='testgroup')
    yield group
    group.delete()


@pytest.fixture
def fixture_organization() -> Iterator[Organization]:
    organization = Organization.objects.create(name='Samfundet')
    yield organization
    organization.delete()


@pytest.fixture
def fixture_gang(fixture_organization: Organization) -> Iterator[Gang]:
    organization = Gang.objects.create(
        name_nb='Gang',
        name_en='Gang',
        abbreviation='G',
        organization=fixture_organization,
    )
    yield organization
    organization.delete()


@pytest.fixture
def fixture_gang2(fixture_organization: Organization) -> Iterator[Gang]:
    organization = Gang.objects.create(
        name_nb='Gang 2',
        name_en='Gang 2',
        abbreviation='G2',
        organization=fixture_organization,
    )
    yield organization
    organization.delete()


@pytest.fixture
def fixture_text_item() -> Iterator[TextItem]:
    text_item = TextItem.objects.create(
        key='foo',
        text_nb='foo',
        text_en='foo',
    )
    yield text_item
    text_item.delete()


@pytest.fixture
def fixture_merch(fixture_image: Image) -> Iterator[Merch]:
    merch = Merch.objects.create(
        name_nb='basic merch', name_en='basic merch', description_nb='basic merch', description_en='basic merch', base_price=100, image=fixture_image
    )
    yield merch
    merch.delete()


@pytest.fixture
def fixture_merchvariation(fixture_merch: Merch) -> Iterator[MerchVariation]:
    merch_variation = MerchVariation.objects.create(specification='big', stock=69, merch=fixture_merch)
    yield merch_variation
    merch_variation.delete()


@pytest.fixture
def fixture_recruitment(fixture_organization: Organization) -> Iterator[Recruitment]:
    now = timezone.now()
    one_hour = timezone.timedelta(hours=1)

    # Create a recruitment instance with valid data
    recruitment = Recruitment.objects.create(
        name_nb='Test Recruitment NB',
        name_en='Test Recruitment EN',
        visible_from=now,
        actual_application_deadline=now + 3 * one_hour,
        shown_application_deadline=now + one_hour,
        reprioritization_deadline_for_applicant=now + 4 * one_hour,
        reprioritization_deadline_for_groups=now + 6 * one_hour,
        organization=fixture_organization,
    )
    yield recruitment
    recruitment.delete()


@pytest.fixture
def fixture_recruitment_position(fixture_recruitment: Recruitment, fixture_gang: Gang) -> Iterator[Recruitment]:
    recruitment_position = RecruitmentPosition.objects.create(
        name_nb='Position NB',
        name_en='Position EN',
        short_description_nb='Short Description NB',
        short_description_en='Short Description EN',
        long_description_nb='Long Description NB',
        long_description_en='Long Description EN',
        is_funksjonaer_position=False,
        default_admission_letter_nb='Default Admission Letter NB',
        default_admission_letter_en='Default Admission Letter EN',
        tags='tag1,tag2',
        gang=fixture_gang,
        recruitment=fixture_recruitment,
    )
    yield recruitment_position
    recruitment_position.delete()


@pytest.fixture
def fixture_recruitment_position2(fixture_recruitment: Recruitment, fixture_gang: Gang) -> Iterator[Recruitment]:
    recruitment_position = RecruitmentPosition.objects.create(
        name_nb='Position NB 2',
        name_en='Position EN 2',
        short_description_nb='Short Description NB 2',
        short_description_en='Short Description EN 2',
        long_description_nb='Long Description NB 2',
        long_description_en='Long Description EN 2',
        is_funksjonaer_position=False,
        default_admission_letter_nb='Default Admission Letter NB 2',
        default_admission_letter_en='Default Admission Letter EN 2',
        tags='tag1,tag2',
        gang=fixture_gang,
        recruitment=fixture_recruitment,
    )
    yield recruitment_position
    recruitment_position.delete()


@pytest.fixture
def fixture_informationpage() -> Iterator[InformationPage]:
    informationpage = InformationPage.objects.create(title_nb='Norsk tittel', title_en='Engel', slug_field='Sygard')
    yield informationpage
    informationpage.delete()


@pytest.fixture
def fixture_blogpost(fixture_image: Image) -> Iterator[BlogPost]:
    blogpost = BlogPost.objects.create(
        title_nb='Tittel',
        title_en='Title',
        text_nb='halla verden',
        text_en='hellow world uWu',
        image=fixture_image,
    )
    yield blogpost
    blogpost.delete()


@pytest.fixture
def fixture_recruitment_admission(
    fixture_user: User,
    fixture_recruitment_position: RecruitmentPosition,
    fixture_recruitment: Recruitment,
) -> Iterator[RecruitmentAdmission]:
    admission = RecruitmentAdmission.objects.create(
        admission_text='Test admission text',
        recruitment_position=fixture_recruitment_position,
        recruitment=fixture_recruitment,
        user=fixture_user,
        applicant_priority=1,
        recruiter_priority=RecruitmentPriorityChoices.NOT_SET,
        recruiter_status=RecruitmentStatusChoices.NOT_SET,
    )
    yield admission
    admission.delete()


@pytest.fixture
def fixture_recruitment_admission2(
    fixture_user: User,
    fixture_recruitment_position2: RecruitmentPosition,
    fixture_recruitment: Recruitment,
) -> Iterator[RecruitmentAdmission]:
    admission2 = RecruitmentAdmission.objects.create(
        admission_text='Test admission text',
        recruitment_position=fixture_recruitment_position2,
        recruitment=fixture_recruitment,
        user=fixture_user,
        applicant_priority=2,
        recruiter_priority=RecruitmentPriorityChoices.NOT_SET,
        recruiter_status=RecruitmentStatusChoices.NOT_SET,
    )
    yield admission2
    admission2.delete()


@pytest.fixture
def fixture_venue() -> Iterator[Venue]:
    venue = Venue.objects.create(
        name='venue',
        slug='venue',
        description='Some description',
        floor=1,
        last_renovated=timezone.now(),
        handicapped_approved=True,
        responsible_crew='Cypress team',
        opening_monday=time(hour=8),
        closing_monday=time(hour=14),
        opening_tuesday=time(hour=8),
        closing_tuesday=time(hour=14),
    )

    yield venue
    venue.delete()


@pytest.fixture
def fixture_table(fixture_venue: Venue) -> Iterator[Table]:
    table = Table.objects.create(
        name_nb='table 1',
        description_nb='table',
        name_en='table 1',
        description_en='table',
        seating=4,
        venue=fixture_venue,
    )
    yield table
    table.delete()


@pytest.fixture
def fixture_reservation(fixture_venue: Venue, fixture_table: Table, fixture_date_monday: datetime) -> Iterator[Reservation]:
    reservation = Reservation.objects.create(
        venue=fixture_venue,
        table=fixture_table,
        guest_count=4,
        start_time=time(hour=10),
        end_time=time(hour=11),
        reservation_date=fixture_date_monday,
    )
    yield reservation
    reservation.delete()
