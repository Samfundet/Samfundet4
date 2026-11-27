from __future__ import annotations

import shutil
from typing import Any
from pathlib import Path
from collections.abc import Iterator

import pytest

from django.db import transaction
from django.core.exceptions import ImproperlyConfigured
from django.core.files.images import ImageFile

from root.settings import BASE_DIR

from samfundet.models.event import Event
from samfundet.samf3_import import images
from samfundet.models.general import Image
from samfundet.samf3_import.dev import create_schema
from samfundet.samf3_import.images import (
    MissingImage,
    id_partition,
    import_samf3_image,
    clean_up_image_files,
    delete_imported_images,
)
from samfundet.samf3_import.models import Samf3Image

pytestmark = pytest.mark.django_db(databases=['default', 'billig', 'samf3'])

TEST_IMAGE = BASE_DIR / 'samfundet' / 'tests' / 'test_image.jpg'


@pytest.fixture(autouse=True)
def fixture_samf3_schema() -> Iterator[None]:
    create_schema()
    yield


@pytest.fixture(autouse=True)
def fixture_tmp_media_root(settings: Any, tmp_path: Path) -> None:
    """Keep the files the tests save out of the real uploads folder."""
    settings.MEDIA_ROOT = tmp_path / 'media'


@pytest.fixture
def upload_root(settings: Any, tmp_path: Path) -> Path:
    root = tmp_path / 'samf3_upload'
    root.mkdir()
    settings.SAMF3_UPLOAD_ROOT = root
    return root


@pytest.fixture(autouse=True)
def fixture_import_run() -> Iterator[None]:
    """Like the import_samf3 command, which runs the importers inside clean_up_image_files."""
    with clean_up_image_files():
        yield


def stored_files(settings: Any) -> set[Path]:
    """Every file in the media folder."""
    return {path for path in Path(settings.MEDIA_ROOT).rglob('*') if path.is_file()}


def media_paths(settings: Any, image: Image) -> set[Path]:
    """The files of one image: the original and its sizes."""
    return {Path(settings.MEDIA_ROOT) / getattr(image, field).name for field in Image.FILE_FIELDS if getattr(image, field)}


def make_samf3_image(upload_root: Path, *, samf3_id: int = 12345, file_name: str = 'plakat.jpg', with_file: bool = True, **kwargs: Any) -> Samf3Image:
    if with_file:
        folder = upload_root / 'images' / 'image_files' / id_partition(samf3_id) / 'original'
        folder.mkdir(parents=True)
        shutil.copy(TEST_IMAGE, folder / file_name)
    values: dict[str, Any] = {'id': samf3_id, 'title': 'Plakat', 'image_file_file_name': file_name}
    values.update(kwargs)
    return Samf3Image.objects.create(**values)


def test_id_partition() -> None:
    assert id_partition(12345) == '000/012/345'
    assert id_partition(1) == '000/000/001'
    assert id_partition(123456789) == '123/456/789'


def test_imports_image(upload_root: Path) -> None:
    make_samf3_image(upload_root)

    image = import_samf3_image(12345)

    assert image.samf3_id == 12345
    assert image.title == 'Plakat'
    assert image.imported_at == image.updated_at
    # Image.save() ran: the file is renamed, and the test image is large enough for sizes.
    assert image.image.name != 'plakat.jpg'
    assert image.image_small


def test_imports_each_image_once(upload_root: Path) -> None:
    make_samf3_image(upload_root)

    first = import_samf3_image(12345)
    second = import_samf3_image(12345)

    assert first.pk == second.pk
    assert Image.objects.filter(samf3_id=12345).count() == 1


def test_uses_file_name_without_title(upload_root: Path) -> None:
    make_samf3_image(upload_root, title=None)

    assert import_samf3_image(12345).title == 'plakat'


def test_missing_row(upload_root: Path) -> None:
    with pytest.raises(MissingImage, match='does not exist'):
        import_samf3_image(404)


def test_missing_file(upload_root: Path) -> None:
    make_samf3_image(upload_root, with_file=False)

    with pytest.raises(MissingImage, match='not found'):
        import_samf3_image(12345)
    assert not Image.objects.filter(samf3_id=12345).exists()


@pytest.mark.parametrize('file_name', ['../../etc/passwd', '', None])
def test_invalid_file_name(upload_root: Path, file_name: str | None) -> None:
    make_samf3_image(upload_root, with_file=False, file_name=file_name)

    with pytest.raises(MissingImage, match='invalid file name'):
        import_samf3_image(12345)


def test_file_that_is_not_an_image(upload_root: Path) -> None:
    make_samf3_image(upload_root)
    path = upload_root / 'images' / 'image_files' / id_partition(12345) / 'original' / 'plakat.jpg'
    path.write_text('not an image')

    with pytest.raises(MissingImage, match='could not be imported'):
        import_samf3_image(12345)
    assert not Image.objects.filter(samf3_id=12345).exists()


def test_delete_imported_images_keeps_used_and_samf4_images(upload_root: Path, fixture_event: Event) -> None:
    make_samf3_image(upload_root, samf3_id=1)
    make_samf3_image(upload_root, samf3_id=2)
    unused = import_samf3_image(1)
    used = import_samf3_image(2)
    fixture_event.image = used
    fixture_event.save()
    with open(TEST_IMAGE, 'rb') as file:
        made_in_samf4 = Image.objects.create(title='Samf4', image=ImageFile(file, name='samf4.jpg'))

    assert delete_imported_images() == (1, 1)

    assert not Image.objects.filter(pk=unused.pk).exists()
    assert Image.objects.filter(pk=used.pk).exists()
    assert Image.objects.filter(pk=made_in_samf4.pk).exists()


def test_requires_clean_up_image_files(upload_root: Path) -> None:
    make_samf3_image(upload_root)
    # Leave the autouse run for the duration of the test.
    token = images._saved_files.set(None)
    try:
        with pytest.raises(RuntimeError, match='clean_up_image_files'):
            import_samf3_image(12345)
    finally:
        images._saved_files.reset(token)


def test_upload_root_must_exist(settings: Any, tmp_path: Path) -> None:
    settings.SAMF3_UPLOAD_ROOT = tmp_path / 'missing'
    Samf3Image.objects.create(id=1, title='Plakat', image_file_file_name='plakat.jpg')

    with pytest.raises(ImproperlyConfigured, match='not a folder'):
        import_samf3_image(1)


def test_rolled_back_import_deletes_files(upload_root: Path, settings: Any) -> None:
    """--dry-run, or an error that aborts the run: the Image rows are rolled back, so the files go too."""
    make_samf3_image(upload_root)

    with clean_up_image_files(), transaction.atomic():
        import_samf3_image(12345)
        assert stored_files(settings)
        transaction.set_rollback(True)

    assert not Image.objects.filter(samf3_id=12345).exists()
    assert not stored_files(settings)


def test_skipped_row_deletes_its_image_files(upload_root: Path, settings: Any) -> None:
    """A row's savepoint rolls back the image it imported, so its files go, but other rows' stay."""
    make_samf3_image(upload_root, samf3_id=1)
    make_samf3_image(upload_root, samf3_id=2)

    with clean_up_image_files():
        kept = import_samf3_image(1)
        with transaction.atomic():
            import_samf3_image(2)
            transaction.set_rollback(True)

    assert stored_files(settings) == media_paths(settings, kept)


def test_committed_import_keeps_files(upload_root: Path, settings: Any) -> None:
    make_samf3_image(upload_root)

    with clean_up_image_files(), transaction.atomic():
        image = import_samf3_image(12345)

    assert stored_files(settings) == media_paths(settings, image)
