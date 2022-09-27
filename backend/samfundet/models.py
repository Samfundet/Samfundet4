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
