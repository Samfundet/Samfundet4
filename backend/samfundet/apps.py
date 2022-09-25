import os
import logging

from django.apps import AppConfig

from root.constants import Environment

LOG = logging.getLogger('samfundet')

# pylint: disable=import-outside-toplevel


class SamfundetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'samfundet'

    def ready(self):
        from django.core import management

        if os.environ['ENV'] == Environment.DEV:
            try:
                LOG.info(f"Attempt to create superuser '{os.environ.get('DJANGO_SUPERUSER_USERNAME')}'")
                management.call_command('createsuperuser', interactive=False)
            except Exception as e:  # pylint: disable=broad-except
                LOG.info(e)
