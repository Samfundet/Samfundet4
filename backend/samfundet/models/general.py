#
# This file contains most of the django models used for Samf4
#

from __future__ import annotations

import re
import random
from typing import TYPE_CHECKING
from django.utils import timezone
from datetime import date, time

from notifications.base.models import AbstractNotification

from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from guardian.shortcuts import assign_perm
from django.utils.translation import gettext as _

from root.utils.mixins import FullCleanSaveMixin, CustomBaseModel
from root.utils import permissions

from .utils.fields import LowerCaseField, PhoneNumberField

from samfundet.models.model_choices import UserPreferenceTheme, SaksdokumentCategory

if TYPE_CHECKING:
    from typing import Any, Optional
    from django.db.models import Model


class Notification(AbstractNotification):

    class Meta(AbstractNotification.Meta):
        abstract = False


class Tag(CustomBaseModel):
    # TODO make name case-insensitive
    # Kan tvinge alt til lowercase, er enklere.
    name = models.CharField(max_length=140)
    color = models.CharField(max_length=6, null=True, blank=True)

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'

    def __str__(self) -> str:
        return f'{self.name}'

    @classmethod
    def random_color(cls) -> str:
        hexnr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        c = random.choices(range(len(hexnr)), k=6)
        while sum(c) < (len(hexnr)) * 5:  # Controls if color is not too bright
            c = random.choices(range(len(hexnr)), k=6)
        return ''.join([hexnr[i] for i in c])

    @classmethod
    def find_or_create(cls, name: str) -> Tag:
        # TODO make name case-insensitive
        obj = Tag.objects.get(name=name)
        if obj is not None:
            return obj
        # Create new tag if none exists
        return Tag.objects.create(name=name, color=Tag.random_color())

    def save(self, *args: Any, **kwargs: Any) -> None:
        # Saves with random color
        if not self.color or not re.search(r'^(?:[0-9a-fA-F]{3}){1,2}$', self.color):
            self.color = Tag.random_color()
        super().save(*args, **kwargs)


class Image(CustomBaseModel):
    title = models.CharField(max_length=140)
    tags = models.ManyToManyField(Tag, blank=True, related_name='images')
    image = models.ImageField(upload_to='images/', blank=False, null=False)

    class Meta:
        verbose_name = 'Image'
        verbose_name_plural = 'Images'

    def __str__(self) -> str:
        return f'{self.title}'


class Campus(FullCleanSaveMixin):
    name_nb = models.CharField(max_length=64, unique=True, blank=False, null=False)
    name_en = models.CharField(max_length=64, unique=True, blank=False, null=False)
    abbreviation = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self) -> str:
        if not self.abbreviation:
            return f'{self.name_nb}'
        return f'{self.name_nb} ({self.abbreviation})'


class User(AbstractUser):
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

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

    class Meta:
        permissions = [
            ('debug', 'Can view debug mode'),
            ('impersonate', 'Can impersonate users'),
        ]

    def has_perm(self, perm: str, obj: Optional[Model] = None) -> bool:
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
    mirror_dimension = models.BooleanField(default=False)
    cursor_trail = models.BooleanField(default=False)

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        verbose_name = 'UserPreference'
        verbose_name_plural = 'UserPreferences'

    def __str__(self) -> str:
        return f'UserPreference ({self.user})'


class Profile(FullCleanSaveMixin):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    nickname = models.CharField(max_length=30, blank=True, null=True)

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'

    def __str__(self) -> str:
        return f'Profile ({self.user})'

    def save(self, *args: Any, **kwargs: Any) -> None:
        """Additional operations on save."""
        super().save(*args, **kwargs)

        # Extend Profile to assign permission to whichever user is related to it.
        assign_perm(perm=permissions.SAMFUNDET_VIEW_PROFILE, user_or_group=self.user, obj=self)
        assign_perm(perm=permissions.SAMFUNDET_CHANGE_PROFILE, user_or_group=self.user, obj=self)


class Venue(CustomBaseModel):
    name = models.CharField(max_length=140, blank=True, null=True, unique=True)
    slug = models.SlugField(unique=True, null=True)
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
    """
    Object for mapping out the orgs with different gangs, eg. Samfundet, UKA, ISFiT
    """
    name = models.CharField(max_length=32, blank=False, null=False, unique=True)

    class Meta:
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'

    def __str__(self) -> str:
        return self.name


class GangType(CustomBaseModel):
    """
    Type of gang. eg. 'arrangerende', 'kunstnerisk' etc.
    """
    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Norsk')
    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Engelsk')

    class Meta:
        verbose_name = 'GangType'
        verbose_name_plural = 'GangTypes'

    def __str__(self) -> str:
        return f'{self.title_nb}'


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

    # Gang related permission groups
    gang_leader_group = models.OneToOneField(Group, related_name='gang_as_leader', verbose_name='Gangleder', blank=True, null=True, on_delete=models.SET_NULL)
    event_admin_group = models.OneToOneField(
        Group, related_name='gang_as_event_admin_group', verbose_name='Arrangementgruppe', blank=True, null=True, on_delete=models.SET_NULL
    )
    recruitment_admin_group = models.OneToOneField(
        Group, related_name='gang_as_recruitment_admin_group', verbose_name='Innganggruppe', blank=True, null=True, on_delete=models.SET_NULL
    )

    class Meta:
        verbose_name = 'Gang'
        verbose_name_plural = 'Gangs'

    def __str__(self) -> str:
        return f'{self.gang_type} - {self.name_nb}'


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


class Saksdokument(CustomBaseModel):
    title_nb = models.CharField(max_length=80, blank=True, null=True, verbose_name='Tittel (Norsk)')
    title_en = models.CharField(max_length=80, blank=True, null=True, verbose_name='Tittel (Engelsk)')
    publication_date = models.DateTimeField(blank=True, null=True)

    category = models.CharField(max_length=25, choices=SaksdokumentCategory.choices, default=SaksdokumentCategory.FS_REFERAT)
    file = models.FileField(upload_to='uploads/saksdokument/', blank=True, null=True)

    class Meta:
        verbose_name = 'Saksdokument'
        verbose_name_plural = 'Saksdokumenter'

    def __str__(self) -> str:
        return f'{self.title_nb}'


class Infobox(CustomBaseModel):
    title_nb = models.CharField(max_length=60, blank=False, null=False, verbose_name='Infoboks titel (norsk)')
    text_nb = models.CharField(max_length=255, blank=False, null=False, verbose_name='Infoboks tekst (norsk)')

    title_en = models.CharField(max_length=60, blank=False, null=False, verbose_name='Infoboks tekst (engelsk)')
    text_en = models.CharField(max_length=255, blank=False, null=False, verbose_name='Infoboks tekst (engelsk)')

    color = models.CharField(max_length=15, blank=False, null=False, verbose_name='Infoboks hexcolor eller css color-constant')
    url = models.URLField(verbose_name='Infoboks utgående link', blank=True, null=True)
    image = models.ForeignKey(Image, on_delete=models.PROTECT, blank=True, null=True, verbose_name='Infoboks bilde')

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
