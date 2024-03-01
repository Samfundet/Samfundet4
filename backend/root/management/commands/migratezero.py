# imports
from __future__ import annotations

from django.conf import settings
from django.core import management
from django.core.management.base import BaseCommand

# End: imports -----------------------------------------------------------------


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            '--noinput',
            '--no-input',
            action='store_false',
            dest='interactive',
            help='Tells Django to NOT prompt the user for input of any kind.',
        )

    def confirmation(self):
        answer = None
        yes = ['yes', 'y']
        no = ['no', 'n']
        print('== This command will:')
        print('\t 1. Migrate all apps to zero.')

        print('\n== Are you sure? DOUBLE-CHECK that this is not production server ==')

        while answer not in yes + no:
            answer = input("Type 'y' or 'n': ").lower()

        return answer in yes

    def handle(self, *args, **options):
        """Migrate each installed app to zero"""
        if options['interactive'] and not self.confirmation():
            print('== ABORT ==')
            return

        for app in settings.INSTALLED_APPS:
            try:
                appname = app.split('.')[-1]
                management.call_command('migrate', appname, 'zero')
            # Supress since performance is not an issue here
            except Exception as _e:  # noqa: S110
                pass
                # print(f"{app} failed. {_e}")
