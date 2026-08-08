from __future__ import annotations

from django.apps import AppConfig


class SamfundetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'samfundet'

    def ready(self) -> None:
        from . import signals  # noqa: F401, PLC0415 # Important, this enables signals.
