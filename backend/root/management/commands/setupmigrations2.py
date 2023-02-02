# imports
from django.conf import settings
from django.core import management
from django.core.management.base import BaseCommand
# End: imports -----------------------------------------------------------------

# pylint: disable=positional-arguments


class Command(BaseCommand):

    def handle(self, *args, **options):

        for app in settings.INSTALLED_APPS:

            appname = app.split('.')[-1]

            try:
                management.call_command('makemigrations', appname)

            except Exception as _e:  # pylint: disable=broad-exception-raised
                # pass
                print(f'{app} failed. {_e}')
