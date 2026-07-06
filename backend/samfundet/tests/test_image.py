from __future__ import annotations

import re
from io import BytesIO
from typing import TYPE_CHECKING, Any

import pytest
from PIL import Image as PilImage

from rest_framework import status

from django.conf import settings
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.core.files.images import ImageFile
from django.core.files.uploadedfile import SimpleUploadedFile

from root.utils import routes

from samfundet.serializers import ImageSerializer
from samfundet.models.general import Tag, User, Image, Merch

if TYPE_CHECKING:
    from rest_framework.test import APIClient


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


class TestImageSerializerUpdate:
    def test_update_title_and_tags(self):
        image = make_image()
        image.tags.set([Tag.objects.create(name='old')])

        serializer = ImageSerializer(image, data={'title': 'renamed', 'tag_string': 'concert, stage'}, partial=True)
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        image.refresh_from_db()
        assert image.title == 'renamed'
        assert sorted(tag.name for tag in image.tags.all()) == ['concert', 'stage']

    def test_update_with_empty_tag_string_clears_tags(self):
        image = make_image()
        image.tags.set([Tag.objects.create(name='old')])

        serializer = ImageSerializer(image, data={'tag_string': ''}, partial=True)
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        assert image.tags.count() == 0

    def test_update_without_tag_string_keeps_tags(self):
        image = make_image()
        image.tags.set([Tag.objects.create(name='old')])

        serializer = ImageSerializer(image, data={'title': 'renamed'}, partial=True)
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        assert [tag.name for tag in image.tags.all()] == ['old']

    def test_update_without_file_keeps_files(self):
        image = make_image()
        names = [getattr(image, field).name for field in Image.FILE_FIELDS]

        serializer = ImageSerializer(image, data={'title': 'renamed'}, partial=True)
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        image.refresh_from_db()
        assert [getattr(image, field).name for field in Image.FILE_FIELDS] == names

    def test_replace_file_regenerates_and_deletes_old_files(self, django_capture_on_commit_callbacks):
        image = make_image()
        old_names = [getattr(image, field).name for field in Image.FILE_FIELDS]
        file = SimpleUploadedFile('replacement.jpg', make_image_bytes().read())

        with django_capture_on_commit_callbacks(execute=True):
            serializer = ImageSerializer(image, data={'file': file}, partial=True)
            assert serializer.is_valid(), serializer.errors
            serializer.save()

        new_names = [getattr(image, field).name for field in Image.FILE_FIELDS]
        assert set(new_names).isdisjoint(old_names)
        assert all(file_exists(name) for name in new_names)
        assert not any(file_exists(name) for name in old_names)

    def test_update_rejects_unsupported_format(self):
        image = make_image()
        file = SimpleUploadedFile('x.bmp', make_image_bytes('BMP').read())

        serializer = ImageSerializer(image, data={'file': file}, partial=True)

        assert not serializer.is_valid()
        assert 'Unsupported image format' in str(serializer.errors['file'])

    def test_update_rejects_blank_title(self):
        image = make_image()

        serializer = ImageSerializer(image, data={'title': ''}, partial=True)

        assert not serializer.is_valid()
        assert 'title' in serializer.errors

    def test_tag_string_reuses_existing_tag_with_different_casing(self):
        existing = Tag.objects.create(name='Redda')
        image = make_image()

        serializer = ImageSerializer(image, data={'tag_string': 'REDDA, redda, new tag'}, partial=True)
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        assert set(image.tags.all().values_list('id', flat=True)) == {existing.id, Tag.objects.get(name='new tag').id}
        assert Tag.objects.count() == 2


class TestImageApi:
    @pytest.fixture(autouse=True)
    def authenticate(self, fixture_rest_client: APIClient, fixture_superuser: User) -> None:
        fixture_rest_client.force_authenticate(user=fixture_superuser)

    def test_search_matches_tag_name(self, fixture_rest_client: APIClient):
        tagged = make_image()
        tagged.tags.set([Tag.objects.create(name='concert')])
        make_image()  # untagged, should not match

        response = fixture_rest_client.get(reverse(routes.samfundet__images_list), {'search': 'concert'})

        assert status.is_success(response.status_code)
        assert [result['id'] for result in response.json()['results']] == [tagged.id]

    def test_search_with_multiple_matching_tags_returns_no_duplicates(self, fixture_rest_client: APIClient):
        image = make_image()
        image.tags.set([Tag.objects.create(name='rock concert'), Tag.objects.create(name='concerto')])

        response = fixture_rest_client.get(reverse(routes.samfundet__images_list), {'search': 'concert'})

        assert [result['id'] for result in response.json()['results']] == [image.id]

    def test_tag_query_param_filters_by_exact_tag(self, fixture_rest_client: APIClient):
        tag = Tag.objects.create(name='concert')
        tagged = make_image()
        tagged.tags.add(tag)
        by_title = make_image()
        by_title.title = 'concert night'  # matches search, but must not match the tag filter
        by_title.save()

        response = fixture_rest_client.get(reverse(routes.samfundet__images_list), {'tag': 'Concert'})  # case-insensitive

        assert status.is_success(response.status_code)
        assert [result['id'] for result in response.json()['results']] == [tagged.id]

    def test_popular_tags_are_ordered_by_usage_and_exclude_unused(self, fixture_rest_client: APIClient):
        popular = Tag.objects.create(name='popular')
        rare = Tag.objects.create(name='rare')
        Tag.objects.create(name='unused')
        for _ in range(2):
            make_image().tags.add(popular)
        make_image().tags.add(rare)

        response = fixture_rest_client.get(reverse(routes.samfundet__tags_list), {'popular': 'true'})

        assert status.is_success(response.status_code)
        data = response.json()
        assert [tag['name'] for tag in data] == ['popular', 'rare']
        assert [tag['image_count'] for tag in data] == [2, 1]

    def test_delete_unreferenced_image(self, fixture_rest_client: APIClient, django_capture_on_commit_callbacks):
        image = make_image()

        with django_capture_on_commit_callbacks(execute=True):
            response = fixture_rest_client.delete(reverse(routes.samfundet__images_detail, kwargs={'pk': image.id}))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Image.objects.filter(pk=image.id).exists()

    def test_delete_protected_image_returns_409(self, fixture_rest_client: APIClient):
        image = make_image()
        Merch.objects.create(name_nb='basic merch', name_en='merch', description_nb='merch', description_en='merch', base_price=100, image=image)

        response = fixture_rest_client.delete(reverse(routes.samfundet__images_detail, kwargs={'pk': image.id}))

        assert response.status_code == status.HTTP_409_CONFLICT
        assert 'in use' in response.json()['detail']
        assert Image.objects.filter(pk=image.id).exists()

    def test_detail_exposes_audit_fields_with_user_object(self, fixture_rest_client: APIClient, fixture_superuser: User):
        fixture_superuser.first_name = 'Super'
        fixture_superuser.last_name = 'User'
        fixture_superuser.save()
        file = SimpleUploadedFile('x.jpg', make_image_bytes().read())

        response = fixture_rest_client.post(reverse(routes.samfundet__images_list), {'title': 'test', 'file': file}, format='multipart')

        assert status.is_success(response.status_code)
        data = response.json()
        assert data['created_by'] == {'username': fixture_superuser.username, 'first_name': 'Super', 'last_name': 'User'}
        assert data['created_at']
        assert data['updated_at']
