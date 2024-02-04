from __future__ import annotations

import os
import logging

from django.apps import AppConfig

from root.constants import Environment

LOG = logging.getLogger('samfundet')


class SamfundetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'samfundet'

    def ready(self) -> None:
        from django.core import management

        from . import signals  # noqa: F401 # Important, this enables signals.

        if os.environ['ENV'] == Environment.DEV:
            try:
                LOG.info(f"Attempt to create superuser '{os.environ.get('DJANGO_SUPERUSER_USERNAME')}'")
                management.call_command('createsuperuser', interactive=False)
            except Exception as e:
                LOG.info(e)
