import logging
import secrets
from contextvars import ContextVar
from tokenize import Token

from django.http import HttpRequest, HttpResponse



LOG = logging.getLogger(__name__)

# This token can be imported anywhere to retrieve the values.
request_contextvar: ContextVar[HttpRequest] = ContextVar('request_contextvar', default=None)


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

    def __init__(self, get_response) -> None:  # type: ignore # noqa: ANN001 # Uknown type # type: ignore
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:

        try:
            impersonate = request.get_signed_cookie('impersonated_user_id', default=None)
            if impersonate is not None:
                from samfundet.models import User
                from django.middleware.csrf import get_token
                request.user = User.objects.get(id=int(impersonate))
                request._force_auth_user = request.user
                request._force_auth_token = get_token(request.user)
                print(f"EYOO DUDE YOURE NOT YOURSELF '{request.user.username}'")
        except:
            pass

        response = self.get_response(request)

        if hasattr(response, 'requested_impersonate_user'):
            impersonate_user_id = response.requested_impersonate_user
            if impersonate_user_id is not None:
                response.set_signed_cookie('impersonated_user_id', impersonate_user_id)
                print(f"Now impersonating {impersonate_user_id}")
            else:
                response.delete_cookie('impersonated_user_id')

        return response
