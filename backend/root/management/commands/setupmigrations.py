# imports
import os

from django.conf import settings
from django.core.management.base import BaseCommand
# End: imports -----------------------------------------------------------------

# pylint: disable=positional-arguments


class Command(BaseCommand):

    def handle(self, *args, **options):
        for app in settings.PROJECT_APPS:

            try:
                path = app.replace('.', '/')
                migrations = f'{path}/migrations'
                os.mkdir(migrations)
                init = f'{migrations}/__init__.py'
                open(file=init, mode='a', encoding='utf-8').close()  # pylint: disable=consider-using-with

            except Exception as _e:  # pylint: disable=broad-except # nosec try_except_pass # noqa: F841
                pass
                # print(f'{app} failed. {_e}')
