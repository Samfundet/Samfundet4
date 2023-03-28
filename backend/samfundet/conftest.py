from typing import Iterator, Any
import pytest

from rest_framework.test import APIClient

from django.test import Client

from samfundet.models import User
from samfundet.contants import DEV_PASSWORD
"""
This module contains fixtures available in pytests.
These do not need to be imported.

It's recommended to yield objects, and tear them down afterwards.

https://docs.pytest.org/en/7.1.x/how-to/fixtures.html
"""


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
