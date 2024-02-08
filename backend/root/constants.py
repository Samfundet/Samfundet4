from __future__ import annotations

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

# Name of the http header from Github webhook to compare signature of payload.
# https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
GITHUB_SIGNATURE_HEADER = 'HTTP_X_HUB_SIGNATURE_256'

# Name of the http header from Github webhook to identify event type.
# (action can be found in the payload.)
# https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks
GITHUB_EVENT_HEADER = 'X-GitHub-Event'

# This token can be imported anywhere to retrieve the values.
request_contextvar: ContextVar[HttpRequest] = ContextVar('request_contextvar', default=None)

AUTH_BACKEND = 'django.contrib.auth.backends.ModelBackend'

# Phone number regex

PHONE_NUMBER_REGEX = r'^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{7,15}$'
