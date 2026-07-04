from __future__ import annotations

import re
from io import BytesIO
from typing import Any

import pytest
from PIL import Image as PilImage

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files.images import ImageFile
from django.core.files.uploadedfile import SimpleUploadedFile

from samfundet.serializers import ImageSerializer
from samfundet.models.general import Image


@pytest.fixture(autouse=True)
def fixture_tmp_media_root(settings: Any, tmp_path: Any) -> None:
    """Keep test uploads out of the real uploads directory."""
    settings.MEDIA_ROOT = tmp_path


def make_image_bytes(image_format: str = 'JPEG', size: tuple[int, int] = (1200, 900), *, noise: bool = True, **save_kwargs: Any) -> BytesIO:
    """In-memory image file. Noise compresses poorly, producing files above the variant threshold."""
    pil = PilImage.effect_noise(size, 60).convert('RGB') if noise else PilImage.new('RGB', size, 'red')
    buffer = BytesIO()
    pil.save(buffer, image_format, **save_kwargs)
    buffer.seek(0)
    return buffer


def make_image(image_format: str = 'JPEG', size: tuple[int, int] = (1200, 900), *, name: str = 'upload.bin', **save_kwargs: Any) -> Image:
    return Image.objects.create(title='test', image=ImageFile(make_image_bytes(image_format, size, **save_kwargs), name=name))


def file_exists(name: str) -> bool:
    return (settings.MEDIA_ROOT / name).exists()


class TestImageUpload:
    def test_upload_generates_all_variants(self):
        image = make_image()

        for variant_name in Image.VARIANTS:
            variant = getattr(image, f'image_{variant_name}')
            assert variant, f'missing variant {variant_name}'
            assert file_exists(variant.name)
            with variant.open() as file:
                assert PilImage.open(file).format == 'WEBP'

    def test_stored_name_is_random_and_partitioned(self):
        image = make_image(name='my original poster name.jpg')

        # e.g. images/9f/86/9f86d081884c7d65.jpg (partition dirs = first 4 chars of name)
        assert re.fullmatch(r'images/([0-9a-f]{2})/([0-9a-f]{2})/\1\2[0-9a-f]{12}\.jpg', image.image.name)

    def test_variants_live_next_to_original_with_suffix(self):
        image = make_image()

        directory, stem = image.image.name.rsplit('/', 1)
        stem = stem.removesuffix('.jpg')
        for variant_name in Image.VARIANTS:
            assert getattr(image, f'image_{variant_name}').name == f'{directory}/{stem}_{variant_name}.webp'

    def test_extension_is_sniffed_from_content(self):
        # A PNG with a lying .jpg filename must be stored as .png
        image = make_image('PNG', name='lying-name.jpg')

        assert image.image.name.endswith('.png')

    def test_unsupported_format_is_rejected(self):
        with pytest.raises(ValidationError, match='BMP'):
            make_image('BMP')

    def test_variants_are_downscaled_and_cropped(self):
        # 5.0 aspect ratio exceeds every variant's max_aspect
        image = make_image(size=(3000, 600))

        for variant_name, spec in Image.VARIANTS.items():
            with getattr(image, f'image_{variant_name}').open() as file:
                width, height = PilImage.open(file).size
            assert max(width, height) <= spec.max_size
            assert width / height <= spec.max_aspect * 1.01  # rounding tolerance


class TestVariantSkipping:
    def test_small_original_gets_no_variants(self):
        # Flat-color images compress far below the threshold
        image = make_image(noise=False)

        assert image.image.size <= Image.VARIANT_SIZE_THRESHOLD
        assert not any(getattr(image, f'image_{name}') for name in Image.VARIANTS)

    def test_animated_gif_gets_no_variants(self):
        frames = [PilImage.effect_noise((500, 500), 60).convert('RGB') for _ in range(2)]
        buffer = BytesIO()
        frames[0].save(buffer, 'GIF', save_all=True, append_images=frames[1:])
        buffer.seek(0)
        image = Image.objects.create(title='test', image=ImageFile(buffer, name='a.gif'))

        assert image.image.size > Image.VARIANT_SIZE_THRESHOLD  # skipped due to animation, not size
        assert not any(getattr(image, f'image_{name}') for name in Image.VARIANTS)

    def test_urls_fall_back_to_original_when_variants_are_missing(self):
        image = make_image(noise=False)

        assert set(image.urls) == {'original', *Image.VARIANTS}
        assert all(url == image.image.url for url in image.urls.values())

    def test_urls_point_to_variants_when_they_exist(self):
        image = make_image()

        assert image.urls['original'] == image.image.url
        for variant_name in Image.VARIANTS:
            assert image.urls[variant_name] == getattr(image, f'image_{variant_name}').url


class TestMetadataStripping:
    def test_exif_is_stripped_from_original(self):
        exif = PilImage.Exif()
        exif[Image.ORIENTATION_EXIF_TAG] = 1
        exif[0x010F] = 'Apple'  # Make
        image = make_image(exif=exif)

        with image.image.open() as file:
            assert dict(PilImage.open(BytesIO(file.read())).getexif()) == {}

    def test_orientation_is_baked_into_pixels(self):
        exif = PilImage.Exif()
        exif[Image.ORIENTATION_EXIF_TAG] = 6  # rotate 90
        image = make_image(size=(1200, 900), exif=exif)

        with image.image.open() as file:
            stored = PilImage.open(BytesIO(file.read()))
        assert stored.size == (900, 1200)
        assert dict(stored.getexif()) == {}

    def test_upload_without_metadata_is_stored_byte_identical(self):
        buffer = make_image_bytes()
        raw = buffer.getvalue()
        image = Image.objects.create(title='test', image=ImageFile(buffer, name='t.jpg'))

        with image.image.open() as file:
            assert file.read() == raw


class TestFileLifecycle:
    def test_replacing_image_regenerates_and_deletes_old_files(self, django_capture_on_commit_callbacks):
        image = make_image()
        old_names = [getattr(image, field).name for field in Image.FILE_FIELDS]

        with django_capture_on_commit_callbacks(execute=True):
            image.image = ImageFile(make_image_bytes(), name='replacement.jpg')
            image.save()

        new_names = [getattr(image, field).name for field in Image.FILE_FIELDS]
        assert set(new_names).isdisjoint(old_names)
        assert all(file_exists(name) for name in new_names)
        assert not any(file_exists(name) for name in old_names)

    def test_deleting_image_deletes_files(self, django_capture_on_commit_callbacks):
        image = make_image()
        names = [getattr(image, field).name for field in Image.FILE_FIELDS]

        with django_capture_on_commit_callbacks(execute=True):
            image.delete()

        assert not any(file_exists(name) for name in names)

    def test_resaving_unchanged_image_keeps_files(self):
        image = make_image()
        names = [getattr(image, field).name for field in Image.FILE_FIELDS]

        image.title = 'renamed'
        image.save()

        image.refresh_from_db()
        assert [getattr(image, field).name for field in Image.FILE_FIELDS] == names
        assert all(file_exists(name) for name in names)


class TestImageSerializer:
    def test_rejects_unsupported_format(self):
        file = SimpleUploadedFile('x.bmp', make_image_bytes('BMP').read())

        serializer = ImageSerializer(data={'title': 'test', 'file': file})

        assert not serializer.is_valid()
        assert 'Unsupported image format' in str(serializer.errors['file'])

    def test_accepts_allowed_format_and_exposes_urls(self):
        file = SimpleUploadedFile('x.jpg', make_image_bytes().read())

        serializer = ImageSerializer(data={'title': 'test', 'file': file})
        assert serializer.is_valid(), serializer.errors
        image = serializer.save()

        assert set(serializer.data['urls']) == {'original', *Image.VARIANTS}
        assert image.image_small
