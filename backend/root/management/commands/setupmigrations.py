# imports
from __future__ import annotations
import os

from django.conf import settings
from django.core.management.base import BaseCommand
# End: imports -----------------------------------------------------------------


class Command(BaseCommand):

    def handle(self, *args, **options):
        for app in settings.PROJECT_APPS:

            try:
                path = app.replace('.', '/')
                migrations = f'{path}/migrations'
                os.mkdir(migrations)
                init = f'{migrations}/__init__.py'
                open(file=init, mode='a', encoding='utf-8').close()

            except Exception as _e:
                pass
                # print(f'{app} failed. {_e}')
