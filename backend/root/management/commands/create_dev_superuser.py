from __future__ import annotations

import os

from django.conf import settings
from django.core import management
from django.core.management.base import BaseCommand

from root.constants import Environment

from samfundet.models.general import User


class Command(BaseCommand):
    help = 'Create the dev superuser from DJANGO_SUPERUSER_* env vars if it does not exist.'

    def handle(self, *args, **options):
        if settings.ENV != Environment.DEV:
            self.stdout.write('Not a dev environment, skipping superuser creation.')
            return

        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        if not username:
            self.stdout.write('DJANGO_SUPERUSER_USERNAME not set, skipping superuser creation.')
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(f"Superuser '{username}' already exists.")
            return

        management.call_command('createsuperuser', interactive=False)
