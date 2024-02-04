from __future__ import annotations

import logging
import secrets

from django.http import HttpRequest, HttpResponse
from django.contrib.auth import login
from django.middleware.csrf import get_token

from root.constants import (
    REQUESTED_IMPERSONATE_USER,
    COOKIE_IMPERSONATED_USER_ID,
    request_contextvar,
)

from samfundet.models import User

LOG = logging.getLogger('root.middlewares')


class RequestLogMiddleware:
    """Request Logging Middleware."""

    def __init__(self, get_response) -> None:  # type: ignore # noqa: ANN001 # Uknown type # type: ignore
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        """ Log request/response context before and after processing. """

        request.request_id = request.headers.get('X-Request-ID', f'local-{secrets.token_hex(16)}')

        # Add request to context.
        # Make the current request available in a ContextVar.
        # This ContextVar is used by `RequestContextFilter` to attach request information to all log messages.
        request_token = request_contextvar.set(request)

        try:
            # Request passes on to controller.
            LOG.info('Processing HTTP request')
            response: HttpResponse = self.get_response(request)
            LOG.info('Processing HTTP request complete', extra={'status_code': response.status_code})
        finally:
            # Cleanup context.
            request_contextvar.reset(request_token)

        return response

    def process_exception(self, request: HttpRequest, exception: Exception) -> None:
        """Log unhandled exceptions."""

        LOG.error('Unhandled exception while processing request', exc_info=exception)


class ImpersonateUserMiddleware:

    def __init__(self, get_response: HttpResponse) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:

        ### Handle impersonation before response ###
        impersonate = request.get_signed_cookie(COOKIE_IMPERSONATED_USER_ID, default=None)
        if impersonate is not None:
            impersonated_user = User.objects.get(id=int(impersonate))
            request.user = impersonated_user
            request._force_auth_user = impersonated_user
            request._force_auth_token = get_token(request)
            LOG.info(f"EYOO DUDE YOUR'E NOT YOURSELF '{impersonated_user.username}'")
        ### End: Handle impersonation after response ###

        # Handle response.
        response: HttpResponse = self.get_response(request)

        ### Handle impersonation after response ###
        if hasattr(response, REQUESTED_IMPERSONATE_USER):
            impersonate_user_id = getattr(response, REQUESTED_IMPERSONATE_USER)
            if impersonate_user_id is not None:
                response.set_signed_cookie(COOKIE_IMPERSONATED_USER_ID, impersonate_user_id)
                LOG.info(f'Now impersonating {impersonate_user_id}')
            else:
                response.delete_cookie(COOKIE_IMPERSONATED_USER_ID)
        ### End: Handle impersonation after response ###

        return response


class ImpersonateUserMiddleware2:
    """wip Emil"""

    def __init__(self, get_response: HttpResponse) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        user: User = request.user
        impersonated_user_id = request.get_signed_cookie(
            key=COOKIE_IMPERSONATED_USER_ID,
            default=None,
        )

        # TODO: if request.user.has_perm(perm=PERM.SAMFUNDET_IMPERSONATE) and impersonate_user:
        # if user.is_superuser and impersonated_user_id:
        if impersonated_user_id:
            # Find user to impersonate.
            impersonated_user = User.objects.get(id=int(impersonated_user_id))
            # Keep actual user before it gets replaced.
            impersonated_by = request.user

            # Login (replaces request.user).
            login(
                request=request,
                user=impersonated_user,
                backend='django.contrib.auth.middleware.AuthenticationMiddleware',
            )
            # Set attr on current user to show impersonation.
            impersonated_user._impersonated_by = impersonated_by
            request.impersonated_by = impersonated_by
            request.user = impersonated_user

        # Handle response.
        response = self.get_response(request)

        ### Handle impersonation after response ###
        if hasattr(response, REQUESTED_IMPERSONATE_USER):
            requested_impersonate_user_id = getattr(response, REQUESTED_IMPERSONATE_USER)

            if requested_impersonate_user_id is not None:
                response.set_signed_cookie(COOKIE_IMPERSONATED_USER_ID, requested_impersonate_user_id)
                LOG.info(f'Now impersonating {requested_impersonate_user_id}')
            else:
                response.delete_cookie(COOKIE_IMPERSONATED_USER_ID)
        ### End: Handle impersonation after response ###

        return response
