from django.db import models

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
