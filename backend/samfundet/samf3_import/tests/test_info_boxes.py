from __future__ import annotations

import shutil
import datetime
from typing import Any
from pathlib import Path
from collections.abc import Iterator

import pytest

from django.utils import timezone
from django.core.management import call_command

from root.settings import BASE_DIR

from samfundet.models.general import Image, Infobox
from samfundet.samf3_import.dev import create_schema
from samfundet.samf3_import.images import id_partition, clean_up_image_files
from samfundet.samf3_import.models import Samf3Image, Samf3InfoBox
from samfundet.samf3_import.importers.info_boxes import COLORS, InfoBoxImporter, samf3_link

pytestmark = pytest.mark.django_db(databases=['default', 'billig', 'samf3'])

TEST_IMAGE = BASE_DIR / 'samfundet' / 'tests' / 'test_image.jpg'


@pytest.fixture(autouse=True)
def fixture_samf3_schema() -> Iterator[None]:
    create_schema()
    yield


@pytest.fixture(autouse=True)
def fixture_tmp_media_root(settings: Any, tmp_path: Path) -> None:
    settings.MEDIA_ROOT = tmp_path / 'media'


@pytest.fixture(autouse=True)
def fixture_upload_root(settings: Any, tmp_path: Path) -> Path:
    root = tmp_path / 'samf3_upload'
    root.mkdir()
    settings.SAMF3_UPLOAD_ROOT = root
    return root


def run_importer() -> Any:
    with clean_up_image_files():
        return InfoBoxImporter().run()


def make_samf3_image(upload_root: Path, samf3_id: int = 7) -> None:
    folder = upload_root / 'images' / 'image_files' / id_partition(samf3_id) / 'original'
    folder.mkdir(parents=True)
    shutil.copy(TEST_IMAGE, folder / 'plakat.jpg')
    Samf3Image.objects.create(id=samf3_id, title='Plakat', image_file_file_name='plakat.jpg')


def make_samf3_box(**kwargs: Any) -> Samf3InfoBox:
    now = timezone.now()
    values: dict[str, Any] = {
        'id': 1,
        'title_no': 'Konsert',
        'title_en': 'Concert',
        'body_no': 'Kjøp billett',
        'body_en': 'Buy a ticket',
        'link_no': 'https://example.com/no',
        'link_en': 'https://example.com/en',
        'image_id': None,
        'image_state': False,
        'color': 'red',
        'start_time': now - datetime.timedelta(days=1),
        'end_time': now + datetime.timedelta(days=1),
        'position': 1,
    }
    values.update(kwargs)
    return Samf3InfoBox.objects.create(**values)


def test_creates_info_box() -> None:
    make_samf3_box()

    report = run_importer()

    assert report.created == 1
    box = Infobox.objects.get(samf3_id=1)
    assert box.title_nb == 'Konsert'
    assert box.title_en == 'Concert'
    assert box.text_nb == 'Kjøp billett'
    assert box.text_en == 'Buy a ticket'
    assert box.url == 'https://example.com/no'
    assert box.color == COLORS['red']
    assert box.image is None
    assert box.imported_at == box.updated_at


def test_only_imports_boxes_still_showing() -> None:
    now = timezone.now()
    make_samf3_box(id=1, end_time=now - datetime.timedelta(minutes=1))
    make_samf3_box(id=2)
    # Not started yet, but will show, so it is imported.
    make_samf3_box(id=3, start_time=now + datetime.timedelta(days=1), end_time=now + datetime.timedelta(days=2))

    run_importer()

    assert set(Infobox.objects.values_list('samf3_id', flat=True)) == {2, 3}


def test_imports_in_samf3_order() -> None:
    make_samf3_box(id=1, position=2)
    make_samf3_box(id=2, position=1)

    run_importer()

    assert list(Infobox.objects.order_by('pk').values_list('samf3_id', flat=True)) == [2, 1]


def test_uses_link_en_when_link_no_is_empty() -> None:
    make_samf3_box(link_no='', link_en='https://example.com/en')

    run_importer()

    assert Infobox.objects.get(samf3_id=1).url == 'https://example.com/en'


def test_no_link() -> None:
    make_samf3_box(link_no=None, link_en=None)

    run_importer()

    assert Infobox.objects.get(samf3_id=1).url is None


@pytest.mark.parametrize(
    ('link', 'expected'),
    [
        ('https://example.com', 'https://example.com'),
        ('http://example.com', 'http://example.com'),
        ('/arrangement/123', 'https://www.samfundet.no/arrangement/123'),
        ('samfundet.no/opptak', 'https://samfundet.no/opptak'),
        ('  ', None),
        (None, None),
    ],
)
def test_samf3_link(link: str | None, expected: str | None) -> None:
    assert samf3_link(link) == expected


@pytest.mark.parametrize('color', ['red', 'blue', 'green', 'white', 'black'])
def test_maps_every_samf3_color(color: str) -> None:
    make_samf3_box(color=color)

    run_importer()

    assert Infobox.objects.get(samf3_id=1).color == COLORS[color]


def test_skips_unknown_color() -> None:
    make_samf3_box(color='purple')

    report = run_importer()

    assert report.skipped[0].reason == "Unknown color 'purple'"


@pytest.mark.parametrize(('field_name', 'length'), [('title_no', 61), ('title_en', 61), ('body_no', 256), ('body_en', 256)])
def test_skips_too_long_text(field_name: str, length: int) -> None:
    make_samf3_box(**{field_name: 'x' * length})

    report = run_importer()

    assert not Infobox.objects.exists()
    assert report.skipped[0].reason.startswith(f'{field_name} is {length} characters')


def test_imports_image_when_image_state_is_true(fixture_upload_root: Path) -> None:
    make_samf3_image(fixture_upload_root)
    make_samf3_box(image_id=7, image_state=True)

    run_importer()

    assert Infobox.objects.get(samf3_id=1).image == Image.objects.get(samf3_id=7)


def test_ignores_image_when_image_state_is_false(fixture_upload_root: Path) -> None:
    make_samf3_image(fixture_upload_root)
    make_samf3_box(image_id=7, image_state=False)

    run_importer()

    assert Infobox.objects.get(samf3_id=1).image is None
    assert not Image.objects.exists()


def test_skips_box_when_image_is_missing() -> None:
    make_samf3_box(image_id=404, image_state=True)

    report = run_importer()

    assert not Infobox.objects.exists()
    assert report.skipped[0].reason == 'Samf3 image 404 does not exist'


def test_rerun_updates_and_reuses_image(fixture_upload_root: Path) -> None:
    make_samf3_image(fixture_upload_root)
    make_samf3_box(image_id=7, image_state=True)
    run_importer()
    Samf3InfoBox.objects.filter(pk=1).update(title_no='Ny tittel')

    report = run_importer()

    assert report.updated == 1
    assert Infobox.objects.get(samf3_id=1).title_nb == 'Ny tittel'
    assert Image.objects.count() == 1


def test_command_dry_run_saves_nothing(fixture_upload_root: Path, settings: Any) -> None:
    make_samf3_image(fixture_upload_root)
    make_samf3_box(image_id=7, image_state=True)

    call_command('import_samf3', '--only', 'info_boxes', '--dry-run')

    assert not Infobox.objects.exists()
    assert not Image.objects.exists()
    assert not [path for path in Path(settings.MEDIA_ROOT).rglob('*') if path.is_file()]


def test_command_delete_imported_deletes_boxes_and_their_images(fixture_upload_root: Path) -> None:
    make_samf3_image(fixture_upload_root)
    make_samf3_box(image_id=7, image_state=True)
    call_command('import_samf3', '--only', 'info_boxes')

    call_command('import_samf3', '--only', 'info_boxes', '--delete-imported')

    assert not Infobox.objects.exists()
    assert not Image.objects.exists()
