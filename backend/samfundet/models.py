from django.db import models
from django.utils.translation import gettext as _

# Create your models here.


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


### GANGS ###
class GangType(models.Model):
    title = models.CharField(max_length=64, blank=False, null=False, verbose_name='Gruppetype')

    class Meta:
        verbose_name = 'Gruppetype'
        verbose_name_plural = 'Gruppetyper'

    def __str__(self):
        return self.title


class Gang(models.Model):
    name = models.CharField(max_length=64, blank=False, null=False, verbose_name='Navn')
    abbreviation = models.CharField(max_length=64, blank=False, null=False, verbose_name='Forkortelse')
    webpage = models.URLField(verbose_name='Nettside')

    group_type = models.ForeignKey(to=GangType, verbose_name='Gruppetype', null=True, on_delete=models.SET_NULL)

    # TODO ADD Information Page

    class Meta:
        verbose_name = 'Gjeng'
        verbose_name_plural = 'Gjenger'

    def __str__(self):
        return f'{self.group_type} {self.name}'
