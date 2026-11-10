from __future__ import annotations

import datetime
from collections.abc import Iterator

import pytest

from django.utils import timezone
from django.core.management import call_command

from samfundet.models.general import ClosedPeriod
from samfundet.samf3_import.dev import create_schema
from samfundet.samf3_import.models import Samf3EverythingClosedPeriod
from samfundet.samf3_import.importers.closed_periods import ClosedPeriodImporter

pytestmark = pytest.mark.django_db(databases=['default', 'billig', 'samf3'])


@pytest.fixture(autouse=True)
def fixture_samf3_schema() -> Iterator[None]:
    create_schema()
    yield


def make_samf3_period(**kwargs: object) -> Samf3EverythingClosedPeriod:
    values: dict[str, object] = {
        'id': 1,
        'message_no': 'Stengt i julen',
        'message_en': 'Closed for Christmas',
        # Stored as UTC in a `timestamp without time zone`, like Rails does.
        # 23:30 UTC is the next day in Norway.
        'closed_from': datetime.datetime(2026, 12, 20, 23, 30, tzinfo=datetime.UTC),
        'closed_to': datetime.datetime(2027, 1, 2, 12, 0, tzinfo=datetime.UTC),
    }
    values.update(kwargs)
    return Samf3EverythingClosedPeriod.objects.create(**values)


def test_creates_period_with_norwegian_dates() -> None:
    make_samf3_period()

    report = ClosedPeriodImporter().run()

    assert report.created == 1
    period = ClosedPeriod.objects.get(samf3_id=1)
    assert period.message_nb == 'Stengt i julen'
    assert period.message_en == 'Closed for Christmas'
    assert period.start_dt == datetime.date(2026, 12, 21)
    assert period.end_dt == datetime.date(2027, 1, 2)
    assert period.imported_at == period.updated_at


def test_running_twice_does_not_duplicate() -> None:
    make_samf3_period()

    ClosedPeriodImporter().run()
    report = ClosedPeriodImporter().run()

    assert report.created == 0
    assert report.unchanged == 1
    assert ClosedPeriod.objects.count() == 1


def test_updates_when_samf3_changes() -> None:
    samf3_period = make_samf3_period()
    ClosedPeriodImporter().run()

    samf3_period.message_no = 'Ny melding'
    samf3_period.save()
    report = ClosedPeriodImporter().run()

    assert report.updated == 1
    assert ClosedPeriod.objects.get(samf3_id=1).message_nb == 'Ny melding'


def test_skips_period_edited_in_samf4() -> None:
    samf3_period = make_samf3_period()
    ClosedPeriodImporter().run()
    period = ClosedPeriod.objects.get(samf3_id=1)
    period.message_nb = 'Endret i Samf4'
    period.save()

    samf3_period.message_no = 'Ny melding'
    samf3_period.save()
    report = ClosedPeriodImporter().run()

    assert [skipped.samf3_id for skipped in report.skipped] == [1]
    assert ClosedPeriod.objects.get(samf3_id=1).message_nb == 'Endret i Samf4'


def test_skips_too_long_message() -> None:
    make_samf3_period(message_no='a' * 201)

    report = ClosedPeriodImporter().run()

    assert len(report.skipped) == 1
    assert not ClosedPeriod.objects.exists()


def test_delete_imported_keeps_samf4_rows() -> None:
    make_samf3_period()
    ClosedPeriodImporter().run()
    today = timezone.localdate()
    ClosedPeriod.objects.create(message_nb='Laget i Samf4', start_dt=today, end_dt=today)

    call_command('import_samf3', '--delete-imported')

    assert list(ClosedPeriod.objects.values_list('message_nb', flat=True)) == ['Laget i Samf4']


def test_dry_run_saves_nothing() -> None:
    make_samf3_period()

    call_command('import_samf3', '--dry-run')

    assert not ClosedPeriod.objects.exists()
