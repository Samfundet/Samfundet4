from __future__ import annotations

import re
from dataclasses import field, dataclass

from django.conf import settings
from django.utils.html import escape


@dataclass
class MetadataItem:
    attr: str
    key: str
    value: str


@dataclass
class Metadata:
    title: str | None = None
    description: str | None = None
    canonical_url: str | None = None
    items: list[MetadataItem] = field(default_factory=list)


def canonical_url(path: str) -> str:
    """Absolute canonical URL for a frontend path, e.g. '/information/foo/'."""
    return f'{settings.SITE_URL.rstrip("/")}{path}'


def build_metadata_html(metadata: Metadata) -> str:
    tags = []

    if metadata.description:
        tags.append(f'<meta name="description" content="{escape(metadata.description)}">')

    if metadata.canonical_url:
        tags.append(f'<link rel="canonical" href="{escape(metadata.canonical_url)}">')

    # Tags derived from title/description are combined with the caller-supplied items in a local
    # list rather than appended onto metadata.items, so this function has no side effects.
    items: list[MetadataItem] = []
    if metadata.title:
        items.append(MetadataItem('property', 'og:title', metadata.title))
        items.append(MetadataItem('name', 'twitter:title', metadata.title))
    if metadata.description:
        items.append(MetadataItem('property', 'og:description', metadata.description))
    items.extend(metadata.items)

    tags.extend(f'<meta {item.attr}="{escape(item.key)}" content="{escape(item.value)}">' for item in items)

    return '\n'.join(tags)


def inject_metadata(html: str, metadata: Metadata) -> str:
    if metadata.title:
        title = escape(metadata.title)
        if re.search(r'<title>.*?</title>', html, flags=re.IGNORECASE | re.DOTALL):
            html = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', html, flags=re.IGNORECASE | re.DOTALL)
        else:
            html = html.replace('</head>', f'<title>{title}</title></head>')

    meta_html = build_metadata_html(metadata)

    html = html.replace('</head>', f'{meta_html}\n</head>')

    return html
