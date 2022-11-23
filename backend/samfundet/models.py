from guardian.shortcuts import get_content_type

from django.db import models
from django.utils.translation import gettext as _
from django.contrib.auth.models import User

from .dto import ProfileDto, UserPreferenceDto, VenueDto
from .utils import content_type_to_dataclass


class EventGroup(models.Model):
    ...


class Event(models.Model):
    title_no = models.CharField(max_length=140)
    title_en = models.CharField(max_length=140)
    start_dt = models.DateTimeField()
    end_dt = models.DateTimeField()
    description_long_no = models.TextField()
    description_long_en = models.TextField()
    description_short_no = models.TextField()
    description_short_en = models.TextField()
    publish_dt = models.DateTimeField()
    host = models.CharField(max_length=140)
    location = models.CharField(max_length=140)
    event_group = models.ForeignKey(EventGroup, on_delete=models.PROTECT)

    class PriceGroup(models.TextChoices):
        INCLUDED = 'INCLUDED', _('Included with entrance')
        FREE = 'FREE', _('Free')
        BILLIG = 'BILLIG', _('Paid')
        REGISTRATION = 'REGISTRATION', _('Free with registration')

    price_group = models.CharField(max_length=30, choices=PriceGroup.choices, default=PriceGroup.FREE)


class Venue(models.Model):
    name = models.CharField(max_length=140)
    description = models.TextField()
    floor = models.IntegerField()
    last_renovated = models.IntegerField()
    handicapped_approved = models.BooleanField()
    responsible_crew = models.CharField(max_length=140)

    def to_dataclass(self) -> VenueDto:
        content_type = get_content_type(self)
        return VenueDto(
            id=self.id,
            name=self.name,
            description=self.description,
            floor=self.floor,
            last_renovated=self.last_renovated,
            handicapped_approved=self.handicapped_approved,
            responsible_crew=self.responsible_crew,
            content_type=content_type_to_dataclass(content_type=content_type),
        )


class UserPreference(models.Model):
    """Group all preferences and config per user"""

    class Theme(models.TextChoices):
        """Same as in frontend"""
        LIGHT = 'theme-light'
        DARK = 'theme-dark'

    user = models.OneToOneField(User, on_delete=models.PROTECT)
    theme = models.CharField(max_length=30, choices=Theme.choices, default=Theme.LIGHT)

    def to_dataclass(self) -> UserPreferenceDto:
        content_type = get_content_type(self)
        return UserPreferenceDto(
            id=self.id,
            theme=self.theme,
            content_type=content_type_to_dataclass(content_type=content_type),
        )


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    nickname = models.CharField(max_length=30)

    def to_dataclass(self) -> ProfileDto:
        content_type = get_content_type(self)
        return ProfileDto(
            id=self.id,
            nickname=self.nickname,
            content_type=content_type_to_dataclass(content_type=content_type),
        )


# GANGS ###
class GangType(models.Model):
    title = models.CharField(max_length=64, blank=False, null=False, verbose_name='Gruppetype')

    def __str__(self) -> str:
        return f'{self.title}'


class Gang(models.Model):
    name = models.CharField(max_length=64, blank=False, null=False, verbose_name='Navn')
    abbreviation = models.CharField(max_length=64, blank=False, null=False, verbose_name='Forkortelse')
    webpage = models.URLField(verbose_name='Nettside')

    group_type = models.ForeignKey(to=GangType, verbose_name='Gruppetype', null=True, on_delete=models.SET_NULL)

    # TODO ADD Information Page

    def __str__(self) -> str:
        return f'{self.group_type} {self.name}'


class InformationPage(models.Model):
    name_no = models.CharField(max_length=64, unique=True, blank=False, null=False, verbose_name='Navn Norsk')
    title_no = models.CharField(max_length=64, blank=False, null=False, verbose_name='Tittel Norsk')
    text_no = models.TextField(blank=False, null=False, verbose_name='Tekst Norsk')

    name_en = models.CharField(max_length=64, blank=False, null=False, verbose_name='Navn Engelsk')
    title_en = models.CharField(max_length=64, blank=False, null=False, verbose_name='Tittel Engelsk')
    text_en = models.TextField(blank=False, null=False, verbose_name='Tekst Engelsk')

    # TODO Implement HTML and Markdown
    # TODO Find usage for owner field

    def __str__(self) -> str:
        return f'{self.name_no}'
