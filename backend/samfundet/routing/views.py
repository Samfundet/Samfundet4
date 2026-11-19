from __future__ import annotations

import os
from typing import Any

from django.conf import settings
from django.http import HttpRequest, HttpResponse

from samfundet.models import Event, InformationPage
from samfundet.markdown import plain_text

from .metadata import Metadata, MetadataItem, inject_metadata


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

    title = f'{event.title_nb} - Samfundet'
    description = event.description_short_nb

    metadata = Metadata(title=title, description=description)
    metadata.items.append(MetadataItem('name', 'og:custom', 'Lorem ipsum'))  # TODO:

    html = get_frontend_html()
    return HttpResponse(inject_metadata(html, metadata))


def _canonical_url(path: str) -> str:
    """Absolute canonical URL for a frontend path, e.g. '/information/foo/'."""
    return f'{settings.SITE_URL.rstrip("/")}{path}'


def react_infopage_view(request: HttpRequest, **kwargs: Any) -> HttpResponse:
    try:
        page = InformationPage.objects.visible().select_related('current_revision').get(slug_field=kwargs['slugField'])
    except InformationPage.DoesNotExist:
        # Unknown and hidden pages alike: show the React not-found page with HTTP 404
        return HttpResponse(get_frontend_html(), status=404)

    revision = page.current_revision
    title = f'{revision.title_nb} - Samfundet' if revision and revision.title_nb else f'{page.slug_field} - Samfundet'
    description = plain_text(revision.text_nb) if revision else ''

    metadata = Metadata(title=title, description=description or None, canonical_url=_canonical_url(f'/information/{page.slug_field}/'))

    return HttpResponse(inject_metadata(get_frontend_html(), metadata))


def react_infopage_list_view(request: HttpRequest, **kwargs: Any) -> HttpResponse:
    """The information page index has no object to read metadata from, so it gets a static title."""
    metadata = Metadata(title='Informasjon - Samfundet', canonical_url=_canonical_url('/information/'))

    return HttpResponse(inject_metadata(get_frontend_html(), metadata))
