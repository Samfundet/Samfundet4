from django.apps import AppConfig

from .. import CWD


class GangsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = f'{CWD}.gangs'
