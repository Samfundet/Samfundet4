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

PHONE_NUMBER_REGEX = r'^\+?\s*(\d\s*){8,15}$'


class WebFeatures:
    PROFILE = 'profile'
    CHANGE_P = 'change_p'
    EVENTS = 'events'
    IMAGES = 'images'
    OPENING_HOURS = 'opening_hours'
    CLOSED_HOURS = 'closed_hours'
    USERS = 'users'
    ROLES = 'roles'
    GANGS = 'gangs'
    INFORMATION = 'information'
    DOCUMENTS = 'documents'
    RECRUITMENT = 'recruitment'
    SULTEN = 'sulten'
    FAQ = 'faq'
    ORGANIZATION = 'organization'
    VENUE = 'venue'
    BLOG = 'blog'
    MERCH = 'merch'


CP_FEATURES_ALL = {
    WebFeatures.PROFILE,
    WebFeatures.CHANGE_P,
    WebFeatures.EVENTS,
    WebFeatures.IMAGES,
    WebFeatures.OPENING_HOURS,
    WebFeatures.CLOSED_HOURS,
    WebFeatures.USERS,
    WebFeatures.ROLES,
    WebFeatures.GANGS,
    WebFeatures.INFORMATION,
    WebFeatures.DOCUMENTS,
    WebFeatures.RECRUITMENT,
    WebFeatures.SULTEN,
    WebFeatures.FAQ,
    WebFeatures.ORGANIZATION,
    WebFeatures.VENUE,
    WebFeatures.BLOG,
    WebFeatures.MERCH,
}
