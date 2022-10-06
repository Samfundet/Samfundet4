from django.db import models

# Create your models here.


class Event(models.Model):
    title = models.CharField(max_length=140)
    start_dt = models.DateTimeField()
    end_dt = models.DateTimeField()
    description_long = models.TextField()
    description_short = models.TextField()
    publish_dt = models.DateTimeField()
    host = models.CharField(max_length=140)
    location = models.CharField(max_length=140)


class Venue(models.Model):
    name = models.CharField(max_length=140)
    description = models.TextField()
    floor = models.IntegerField()
    last_renovated = models.IntegerField()
    handicapped_approved = models.BooleanField()
    responsible_crew = models.CharField(max_length=140)
