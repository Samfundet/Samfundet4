from contextvars import ContextVar

from django.http import HttpRequest


class Environment:
    """
    Useful in eg. templates.
    Override in different settings.
    """
    BASE = 'base'
    DEV = 'development'
    PROD = 'production'

    ALL = [BASE, DEV, PROD]
    VALID = [DEV, PROD]


# Name of exposed csrf-token header in http traffic.
XCSRFTOKEN = 'X-CSRFToken'

# Name of cookie used for impersonation.
COOKIE_IMPERSONATED_USER_ID = 'impersonated_user_id'

# Name of attribute set on response for requested impersonation of user_id.
REQUESTED_IMPERSONATE_USER = 'requested_impersonate_user'

# This token can be imported anywhere to retrieve the values.
request_contextvar: ContextVar[HttpRequest] = ContextVar('request_contextvar', default=None)

AUTH_BACKEND = 'django.contrib.auth.middleware.AuthenticationMiddleware'
