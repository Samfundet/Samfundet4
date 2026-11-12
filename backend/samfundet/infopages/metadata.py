from __future__ import annotations

from samfundet.markdown import plain_text
from samfundet.routing.metadata import Metadata, canonical_url

from .models import InformationPage

# Suffix appended to page titles, matching the wording used across the frontend.
SITE_NAME = 'Samfundet'


def information_page_metadata(page: InformationPage) -> Metadata:
    """
    View-facing metadata for a single information page, built from its current revision.

    Pure: no HTTP and no lookup. The caller resolves the slug and decides the response status.
    """
    revision = page.current_revision
    title = f'{revision.title_nb} - {SITE_NAME}' if revision and revision.title_nb else f'{page.slug_field} - {SITE_NAME}'
    description = plain_text(revision.text_nb) if revision else ''

    return Metadata(
        title=title,
        description=description or None,
        canonical_url=canonical_url(f'/information/{page.slug_field}/'),
    )


def information_page_list_metadata() -> Metadata:
    """The information page index has no object to read metadata from, so it gets a static title."""
    return Metadata(title=f'Informasjon - {SITE_NAME}', canonical_url=canonical_url('/information/'))
