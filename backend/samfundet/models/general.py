#
# This file contains most of the django models used for Samf4
#

from __future__ import annotations

import re
import secrets
from io import BytesIO
from typing import TYPE_CHECKING
from pathlib import Path
from datetime import date, time, datetime, timedelta
from contextlib import contextmanager
from collections import defaultdict
from dataclasses import dataclass

from PIL import Image as PilImage
from PIL import ImageOps, JpegImagePlugin

from django.db import models, transaction
from django.utils import timezone
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.utils.translation import gettext as _
from django.contrib.auth.models import AbstractUser
from django.db.models.functions import Lower

from root.utils.mixins import CustomBaseModel, FullCleanSaveMixin

from samfundet.models.model_choices import ReservationOccasion, UserPreferenceTheme, SaksdokumentCategory

from .utils.fields import LowerCaseField, PhoneNumberField
from .utils.string_utils import ellipsize

if TYPE_CHECKING:
    from typing import Any
    from collections.abc import Iterator

    from django.db.models import Model


class Tag(CustomBaseModel):
    name = models.CharField(max_length=140)
    color = models.CharField(max_length=6, null=True, blank=True)

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        constraints = [models.UniqueConstraint(Lower('name'), name='tag_name_case_insensitive_unique')]

    def __str__(self) -> str:
        return f'{self.name}'

    @classmethod
    def random_color(cls) -> str:
        hexnr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        c = [secrets.choice(range(len(hexnr))) for _ in range(6)]
        while sum(c) < (len(hexnr)) * 5:  # Controls if color is not too bright
            c = [secrets.choice(range(len(hexnr))) for _ in range(6)]
        return ''.join([hexnr[i] for i in c])

    @classmethod
    def find_or_create(cls, name: str) -> Tag:
        """Find a tag by name (case-insensitive) or create it."""
        name = name.strip()
        existing = cls.objects.filter(name__iexact=name).first()
        return existing or cls.objects.create(name=name)

    def save(self, *args: Any, **kwargs: Any) -> None:
        # Saves with random color
        if not self.color or not re.search(r'^(?:[0-9a-fA-F]{3}){1,2}$', self.color):
            self.color = Tag.random_color()
        super().save(*args, **kwargs)


def image_upload_path(instance: Image, filename: str) -> str:
    """Partition images two levels deep by filename.

    Example: images/9f/86/9f86d081.jpg
    """
    return f'images/{filename[:2]}/{filename[2:4]}/{filename}'


@dataclass(frozen=True, kw_only=True)
class ImageVariant:
    # longest side (px), never upscaled
    max_size: int
    # If lossy: WebP quality.
    # If lossless: compression effort.
    quality: int
    # Images more elongated than this ratio (long side / short side) are
    # center-cropped down to it before downscaling
    max_aspect: float
    lossless: bool


class Image(CustomBaseModel):
    # Accepted upload formats (PIL format names)
    ALLOWED_FORMATS = ('JPEG', 'PNG', 'GIF', 'WEBP', 'TIFF')

    # Originals at or below this size are served as-is, without generated variants
    VARIANT_SIZE_THRESHOLD = 128 * 1024

    # Smaller variants tolerate less extreme aspect ratios since they show in
    # small containers, where extreme proportions leave too few usable pixels.
    #
    # If adding a variant, make sure to also add an ImageField field with a
    # matching name (and update frontend).
    VARIANTS = {
        'large': ImageVariant(max_size=2560, quality=85, max_aspect=4.5, lossless=False),
        'medium': ImageVariant(max_size=1536, quality=85, max_aspect=4.2, lossless=False),
        'small': ImageVariant(max_size=768, quality=80, max_aspect=4.0, lossless=False),
    }

    title = models.CharField(max_length=140)
    tags = models.ManyToManyField(Tag, blank=True, related_name='images')
    image = models.ImageField(upload_to=image_upload_path, blank=False, null=False)

    # Downscaled copies generated automatically on upload.
    # Empty for animated images, in which case urls falls back to the original.
    image_large = models.ImageField(upload_to=image_upload_path, blank=True, editable=False)
    image_medium = models.ImageField(upload_to=image_upload_path, blank=True, editable=False)
    image_small = models.ImageField(upload_to=image_upload_path, blank=True, editable=False)

    # All fields holding a stored file: the original plus one field per variant
    FILE_FIELDS = ('image', *(f'image_{name}' for name in VARIANTS))

    class Meta:
        verbose_name = 'Image'
        verbose_name_plural = 'Images'

    def __str__(self) -> str:
        return f'{self.title}'

    @property
    def urls(self) -> dict[str, str]:
        """URL for each size variant, falling back to the original when a variant is missing."""
        original = self.image.url
        urls = {'original': original}
        for variant in self.VARIANTS:
            file = getattr(self, f'image_{variant}')
            urls[variant] = file.url if file else original
        return urls

    ORIENTATION_EXIF_TAG = 0x0112

    def save(self, *args: Any, **kwargs: Any) -> None:
        stored_files = self._stored_file_names()
        # New uploads carry a name not yet stored in db
        image_changed = bool(self.image) and (stored_files is None or stored_files[0] != self.image.name)
        if image_changed:
            self._assign_random_name()
            self._strip_metadata()
            self.generate_variants()
        super().save(*args, **kwargs)
        if image_changed and stored_files:
            # The save replaced the row's files, so the previous ones are orphans now
            self.schedule_file_cleanup(stored_files)

    def _stored_file_names(self) -> tuple[str, ...] | None:
        """File names (original + variants) currently in the database, or None if the row is new."""
        if not self.pk:
            return None
        return Image.objects.filter(pk=self.pk).values_list(*self.FILE_FIELDS).first()

    @classmethod
    def schedule_file_cleanup(cls, names: tuple[str, ...]) -> None:
        """Delete stored files once the current transaction commits (or immediately if none)"""
        storage = cls._meta.get_field('image').storage

        def delete_files() -> None:
            for name in names:
                if name:
                    storage.delete(name)

        transaction.on_commit(delete_files)

    @contextmanager
    def _open_image(self) -> Iterator[PilImage.Image]:
        file = self.image.file
        file.seek(0)
        with PilImage.open(file) as pil:
            yield pil
        file.seek(0)

    def _assign_random_name(self) -> None:
        """Name the file a random string. The extension is sniffed from the actual format"""
        with self._open_image() as pil:
            image_format = pil.format or ''
        if image_format not in self.ALLOWED_FORMATS:
            raise ValidationError(f'Unsupported image format: {image_format or "<unknown>"}')
        # normalize both JPG/JPEG to use .jpg
        extension = {'JPEG': '.jpg'}.get(image_format, f'.{image_format.lower()}')
        name = f'{secrets.token_hex(8)}{extension}'
        # Collisions are essentially impossible, but a silent Django rename would
        # break the shared original/variant stem, so reroll rather than risk it.
        while self.image.storage.exists(image_upload_path(self, name)):
            name = f'{secrets.token_hex(8)}{extension}'
        self.image.name = name

    def _strip_metadata(self) -> None:
        """Re-encode the original without metadata, so e.g. GPS EXIF from phone photos is never leaked.

        - Only strips JPEG/PNG
        - Orientation is baked into the pixels, the ICC color profile is kept
        """
        with self._open_image() as pil:
            exif = pil.getexif()
            has_metadata = exif or pil.info.get('exif') or pil.info.get('xmp')
            strippable = pil.format in ('JPEG', 'PNG') and not getattr(pil, 'is_animated', False)
            if not (strippable and has_metadata):
                return

            options: dict[str, Any] = {'exif': b'', 'xmp': b'', 'icc_profile': pil.info.get('icc_profile')}

            # 1 means "no rotation needed"
            needs_rotation = exif.get(self.ORIENTATION_EXIF_TAG, 1) != 1
            stripped = (ImageOps.exif_transpose(pil) or pil) if needs_rotation else pil

            if isinstance(pil, JpegImagePlugin.JpegImageFile):
                # Inherit the source's compression instead of picking a new quality
                if needs_rotation:
                    options |= {'qtables': pil.quantization, 'subsampling': JpegImagePlugin.get_sampling(pil)}
                else:
                    options |= {'quality': 'keep', 'subsampling': 'keep'}

            buffer = BytesIO()
            stripped.save(buffer, format=pil.format, **options)
        self.image.save(self.image.name, ContentFile(buffer.getvalue()), save=False)

    def generate_variants(self) -> None:
        """Generate a downscaled WebP copy of the image for each size in VARIANTS.

        Small and animated originals get no variants, and urls falls back to the original.
        """
        if self.image.size <= self.VARIANT_SIZE_THRESHOLD:
            self._clear_variants()
            return
        with self._open_image() as source:
            if getattr(source, 'is_animated', False):
                # Resizing would drop animation frames, serve the original instead.
                self._clear_variants()
                return
            pil = self._normalize_for_webp(source)
            stem = Path(self.image.name).stem
            for name, variant in self.VARIANTS.items():
                content = self._encode_variant(pil, variant)
                getattr(self, f'image_{name}').save(f'{stem}_{name}.webp', content, save=False)

    def _clear_variants(self) -> None:
        for name in self.VARIANTS:
            setattr(self, f'image_{name}', '')

    @staticmethod
    def _normalize_for_webp(source: PilImage.Image) -> PilImage.Image:
        """Bake EXIF orientation into the pixels and convert to a mode WebP can encode."""
        pil = ImageOps.exif_transpose(source) or source
        if pil.mode not in ('RGB', 'RGBA'):
            # Palette images may carry transparency, so they keep an alpha channel
            pil = pil.convert('RGBA' if pil.mode == 'P' or 'A' in pil.getbands() else 'RGB')
        return pil

    @classmethod
    def _encode_variant(cls, pil: PilImage.Image, variant: ImageVariant) -> ContentFile:
        """Crop, downscale and encode one WebP variant of the (normalized) source image."""
        resized = cls._center_crop(pil, variant.max_aspect)
        resized.thumbnail((variant.max_size, variant.max_size), PilImage.Resampling.LANCZOS)
        buffer = BytesIO()
        resized.save(buffer, format='WEBP', lossless=variant.lossless, quality=variant.quality)
        return ContentFile(buffer.getvalue())

    @staticmethod
    def _center_crop(pil: PilImage.Image, max_aspect: float) -> PilImage.Image:
        """Center-crop the image so that no side exceeds max_aspect times the other."""
        width, height = pil.size
        if width > height * max_aspect:
            crop_width = round(height * max_aspect)
            left = (width - crop_width) // 2
            return pil.crop((left, 0, left + crop_width, height))
        if height > width * max_aspect:
            crop_height = round(width * max_aspect)
            top = (height - crop_height) // 2
            return pil.crop((0, top, width, top + crop_height))
        # Copy since thumbnail() mutates and the source is reused for other variants
        return pil.copy()


class Campus(FullCleanSaveMixin):
    name_nb = models.CharField(max_length=64, unique=True, blank=False, null=False)
    name_en = models.CharField(max_length=64, unique=True, blank=False, null=False)
    abbreviation = models.CharField(max_length=10, blank=True, null=True)
    total_students = models.PositiveIntegerField(null=False, blank=False, default=1, verbose_name='Total students enrolled')

    def __str__(self) -> str:
        if not self.abbreviation:
            return f'{self.name_nb}'
        return f'{self.name_nb} ({self.abbreviation})'


class User(AbstractUser):
    # REQUIRED_FIELDS is only used by the createsuperuser tool, setting which fields need to have a value, nothing else
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'phone_number', 'date_of_birth']

    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    mdb_last_updated = models.DateTimeField(null=True, blank=True, verbose_name='Last updated from mdb')

    username = LowerCaseField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[AbstractUser.username_validator],
        error_messages={
            'unique': _('A user with that username already exists.'),
        },
    )
    phone_number = PhoneNumberField(
        _('phone_number'),
        blank=False,
        null=False,
        editable=True,
    )
    email = models.EmailField(
        _('email'),
        blank=False,
        null=False,
        unique=True,
    )

    campus = models.ForeignKey(
        Campus,
        blank=True,
        null=True,
        on_delete=models.PROTECT,
    )

    mdb_medlem_id = models.PositiveIntegerField(null=True, blank=False, unique=True, verbose_name='medlem_id in mdb2')

    date_of_birth = models.DateField(
        _('date of birth'),
        blank=True,
        null=True,
    )

    class Meta:
        permissions = [
            ('debug', 'Can view debug mode'),
            ('impersonate', 'Can impersonate users'),
        ]

    def has_perm(self, perm: str, obj: Model | None = None) -> bool:
        """
        Because Django's ModelBackend and django-guardian's ObjectPermissionBackend
        are completely separate, calling `has_perm()` with an `obj` will return `False`
        even though the user has global perms.
            We have decided that global permissions implies that any obj perm check
        should return `True`. This function is extended to check both.
        """
        has_global_perm = super().has_perm(perm=perm)
        has_object_perm = super().has_perm(perm=perm, obj=obj)
        return has_global_perm or has_object_perm

    @property
    def is_impersonated(self) -> bool:
        return self._impersonated_by is not None

    @property
    def impersonated_by(self) -> User:
        if not self.is_impersonated:
            raise Exception('Real user not available unless currently impersonated.')
        return self._impersonated_by


class UserPreference(FullCleanSaveMixin):
    """Group all preferences and config per user."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    theme = models.CharField(max_length=30, choices=UserPreferenceTheme.choices, default=UserPreferenceTheme.LIGHT, blank=True, null=True)

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        verbose_name = 'UserPreference'
        verbose_name_plural = 'UserPreferences'

    def __str__(self) -> str:
        return f'UserPreference ({self.user})'


class Venue(CustomBaseModel):
    slug = models.SlugField(
        max_length=64,
        blank=True,
        null=False,
        unique=True,
        primary_key=True,
        help_text='Primary key, this field will identify the object and be used in the URL.',
    )
    name = models.CharField(max_length=140, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    floor = models.IntegerField(blank=True, null=True)
    last_renovated = models.DateTimeField(blank=True, null=True)
    handicapped_approved = models.BooleanField(blank=True, null=True)
    responsible_crew = models.CharField(max_length=140, blank=True, null=True)
    opening = models.TimeField(default=time(hour=8), blank=True, null=True)
    closing = models.TimeField(default=time(hour=20), blank=True, null=True)

    opening_monday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_tuesday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_wednesday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_thursday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_friday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_saturday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_sunday = models.TimeField(default=time(hour=8), blank=True, null=True)

    closing_monday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_tuesday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_wednesday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_thursday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_friday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_saturday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_sunday = models.TimeField(default=time(hour=20), blank=True, null=True)

    class Meta:
        verbose_name = 'Venue'
        verbose_name_plural = 'Venues'

    def get_opening_hours_date(self, selected_date: date | None = None) -> tuple[time, time]:
        selected_date = selected_date or timezone.now().date()
        fields = [
            (self.opening_monday, self.closing_monday),
            (self.opening_tuesday, self.closing_tuesday),
            (self.opening_wednesday, self.closing_wednesday),
            (self.opening_thursday, self.closing_thursday),
            (self.opening_friday, self.closing_friday),
            (self.opening_saturday, self.closing_saturday),
            (self.opening_sunday, self.closing_sunday),
        ]
        return fields[selected_date.weekday()]

    def __str__(self) -> str:
        return f'{self.name}'


class ClosedPeriod(CustomBaseModel):
    message_nb = models.TextField(blank=True, null=True, verbose_name='Melding (norsk)')
    message_en = models.TextField(blank=True, null=True, verbose_name='Melding (engelsk)')

    description_nb = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    start_dt = models.DateField(blank=True, null=False, verbose_name='Start dato')
    end_dt = models.DateField(blank=True, null=False, verbose_name='Slutt dato')

    class Meta:
        verbose_name = 'ClosedPeriod'
        verbose_name_plural = 'ClosedPeriods'

    def __str__(self) -> str:
        return f'{self.message_nb} {self.start_dt}-{self.end_dt}'


# GANGS ###
class Organization(CustomBaseModel):
    """Object for mapping out the orgs with different gangs, eg. Samfundet, UKA, ISFiT"""

    name = models.CharField(max_length=32, blank=False, null=False, unique=True)

    class Meta:
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        if return_id:
            return self.id
        return self

    def __str__(self) -> str:
        return self.name


class GangType(CustomBaseModel):
    """Type of gang. eg. 'arrangerende', 'kunstnerisk' etc."""

    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Norsk')
    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Engelsk')

    organization = models.ForeignKey(
        to=Organization,
        related_name='gangtypes',
        verbose_name='Organisasjon',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = 'GangType'
        verbose_name_plural = 'GangTypes'

    def __str__(self) -> str:
        return f'{self.title_nb}'

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.organization_id
        return self.organization


class Gang(CustomBaseModel):
    name_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn Norsk')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn Engelsk')
    abbreviation = models.CharField(max_length=8, blank=True, null=True, verbose_name='Forkortelse')
    webpage = models.URLField(verbose_name='Nettside', blank=True, null=True)

    organization = models.ForeignKey(
        to=Organization,
        related_name='gangs',
        verbose_name='Organisasjon',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    logo = models.ImageField(upload_to='ganglogos/', blank=True, null=True, verbose_name='Logo')
    gang_type = models.ForeignKey(to=GangType, related_name='gangs', verbose_name='Gruppetype', blank=True, null=True, on_delete=models.SET_NULL)
    info_page = models.ForeignKey(to='samfundet.InformationPage', verbose_name='Infoside', blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = 'Gang'
        verbose_name_plural = 'Gangs'

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.organization_id
        return self.organization

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int:
        if return_id:
            return self.id
        return self

    def __str__(self) -> str:
        return f'{self.gang_type} - {self.name_nb}'


class GangSection(CustomBaseModel):
    name_nb = models.CharField(max_length=64, blank=True, verbose_name='Navn Norsk')
    name_en = models.CharField(max_length=64, blank=True, verbose_name='Navn Engelsk')
    logo = models.ForeignKey(Image, on_delete=models.PROTECT, blank=True, null=True, verbose_name='Logo')
    gang = models.ForeignKey(Gang, blank=False, null=False, related_name='gang', on_delete=models.PROTECT, verbose_name='Gjeng')

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.gang.resolve_org(return_id=return_id)

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.gang_id
        return self.gang

    def resolve_section(self, *, return_id: bool = False) -> GangSection | int:
        if return_id:
            return self.id
        return self

    def __str__(self) -> str:
        return f'{self.gang.name_nb} - {self.name_nb}'


class InformationPage(CustomBaseModel):
    slug_field = models.SlugField(
        max_length=64,
        blank=True,
        null=False,
        unique=True,
        primary_key=True,
        help_text='Primary key, this field will identify the object and be used in the URL.',
    )

    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (norsk)')
    text_nb = models.TextField(blank=True, null=True, verbose_name='Tekst (norsk)')

    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (engelsk)')
    text_en = models.TextField(blank=True, null=True, verbose_name='Tekst (engelsk)')

    class Meta:
        verbose_name = 'InformationPage'
        verbose_name_plural = 'InformationPages'

    def __str__(self) -> str:
        return f'{self.slug_field}'


class BlogPost(CustomBaseModel):
    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (norsk)')
    text_nb = models.TextField(blank=True, null=True, verbose_name='Tekst (norsk)')

    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (engelsk)')
    text_en = models.TextField(blank=True, null=True, verbose_name='Tekst (engelsk)')

    image = models.ForeignKey(Image, on_delete=models.SET_NULL, blank=True, null=True)

    published_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)

    # TODO Find usage for owner field

    class Meta:
        verbose_name = 'Blog post'
        verbose_name_plural = 'Blogg posts'

    def __str__(self) -> str:
        return f'{self.title_nb} {self.published_at}'


class Table(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    seating = models.PositiveSmallIntegerField(blank=True, null=True)

    venue = models.ForeignKey(Venue, on_delete=models.PROTECT, blank=True, null=True)

    # TODO Implement HTML and Markdown
    # TODO Find usage for owner field

    class Meta:
        verbose_name = 'Table'
        verbose_name_plural = 'Tables'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class Reservation(FullCleanSaveMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=64, blank=True, verbose_name='Navn')
    email = models.EmailField(max_length=64, blank=True, verbose_name='Epost')
    phonenumber = models.CharField(max_length=8, blank=True, null=True, verbose_name='Telefonnummer')

    reservation_date = models.DateField(blank=True, null=False, verbose_name='Dato')
    start_time = models.TimeField(blank=True, null=False, verbose_name='Starttid')
    end_time = models.TimeField(blank=True, null=False, verbose_name='Sluttid')

    venue = models.ForeignKey(Venue, on_delete=models.PROTECT, blank=True, null=True, verbose_name='Lokale')

    occasion = models.CharField(max_length=24, choices=ReservationOccasion.choices, default=ReservationOccasion.FOOD)
    guest_count = models.PositiveSmallIntegerField(null=False, verbose_name='Antall gjester')
    additional_info = models.TextField(blank=True, null=True, verbose_name='Tilleggsinformasjon')
    internal_messages = models.TextField(blank=True, null=True, verbose_name='Interne meldinger')

    # TODO Maybe add method for reallocating reservations if tables are reserved, and prohibit if there is an existing
    table = models.ForeignKey(Table, on_delete=models.PROTECT, null=True, blank=True, verbose_name='Bord')

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.full_clean()
        if not self.table:
            self.table = Reservation.find_available_table(self.venue, self.guest_count, self.reservation_date, self.start_time, self.end_time)
        super().save(*args, **kwargs)

    def clean(self, *args: tuple, **kwargs: dict) -> None:
        super().clean()

        errors: dict[str, ValidationError] = defaultdict()

        if not self.end_time:
            self.end_time = (datetime.combine(self.reservation_date, self.start_time) + timedelta(hours=1)).time()

        if self.end_time < self.start_time:
            errors.setdefault('end_time', []).append('Time should be in the future')

        if not Reservation.check_time(self.venue, self.guest_count, self.reservation_date, self.start_time, self.end_time):
            errors.setdefault('start_time', []).append('There are no available tables for this date')

        raise ValidationError(errors)

    @staticmethod
    def check_time(
        venue: str,
        guest_count: int,
        reservation_date: date,
        start_time: time,
        end_time: time,
    ) -> bool:
        """Checks if time has available tables"""
        return (
            Reservation.find_available_table(
                venue,
                guest_count,
                reservation_date,
                start_time,
                end_time,
            )
            is not None
        )

    @staticmethod
    def find_available_table(
        venue: str,
        guest_count: int,
        reservation_date: date,
        start_time: time,
        end_time: time,
    ) -> Table | None:
        tables = Table.objects.filter(venue=venue, seating__gte=guest_count)
        if tables.count() == 0:
            return None

        reserved_tables = Reservation.objects.filter(
            Q(venue=venue, reservation_date=reservation_date, table__in=tables)
            & (Q(start_time__lte=end_time, end_time__gt=start_time) | Q(start_time__lt=end_time, end_time__gte=end_time))
        )

        return tables.exclude(id__in=reserved_tables.values_list('table_id', flat=True)).order_by('seating').first()

    def fetch_available_times_for_date(*, slug: str, seating: int, date: date) -> list[str]:  # noqa: C901
        """
        Method for returning available reservation times for a venue
        Based on the amount of seating and the date
        """

        # Fetch venue with the given id
        venue = Venue.objects.get(slug=slug)
        # Fetch tables that fits size criteria
        tables = Table.objects.filter(venue=venue.slug, seating__gte=seating)
        # fetch all reservations for those tables for that date
        reserved_tables = (
            Reservation.objects.filter(venue=venue.slug, reservation_date=date, table__in=tables)
            .values('table', 'start_time', 'end_time')
            .order_by('start_time')
        )

        # fetch opening hours for the date
        open_hours = venue.get_opening_hours_date(date)
        c_time = datetime.combine(date, open_hours[0])
        end_time = datetime.combine(date, open_hours[1]) - timezone.timedelta(hours=1)

        # Transform each occupied table to stacks of their reservations
        occupied_table_times: dict[int, list[tuple[time, time]]] = defaultdict(list)
        for tr in reserved_tables:
            occupied_table_times[tr['table']].append((tr['start_time'], tr['end_time']))

        # Checks if list of occupied tables are shorter than available tables
        safe = len(occupied_table_times) < len(tables) or len(reserved_tables) == 0

        available_hours: list[str] = []
        if len(tables) > 0:
            while c_time <= end_time:
                available = False
                # If there are still occupied tables for time
                if not safe:
                    # Loop through tables and reservation
                    for table_times in occupied_table_times.values():
                        # If top of stack is over, remove it

                        if (c_time.time()) >= table_times[0][1]:  # If greater than end remove element
                            table_times.pop(0)
                            # if the reservations for a table is empty, drop checking for availability
                            if not table_times:
                                safe = True
                                break
                        # If time next occupancy is in future, drop and set available table,
                        # also tests for a buffer for an hour, to see if table is available for the next hour
                        if (c_time.time()) < table_times[0][0] and (c_time + timezone.timedelta(hours=1)).time() < table_times[0][0]:
                            # if there is no reservation at the moment, is available for booking
                            available = True
                            break
                # If available or safe, add available hour
                if safe or available:
                    available_hours.append(c_time.strftime('%H:%M'))

                # iterate to next half hour
                c_time = c_time + timezone.timedelta(minutes=30)
                c_time = c_time + (timezone.datetime.min - c_time) % timedelta(minutes=30)
        return available_hours

    class Meta:
        verbose_name = 'Reservation'
        verbose_name_plural = 'Reservations'

    def __str__(self) -> str:
        return f'{self.name}'


class FoodPreference(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')

    class Meta:
        verbose_name = 'FoodPreference'
        verbose_name_plural = 'FoodPreferences'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class FoodCategory(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    order = models.PositiveSmallIntegerField(blank=True, null=True, unique=True)

    class Meta:
        verbose_name = 'FoodCategory'
        verbose_name_plural = 'FoodCategories'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class MenuItem(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_nb = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    price = models.PositiveSmallIntegerField(blank=True, null=True)
    price_member = models.PositiveSmallIntegerField(blank=True, null=True)

    order = models.PositiveSmallIntegerField(blank=True, null=True, unique=True)

    food_preferences = models.ManyToManyField(FoodPreference, blank=True)
    food_category = models.ForeignKey(FoodCategory, blank=True, null=True, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'MenuItem'
        verbose_name_plural = 'MenuItems'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class Menu(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_nb = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    menu_items = models.ManyToManyField(MenuItem, blank=True)

    class Meta:
        verbose_name = 'Menu'
        verbose_name_plural = 'Menus'

    def __str__(self) -> str:
        return f'{self.name_nb}'


def saksdokument_upload_path(instance: Saksdokument, filename: str) -> str:
    """Partition case documents by upload date.

    Example: saksdokumenter/2026/03/fsbok.pdf
    """
    s = '1970/01'
    if instance.created_at:
        s = instance.created_at.strftime('%Y/%m')
    return f'saksdokumenter/{s}/{filename}'


class Saksdokument(CustomBaseModel):
    title_nb = models.CharField(max_length=80, blank=True, null=True, verbose_name='Tittel (Norsk)')
    title_en = models.CharField(max_length=80, blank=True, null=True, verbose_name='Tittel (Engelsk)')
    publication_date = models.DateTimeField(blank=True, null=True)

    category = models.CharField(max_length=25, choices=SaksdokumentCategory.choices, default=SaksdokumentCategory.FS_REFERAT)
    file = models.FileField(upload_to=saksdokument_upload_path, blank=True, null=True)

    class Meta:
        verbose_name = 'Saksdokument'
        verbose_name_plural = 'Saksdokumenter'

    @classmethod
    def schedule_file_cleanup(cls, filename: str) -> None:
        """Delete stored file once the current transaction commits (or immediately if none)"""
        storage = cls._meta.get_field('file').storage

        def delete_file() -> None:
            if filename:
                storage.delete(filename)

        transaction.on_commit(delete_file)

    def __str__(self) -> str:
        return f'{self.title_nb}'


class Infobox(CustomBaseModel):
    title_nb = models.CharField(max_length=60, blank=True, null=True, verbose_name='Tittel (norsk)')
    text_nb = models.CharField(max_length=255, blank=True, null=True, verbose_name='Tekst (norsk)')

    title_en = models.CharField(max_length=60, blank=False, null=False, verbose_name='Tittel (engelsk)')
    text_en = models.CharField(max_length=255, blank=False, null=False, verbose_name='Tekst (engelsk)')

    color = models.CharField(max_length=15, blank=False, null=False, verbose_name='Farge på boks (hex color eller CSS-constant)')
    url = models.URLField(verbose_name='URL', blank=True, null=True)
    image = models.ForeignKey(Image, on_delete=models.PROTECT, blank=True, null=True, verbose_name='Bilde')

    class Meta:
        verbose_name = 'Infoboks'
        verbose_name_plural = 'Infobokser'

    @property
    def image_url(self) -> str:
        return self.image.image.url

    def __str__(self) -> str:
        return f'{self.title_nb}'


class TextItem(CustomBaseModel):
    key = models.CharField(max_length=40, blank=False, null=False, unique=True, primary_key=True)
    text_nb = models.TextField()
    text_en = models.TextField()

    class Meta:
        verbose_name = 'TextItem'
        verbose_name_plural = 'TextItems'

    def __str__(self) -> str:
        return f'{self.key}'


class KeyValue(FullCleanSaveMixin):
    """
    Model for environment variables in the database.
    Should not be used for secrets.
    Can be used to manage behaviour of the system on demand, such as feature toggling.
    Solution is inspired by variables from Github Actions.
    I.e. we do not want more fields on this model, CharField is sufficient, and is very flexible.

    You may populate the field value with whatever is needed.
    For boolean values, it's common to use e.g. `SOME_VAR=1` for `True`, or empty var for `False`.
    This model has helper methods to check for boolean values.

    All keys should be registered in 'samfundet.utils.key_values' for better overview and easy access backend.
    """

    key = models.CharField(max_length=60, blank=False, null=False, unique=True)
    value = models.CharField(max_length=60, default='', blank=True, null=False)

    # Keywords to annotate falsy values.
    EMPTY = ''
    FALSE = 'false'
    NO = 'no'
    ZERO = '0'
    FALSY = [FALSE, NO, ZERO, EMPTY]

    class Meta:
        verbose_name = 'KeyValue'
        verbose_name_plural = 'KeyValues'

    def __str__(self) -> str:
        return f'{self.key}={self.value}'

    def is_true(self) -> bool:
        """Check if value is truthy."""
        return not self.is_false()

    def is_false(self) -> bool:
        """Check if value is falsy."""
        return self.value.lower() in self.FALSY


# ----------------- #
#     Merch         #
# ----------------- #
class Merch(FullCleanSaveMixin):
    name_nb = models.CharField(max_length=60, blank=True, null=False, verbose_name='Navn (norsk)')
    description_nb = models.CharField(max_length=255, blank=True, null=False, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=60, blank=True, null=False, verbose_name='Navn (engelsk)')
    description_en = models.CharField(max_length=255, blank=True, null=False, verbose_name='Beskrivelse (engelsk)')

    base_price = models.PositiveSmallIntegerField(blank=True, null=False)
    released_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    image = models.ForeignKey(Image, on_delete=models.PROTECT, blank=True, null=True, verbose_name='Produkt Bilde')

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        verbose_name = 'Merch'
        verbose_name_plural = 'Merch'

    def in_stock(self) -> int:
        return sum(self.variations.values_list('stock', flat=True))

    @property
    def image_url(self) -> str:
        return self.image.image.url

    def __str__(self) -> str:
        return self.name_nb


class MerchVariation(FullCleanSaveMixin):
    specification = models.CharField(max_length=16, blank=False, null=False, verbose_name='Variation specification')

    merch = models.ForeignKey(Merch, blank=False, null=False, related_name='variations', on_delete=models.CASCADE, verbose_name='Merch')
    price = models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Price Variation')

    stock = models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='In stock')

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    def __str__(self) -> str:
        return f'{self.merch.name_nb} ({self.specification})'


# ----------------- #
#     Feedback      #
# ----------------- #


class UserFeedbackModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField(blank=False, null=False)
    path = models.CharField(max_length=255, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    user_agent = models.TextField(blank=True)
    screen_resolution = models.CharField(max_length=13, blank=True)
    contact_email = models.EmailField(null=True)

    class Meta:
        verbose_name = 'UserFeedback'

    def __str__(self) -> str:
        return ellipsize(self.text, length=10)
