# imports
import os

from root.constants import Environment
from .base import *  # pylint: disable=wildcard-import,unused-wildcard-import # noqa: F403
# End: imports -----------------------------------------------------

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
if os.environ.get('DOMAIN'):
    ALLOWED_HOSTS.append(os.environ['DOMAIN'])

SECRET_KEY = os.environ['SECRET_KEY']
DEBUG = True

# Ensure correct ENV
ENV = Environment.DEV

### CORS ###
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
# https://testdriven.io/blog/django-spa-auth/#frontend-served-separately-cross-domain
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_CREDENTIALS = True
### End: CORS ###

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

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases
DATABASES = {
    'default':
        {
            'ENGINE': 'django.db.backends.sqlite3',
            # We know BASE_DIR and other variables are available from star import.
            'NAME': BASE_DIR / 'database' / 'db.sqlite3',  # noqa: F405
        }
}
