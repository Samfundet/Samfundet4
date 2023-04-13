from typing import Iterator, Any

import pytest
from django.core.files.images import ImageFile

from django.utils import timezone
from django.test import Client
from rest_framework.test import APIClient

from root.settings import BASE_DIR
from samfundet.contants import DEV_PASSWORD
from samfundet.models.billig import BilligEvent
from samfundet.models.event import Event, EventAgeRestriction, EventTicketType
from samfundet.models.general import User, Image

import root.management.commands.seed_scripts.billig as billig_seed
"""
This module contains fixtures available in pytests.
These do not need to be imported.

It's recommended to yield objects, and tear them down afterwards.

https://docs.pytest.org/en/7.1.x/how-to/fixtures.html
"""

from django.test import TestCase

TestCase.databases = {"default", "billig"}


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
def fixture_db_billig() -> None:
    billig_seed.create_db()
    yield True


@pytest.fixture
def fixture_rest_client() -> APIClient:
    yield APIClient()


@pytest.fixture
def fixture_django_client() -> Client:
    yield Client()


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
def fixture_image() -> Image:
    path = BASE_DIR / 'samfundet' / 'tests' / 'test_image.jpg'
    with open(path, 'rb') as file:
        img = Image.objects.create(title="Image", image=ImageFile(file, name='Image'))
    yield img
    img.delete()


@pytest.fixture
def fixture_billig_event() -> BilligEvent:
    event = BilligEvent.objects.create(
        id=69, name="Test Event", sale_from=timezone.datetime.now(), sale_to=timezone.datetime.now() + timezone.timedelta(days=1), hidden=False
    )
    yield event
    event.delete()


@pytest.fixture
def fixture_event(fixture_image: Image) -> Event:
    event = Event.objects.create(
        title_nb="Test Event",
        title_en="Test Event",
        start_dt=timezone.now(),
        publish_dt=timezone.now() - timezone.timedelta(hours=1),
        duration=60,
        description_long_nb="",
        description_long_en="",
        description_short_nb="",
        description_short_en="",
        location="",
        image=fixture_image,
        age_restriction=EventAgeRestriction.AGE_18,
        capacity=100,
        host="",
    )
    yield event
    event.delete()


@pytest.fixture
def fixture_event_with_billig(fixture_event: Event, fixture_billig_event: BilligEvent) -> tuple[Event, BilligEvent]:
    fixture_event.ticket_type = EventTicketType.BILLIG
    fixture_event.billig_id = fixture_billig_event.id
    fixture_event.save()
    yield fixture_event, fixture_billig_event
