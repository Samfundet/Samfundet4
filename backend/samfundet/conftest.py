from typing import Iterator
import pytest

from rest_framework.test import APIClient

from django.test import Client
from django.contrib.auth.models import User

# pylint: disable=pointless-string-statement
"""
This module contains fixtures available in pytests.
These do not need to be imported.

It's recommended to yield objects, and tear them down afterwards.

https://docs.pytest.org/en/7.1.x/how-to/fixtures.html
"""

# pylint: disable=unused-argument # These are fixtures.


@pytest.fixture
def fixture_rest_client() -> APIClient:
    yield APIClient()


@pytest.fixture
def fixture_django_client() -> Client:
    yield Client()


@pytest.fixture
def fixture_superuser_pw() -> Iterator[str]:
    yield 'Django123'


@pytest.fixture
def fixture_superuser(db, fixture_superuser_pw: str) -> Iterator[User]:  # type: ignore[no-untyped-def]
    superuser = User.objects.create_superuser(  # nosec hardcoded_password_funcarg
        username='superuser',
        email='superuser@test.com',
        password=fixture_superuser_pw,
    )
    yield superuser
    superuser.delete()


@pytest.fixture
def fixture_staff_pw() -> Iterator[str]:
    yield 'Django123'


@pytest.fixture
def fixture_staff(db, fixture_staff_pw) -> Iterator[User]:  # type: ignore[no-untyped-def]
    staff = User.objects.create_user(  # nosec hardcoded_password_funcarg
        username='staff',
        email='staff@test.com',
        password=fixture_staff_pw,
        is_staff=True,
    )
    yield staff
    staff.delete()


@pytest.fixture
def fixture_user_pw() -> Iterator[str]:
    yield 'Django123'


@pytest.fixture
def fixture_user(db, fixture_user_pw) -> Iterator[User]:  # type: ignore[no-untyped-def]
    user = User.objects.create_user(  # nosec hardcoded_password_funcarg
        username='user',
        email='user@test.com',
        password=fixture_user_pw,
    )
    yield user
    user.delete()
