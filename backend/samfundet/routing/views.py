from __future__ import annotations

import os
from typing import Any

from django.conf import settings
from django.http import HttpRequest, HttpResponse

from samfundet.models import Event, InformationPage
from samfundet.view.event_views import event_metadata
from samfundet.infopages.metadata import information_page_metadata, information_page_list_metadata

from .metadata import inject_metadata


def get_frontend_html() -> str:
    path = os.path.join(settings.REACT_BUILD_DIR, 'index.html')
    with open(path) as f:
        return f.read()


def react_view(request: HttpRequest, **kwargs: Any) -> HttpResponse:
    """
    Serve the built React index.html
    All route parameters from URL are captured in kwargs but not used
    (React Router will handle routing on the client side)
    """
    try:
        return HttpResponse(get_frontend_html())
    except FileNotFoundError:
        return HttpResponse('React build not found.', status=500)


def react_404_view(request: HttpRequest, exception: Exception | None = None, **kwargs: Any) -> HttpResponse:
    """
    Serve the React frontend with HTTP 404. Used as both the URL catch-all for
    unknown paths and as Django's handler404.
    """
    try:
        return HttpResponse(get_frontend_html(), status=404)
    except FileNotFoundError:
        return HttpResponse('React build not found.', status=500)


def is_bot(request: HttpRequest) -> bool:
    bot_patterns = [
        'googlebot',
        'bingbot',
        'slurp',
        'duckduckbot',
        'baiduspider',
        'yandexbot',
        'facebookexternalhit',
        'twitterbot',
        'linkedinbot',
        'whatsapp',
        'telegrambot',
        'claudebot',
        'perplexitybot',
        'chatgpt',
        'pinterestbot',
        'curl',
    ]
    user_agent = request.META['HTTP_USER_AGENT'].lower()
    return any(pattern in user_agent for pattern in bot_patterns)


def react_event_view(request: HttpRequest, **kwargs: Any) -> HttpResponse:
    try:
        event = Event.objects.get(id=kwargs['id'])
    except Event.DoesNotExist:
        # Let React handle displaying that the event wasn't found
        return HttpResponse(get_frontend_html(), status=404)

    return HttpResponse(inject_metadata(get_frontend_html(), event_metadata(event)))


def react_infopage_view(request: HttpRequest, **kwargs: Any) -> HttpResponse:
    try:
        page = InformationPage.objects.visible().select_related('current_revision').get(slug_field=kwargs['slugField'])
    except InformationPage.DoesNotExist:
        # Unknown and hidden pages alike: show the React not-found page with HTTP 404
        return HttpResponse(get_frontend_html(), status=404)

    return HttpResponse(inject_metadata(get_frontend_html(), information_page_metadata(page)))


def react_infopage_list_view(request: HttpRequest, **kwargs: Any) -> HttpResponse:
    return HttpResponse(inject_metadata(get_frontend_html(), information_page_list_metadata()))
