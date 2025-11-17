import re
from dataclasses import dataclass, field
from typing import Optional, List
from django.utils.html import escape


@dataclass
class MetadataItem:
    attr: str
    key: str
    value: str


@dataclass
class Metadata:
    title: Optional[str] = None
    description: Optional[str] = None
    canonical_url: Optional[str] = None
    items: List[MetadataItem] = field(default_factory=list)


def build_metadata_html(metadata: Metadata) -> str:
    tags = []

    if metadata.title:
        metadata.items.append(MetadataItem("property", "og:title", metadata.title))
        metadata.items.append(MetadataItem("name", "twitter:title", metadata.title))

    if metadata.description:
        tags.append(f'<meta name="description" content="{escape(metadata.description)}">')
        metadata.items.append(MetadataItem("property", "og:description", metadata.description))

    if metadata.canonical_url:
        tags.append(f'<link rel="canonical" href="{escape(metadata.canonical_url)}">')

    for item in metadata.items:
        tags.append(f'<meta {item.attr}="{escape(item.key)}" content="{escape(item.value)}">')

    return "\n".join(tags)


def inject_metadata(html: str, metadata: Metadata) -> str:
    if metadata.title:
        title = escape(metadata.title)
        if re.search(r"<title>.*?</title>", html, flags=re.IGNORECASE | re.DOTALL):
            html = re.sub(
                r"<title>.*?</title>",
                f"<title>{title}</title>",
                html,
                flags=re.IGNORECASE | re.DOTALL
            )
        else:
            html = html.replace("</head>", f"<title>{title}</title></head>")

    meta_html = build_metadata_html(metadata)

    html = html.replace("</head>", f"{meta_html}\n</head>")

    return html
