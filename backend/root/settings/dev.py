# imports
import os

from root.constants import Environment
from .base import *  # pylint: disable=wildcard-import,unused-wildcard-import # noqa: F403
# End: imports -----------------------------------------------------

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'backend']
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

# Bypass authentication for testing purposes. Only applies when ENV==DEVELOPMENT.
BYPASS_AUTHENTICATION = os.environ.get('BYPASS_AUTHENTICATION') == 'yes'
if BYPASS_AUTHENTICATION:
    # We know REST_FRAMEWORK and other variables are available from star import.
    REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES'] = ['rest_framework.permissions.AllowAny']  # noqa: F405

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

### Database ###
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases
DOCKER_DB_NAME = 'docker.db.sqlite3'
LOCAL_DB_NAME = 'db.sqlite3'
DB_NAME = DOCKER_DB_NAME if IS_DOCKER else LOCAL_DB_NAME  # noqa: F405

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'database' / DB_NAME,  # noqa: F405
    }
}
### End: Database ###
