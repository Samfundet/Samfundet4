from __future__ import annotations

from django.conf import settings
from django.core import management
from django.core.management.base import BaseCommand

from root.constants import Environment

from samfundet.models.event import Event
from samfundet.models.general import Image, Venue
from samfundet.models.recruitment import Recruitment


class Command(BaseCommand):
    help = 'Seed database for testing and development.'

    def handle(self, *args, **options):
        print('Checking if seed is neccessary...')

        # Avoid running seed in production.
        if settings.ENV == Environment.PROD:
            print("Detected production environment! Cancelled seed if empty script. You're welcome.")
            return

        has_venues = Venue.objects.all().exists()
        has_images = Image.objects.all().exists()
        has_event = Event.objects.all().exists()
        has_recruitment = Recruitment.objects.all().exists()

        if not all([has_venues, has_images, has_event, has_recruitment]):
            print('Seeding since it seems like db is empty (probably).')
            management.call_command('seed')
        else:
            print('Seed was (probably) not neccessary.')
