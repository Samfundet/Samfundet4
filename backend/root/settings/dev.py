# imports
from __future__ import annotations

import os

from django.core.exceptions import ImproperlyConfigured

from root.constants import Environment

from .base import *  # noqa: F403

# End: imports -----------------------------------------------------

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'backend']
if os.environ.get('DOMAIN'):
    ALLOWED_HOSTS.append(os.environ['DOMAIN'])

SECRET_KEY = os.environ['SECRET_KEY']
DEBUG = True

# Ensure correct ENV
ENV = Environment.DEV
BILLIG_PAYMENT_URL = os.environ.get('BILLIG_PAYMENT_URL', 'http://localhost:8000/api/billig/dev/pay/')
BILLIG_FRONTEND_BASE_URL = os.environ.get('BILLIG_FRONTEND_BASE_URL', 'http://localhost:3000')

### CORS ###
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:6006',
]
# https://testdriven.io/blog/django-spa-auth/#frontend-served-separately-cross-domain
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_CREDENTIALS = True
### End: CORS ###

# Bypass authentication for testing purposes. Only applies when ENV==DEVELOPMENT.
BYPASS_AUTHENTICATION = os.environ.get('BYPASS_AUTHENTICATION') == 'yes'
if BYPASS_AUTHENTICATION:
    # We know REST_FRAMEWORK and other variables are available from star import.
    REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES'] = ['rest_framework.permissions.AllowAny']

# Security
X_FRAME_OPTIONS = 'SAMEORIGIN'

SESSION_COOKIE_SECURE = False

SECURE_HSTS_SECONDS = 0
SECURE_SSL_REDIRECT = False
SECURE_HSTS_PRELOAD = False
SECURE_BROWSER_XSS_FILTER = False
SECURE_CONTENT_TYPE_NOSNIFF = False
SECURE_HSTS_INCLUDE_SUBDOMAINS = False

SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

CSRF_COOKIE_SECURE = False
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = True
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

# ======================== #
#        Database          #
# ======================== #
# https://docs.djangoproject.com/en/5.1/ref/databases/
# Config was first created in version 3.2, so there is a possibility that this file can be refactored to use more up to date methdos.

# Credentials injected through docker-compose.yml from .env
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['SM4_DEV_CREDENTIAL'],  # Required - will fail if not set
        'USER': os.environ['SM4_DEV_CREDENTIAL'],
        'PASSWORD': os.environ['SM4_DEV_CREDENTIAL'],
        'HOST': os.environ.get('SM4_DEV_HOST', 'sm4_dev_database'),  # Docker service name or CI host
        'PORT': os.environ.get('SM4_DEV_PORT', '5432'),
    },
    'billig': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['BILLIG_DEV_CREDENTIAL'],  # Required - will fail if not set
        'USER': os.environ['BILLIG_DEV_CREDENTIAL'],
        'PASSWORD': os.environ['BILLIG_DEV_CREDENTIAL'],
        'HOST': os.environ.get('BILLIG_DEV_HOST', 'billig_dev_database'),  # Docker service name or CI host
        'PORT': os.environ.get('BILLIG_DEV_PORT', '5432'),  # Docker internal port or CI host port
    },
    'mdb': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['MDB_DEV_CREDENTIAL'],
        'USER': os.environ['MDB_DEV_CREDENTIAL'],
        'PASSWORD': os.environ['MDB_DEV_CREDENTIAL'],
        'HOST': os.environ.get('MDB_DEV_HOST', 'mdb_dev'),  # Docker service name or CI host
        'PORT': os.environ.get('MDB_DEV_PORT', '5432'),  # Docker internal port or CI host port
    },
}

# ======================== #
#         Logging          #
# ======================== #

# Clean console logging in development (pretty stack trace)
LOGGING['loggers'][''] = {  # type: ignore[index]
    'handlers': ['console'],
    'level': 'DEBUG',
    'propagate': True,
}

# ======================== #
#         Email            #
# ======================== #

if IS_DOCKER:
    # Capture all email in MailHog (docker-compose service 'mailhog').
    # Nothing is ever relayed to the outside world: dev settings never read
    # the production-oriented EMAIL_* variables, and non-local hosts are rejected.
    MAILHOG_HOST = os.environ.get('MAILHOG_HOST', 'mailhog')
    MAILHOG_LOCAL_HOSTS = {'mailhog', 'localhost', '127.0.0.1', 'host.docker.internal'}
    if MAILHOG_HOST not in MAILHOG_LOCAL_HOSTS:
        raise ImproperlyConfigured(f'MAILHOG_HOST must be one of {sorted(MAILHOG_LOCAL_HOSTS)}, got {MAILHOG_HOST!r}. Refusing to send dev email elsewhere.')
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = MAILHOG_HOST
    EMAIL_PORT = int(os.environ.get('MAILHOG_PORT', '1025'))
    EMAIL_USE_TLS = False
else:
    # Native development: print email to the console.
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
