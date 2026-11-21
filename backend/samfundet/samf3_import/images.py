"""
Imports Samf3 images on demand, for the importers whose content uses them.

This is not an importer of its own: Samf3 keeps every image ever uploaded, and most are no
longer used. An importer calls `import_samf3_image` for the images its rows use, and only
those are imported. Each image is imported once; later calls reuse the Samf4 `Image`.

Image files are saved to storage straight away, but the `Image` rows can still be rolled
back: by `--dry-run`, by an error that aborts the run, or by the savepoint of a row that is
skipped after its image was imported. Storage doesn't roll back with the database, so the
run is wrapped in `clean_up_image_files`, which deletes the files no `Image` row refers to.
"""

from __future__ import annotations

from pathlib import Path
from contextlib import contextmanager
from contextvars import ContextVar
from collections.abc import Generator

from PIL import UnidentifiedImageError

from django.db import transaction
from django.conf import settings
from django.db.models import F, Q, ProtectedError
from django.core.exceptions import ValidationError, ImproperlyConfigured
from django.core.files.images import ImageFile

from samfundet.models.general import Image
from samfundet.samf3_import.base import SkipRow
from samfundet.samf3_import.models import Samf3Image

TITLE_MAX_LENGTH = Image._meta.get_field('title').max_length

# The files saved by import_samf3_image during the current run. None outside a run.
_saved_files: ContextVar[set[str] | None] = ContextVar('samf3_saved_image_files', default=None)


class MissingImage(SkipRow):
    """
    A Samf3 image couldn't be imported. The message is the reason.

    A `SkipRow`, so by default the row that uses the image is skipped. Catch it to import the
    row without its image instead.
    """


def id_partition(samf3_id: int) -> str:
    """Paperclip's `:id_partition`: 12345 becomes `000/012/345`."""
    padded = f'{samf3_id:09d}'
    return f'{padded[0:3]}/{padded[3:6]}/{padded[6:9]}'


def samf3_image_path(row: Samf3Image) -> Path:
    """
    Where the original file of a Samf3 image is on disk. Samf3's Paperclip path (app/models/image.rb)
    is `:rails_root/public/upload/:class/:attachment/:id_partition/:style/:filename`.
    """
    upload_root = Path(settings.SAMF3_UPLOAD_ROOT)
    if not upload_root.is_dir():
        # Every image would be skipped, so stop the run instead.
        raise ImproperlyConfigured(f'SAMF3_UPLOAD_ROOT is not a folder: {upload_root}')
    file_name = row.image_file_file_name or ''
    # The name comes from Samf3's database, so don't let it point outside the image's folder.
    if not file_name or Path(file_name).name != file_name:
        raise MissingImage(f'Samf3 image {row.pk} has an invalid file name: {file_name!r}')
    return upload_root / 'images' / 'image_files' / id_partition(row.pk) / 'original' / file_name


@contextmanager
def clean_up_image_files() -> Generator[None]:
    """
    Wrap an import run in this, outside its transaction. When the run ends, however it ends,
    the image files it saved that no `Image` row refers to are deleted.
    """
    saved: set[str] = set()
    token = _saved_files.set(saved)
    try:
        yield
    finally:
        _saved_files.reset(token)
        _delete_unreferenced_files(saved)


def _delete_unreferenced_files(names: set[str]) -> None:
    if not names:
        return
    refers_to_saved = Q()
    for field_name in Image.FILE_FIELDS:
        refers_to_saved |= Q(**{f'{field_name}__in': names})
    referenced = {name for row in Image.objects.filter(refers_to_saved).values_list(*Image.FILE_FIELDS) for name in row}
    _delete_files(names - referenced)


def _delete_files(names: set[str]) -> None:
    storage = Image._meta.get_field('image').storage
    for name in names:
        if name and storage.exists(name):
            storage.delete(name)


def _stored_names(image: Image) -> set[str]:
    return {getattr(image, field_name).name for field_name in Image.FILE_FIELDS if getattr(image, field_name)}


def _samf3_image_file(samf3_id: int) -> tuple[Samf3Image, Path]:
    """The Samf3 image row and the path of its original file. Raises `MissingImage` if either is missing."""
    row = Samf3Image.objects.filter(pk=samf3_id).first()
    if row is None:
        raise MissingImage(f'Samf3 image {samf3_id} does not exist')
    path = samf3_image_path(row)
    if not path.is_file():
        raise MissingImage(f'File for Samf3 image {samf3_id} not found: {path}')
    return row, path


def import_samf3_image(samf3_id: int) -> Image:
    """
    The Samf4 `Image` for a Samf3 image, imported from Samf3 if it isn't already.

    An image imported before is reused as it is, even if it was edited in Samf4 since.
    Raises `MissingImage` if the Samf3 row or file is missing, or the file isn't an image
    Samf4 accepts. Must run inside `clean_up_image_files`.
    """
    saved_files = _saved_files.get()
    if saved_files is None:
        raise RuntimeError('import_samf3_image must run inside clean_up_image_files()')

    existing = Image.objects.filter(samf3_id=samf3_id).first()
    if existing is not None:
        return existing

    row, path = _samf3_image_file(samf3_id)
    # Samf3 requires a title, but don't trust that for old rows.
    title = (row.title or path.stem)[:TITLE_MAX_LENGTH]
    image = Image(samf3_id=samf3_id, title=title)
    try:
        # Savepoint, so a failed save doesn't abort the caller's transaction.
        with transaction.atomic(), path.open('rb') as file:
            image.image = ImageFile(file, name=path.name)
            # save() strips metadata, renames the file and creates the image sizes.
            image.save()
    except (ValidationError, UnidentifiedImageError, OSError) as error:
        # save() can fail after writing some of the files.
        _delete_files(_stored_names(image) - {path.name})
        raise MissingImage(f'Samf3 image {samf3_id} could not be imported: {error}') from error
    saved_files.update(_stored_names(image))

    # Like Samf3Importer: copy updated_at, so the image doesn't count as edited in Samf4.
    Image.objects.filter(pk=image.pk).update(imported_at=F('updated_at'))
    image.refresh_from_db(fields=['imported_at'])
    return image


def delete_imported_images() -> tuple[int, int]:
    """
    Delete the images imported from Samf3 that nothing uses any more. Development only,
    for `import_samf3 --delete-imported` and `--fresh`.

    Images still used, e.g. by an event made in Samf4, are kept. Returns (deleted, kept).
    """
    deleted = kept = 0
    for image in Image.objects.filter(samf3_id__isnull=False):
        try:
            with transaction.atomic():
                image.delete()
            deleted += 1
        except ProtectedError:
            kept += 1
    return deleted, kept
