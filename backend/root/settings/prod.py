from __future__ import annotations

import os

from root.constants import Environment

from .base import *  # noqa: F403,F401

ALLOWED_HOSTS = [os.environ['DOMAIN']]

SECRET_KEY = os.environ['SECRET_KEY']
DEBUG = False

# Ensure correct ENV
ENV = Environment.PROD

# Security
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 60  # TODO: Find a decent value
SECURE_SSL_REDIRECT = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

DATABASES = {
    # The default database used for all Samf4 models
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': os.environ['DB_HOST'],
        'PORT': os.environ['DB_PORT'],
    },
    # The database for the billig system
    'billig': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['BILLIG_DB_NAME'],
        'USER': os.environ['BILLIG_DB_USER'],
        'PASSWORD': os.environ['BILLIG_DB_PASSWORD'],
        'HOST': os.environ['BILLIG_DB_HOST'],
        'PORT': os.environ['BILLIG_DB_PORT'],
    },
}
