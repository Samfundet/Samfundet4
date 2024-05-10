"""
WSGI config for main project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""
from __future__ import annotations

import os

from django.core.wsgi import get_wsgi_application

from root.utils.debugpy import initialize_debugpy

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'root.settings')

application = get_wsgi_application()

initialize_debugpy()
