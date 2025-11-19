import os

from django.conf import settings
from django.http import HttpResponse
from rest_framework.generics import get_object_or_404

from samfundet.models import Event
from .metadata import Metadata, MetadataItem, inject_metadata


def get_frontend_html() -> str:
    path = os.path.join(settings.REACT_BUILD_DIR, 'index.html')
    with open(path, 'r') as f:
        return f.read()


def react_view(request, **kwargs):
    """
    Serve the built React index.html
    All route parameters from URL are captured in kwargs but not used
    (React Router will handle routing on the client side)
    """
    try:
        return HttpResponse(get_frontend_html())
    except FileNotFoundError:
        return HttpResponse("React build not found.", status=500)


def is_bot(request):
    return True
    bot_patterns = [
        'googlebot', 'bingbot', 'slurp', 'duckduckbot',
        'baiduspider', 'yandexbot', 'facebookexternalhit',
        'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot',
        'claudebot', 'perplexitybot', 'chatgpt', 'pinterestbot',
    ]
    user_agent = request.META['HTTP_USER_AGENT'].lower()
    return any(pattern in user_agent for pattern in bot_patterns)


def react_event_view(request, **kwargs):
    if is_bot(request):
        event = get_object_or_404(Event, id=kwargs["id"])

        title = f"{event.title_nb} - Samfundet"
        description = event.description_short_nb

        metadata = Metadata(title=title, description=description)
        metadata.items.append(MetadataItem("name", "og:custom", "Lorem ipsum"))

        html = get_frontend_html()
        return HttpResponse(inject_metadata(html, metadata))

    return react_view(request, **kwargs)
