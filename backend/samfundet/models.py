from typing import Any
from datetime import time, timedelta

from guardian.shortcuts import assign_perm

from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.contrib.auth.models import User

from root.utils import permissions


class EventGroup(models.Model):
    name = models.CharField(max_length=140)

    class Meta:
        verbose_name = 'EventGroup'
        verbose_name_plural = 'EventGroups'


class Event(models.Model):
    title_no = models.CharField(max_length=140)
    title_en = models.CharField(max_length=140)
    start_dt = models.DateTimeField(blank=True, null=True)
    end_dt = models.DateTimeField(blank=True, null=True)
    description_long_no = models.TextField(blank=True, null=True)
    description_long_en = models.TextField(blank=True, null=True)
    description_short_no = models.TextField(blank=True, null=True)
    description_short_en = models.TextField(blank=True, null=True)
    publish_dt = models.DateTimeField(blank=True, null=True)
    host = models.CharField(max_length=140, blank=True, null=True)
    location = models.CharField(max_length=140, blank=True, null=True)
    event_group = models.ForeignKey(EventGroup, on_delete=models.PROTECT, blank=True, null=True)

    class PriceGroup(models.TextChoices):
        INCLUDED = 'INCLUDED', _('Included with entrance')
        FREE = 'FREE', _('Free')
        BILLIG = 'BILLIG', _('Paid')
        REGISTRATION = 'REGISTRATION', _('Free with registration')

    price_group = models.CharField(max_length=30, choices=PriceGroup.choices, default=PriceGroup.FREE, blank=True, null=True)

    class Meta:
        verbose_name = 'Event'
        verbose_name_plural = 'Events'


class Venue(models.Model):
    name = models.CharField(max_length=140, blank=True, null=True, unique=True)
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

    def __str__(self) -> str:
        return f'{self.name}'


class UserPreference(models.Model):
    """Group all preferences and config per user."""

    class Theme(models.TextChoices):
        """Same as in frontend"""
        LIGHT = 'theme-light'
        DARK = 'theme-dark'

    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    theme = models.CharField(max_length=30, choices=Theme.choices, default=Theme.LIGHT, blank=True, null=True)

    class Meta:
        verbose_name = 'UserPreference'
        verbose_name_plural = 'UserPreferences'

    def __str__(self) -> str:
        return f'UserPreference ({self.user})'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    nickname = models.CharField(max_length=30, blank=True, null=True)

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


# GANGS ###
class GangType(models.Model):
    title_no = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Norsk')
    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Engelsk')

    class Meta:
        verbose_name = 'GangType'
        verbose_name_plural = 'GangTypes'

    def __str__(self) -> str:
        return f'{self.title_no}'


class Gang(models.Model):
    name_no = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn Norsk')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn Engelsk')
    abbreviation = models.CharField(max_length=64, blank=True, null=True, verbose_name='Forkortelse')
    webpage = models.URLField(verbose_name='Nettside', blank=True, null=True)

    logo = models.ImageField(upload_to='ganglogos/', blank=True, null=True, verbose_name='Logo')
    gang_type = models.ForeignKey(to=GangType, related_name='gangs', verbose_name='Gruppetype', blank=True, null=True, on_delete=models.SET_NULL)
    info_page = models.ForeignKey(to='samfundet.InformationPage', verbose_name='Infoside', blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = 'Gang'
        verbose_name_plural = 'Gangs'

    def __str__(self) -> str:
        return f'{self.gang_type} - {self.name_no}'


class InformationPage(models.Model):
    slug_field = models.SlugField(
        max_length=64,
        blank=False,
        null=False,
        unique=True,
        primary_key=True,
        help_text='Primary key, this field will identify the object and be used in the URL.',
    )

    title_no = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (norsk)')
    text_no = models.TextField(blank=True, null=True, verbose_name='Tekst (norsk)')

    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (engelsk)')
    text_en = models.TextField(blank=True, null=True, verbose_name='Tekst (engelsk)')

    # TODO Find usage for owner field

    class Meta:
        verbose_name = 'InformationPage'
        verbose_name_plural = 'InformationPages'

    def __str__(self) -> str:
        return f'{self.slug_field}'


class Table(models.Model):
    name_no = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_no = models.CharField(max_length=64, blank=True, null=True, verbose_name='Beskrivelse (norsk)')

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
        return f'{self.name_no}'


class FoodPreference(models.Model):
    name_no = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')

    def __str__(self) -> str:
        return f'{self.name_no}'


class FoodCategory(models.Model):
    name_no = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    order = models.PositiveSmallIntegerField(blank=True, null=True, unique=True)

    def __str__(self) -> str:
        return f'{self.name_no}'


class MenuItem(models.Model):
    name_no = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_no = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')

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
        return f'{self.name_no}'


class Menu(models.Model):
    name_no = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_no = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    menu_items = models.ManyToManyField(MenuItem, blank=True)

    class Meta:
        verbose_name = 'Menu'
        verbose_name_plural = 'Menus'

    def __str__(self) -> str:
        return f'{self.name_no}'


class Saksdokument(models.Model):
    title_no = models.CharField(max_length=80, blank=True, null=True, verbose_name='Tittel (Norsk)')
    title_en = models.CharField(max_length=80, blank=True, null=True, verbose_name='Tittel (Engelsk)')
    publication_date = models.DateTimeField(blank=True, null=True)

    class SaksdokumentCategory(models.TextChoices):
        FS_REFERAT = 'FS_REFERAT', _('FS-Referat')
        STYRET = 'STYRET', _('Styret')
        RADET = 'RADET', _('Rådet')
        ARSBERETNINGER = 'ARSBERETNINGER', _('Årsberetninger, regnskap og budsjettkunngjøringer')

    category = models.CharField(max_length=25, choices=SaksdokumentCategory.choices, default=SaksdokumentCategory.FS_REFERAT)
    file = models.FileField(upload_to='uploads/saksdokument/', blank=True, null=True)

    class Meta:
        verbose_name = 'Saksdokument'
        verbose_name_plural = 'Saksdokument'

    def __str__(self) -> str:
        return f'{self.title_no}'


class Booking(models.Model):
    name = models.CharField(max_length=64, blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    from_dt = models.DateTimeField(blank=True, null=True)
    to_dt = models.DateTimeField(blank=True, null=True)

    tables = models.ManyToManyField(Table, blank=True)

    user = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)
    first_name = models.CharField(max_length=64, unique=True, blank=True, null=True)
    last_name = models.CharField(max_length=64, unique=True, blank=True, null=True)
    email = models.CharField(max_length=64, unique=True, blank=True, null=True)
    phone_nr = models.CharField(max_length=64, unique=True, blank=True, null=True)

    class Meta:
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'

    def __str__(self) -> str:
        return f'Booking: {self.name} - {self.user} - {self.from_dt} ({self.table_count()})'

    def table_count(self) -> int:
        n: int = self.tables.count()
        return n

    def get_duration(self) -> timedelta | None:
        if self.to_dt and self.from_dt:
            duration: timedelta = self.to_dt - self.from_dt
            return duration
        return None

    def clean(self) -> None:
        errors: dict[str, ValidationError] = {}

        field_to_validate = 'to_dt'
        duration_constraint_hours = 2
        duration = self.get_duration()
        if duration and duration > timedelta(hours=duration_constraint_hours):
            error = f'Duration cannot be longer than {duration_constraint_hours} hours.'
            errors.setdefault(field_to_validate, []).append(error)

        if errors:
            raise ValidationError(errors)

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.full_clean()
        super().save(*args, **kwargs)
