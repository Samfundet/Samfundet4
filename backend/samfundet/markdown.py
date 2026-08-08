from __future__ import annotations

import re

from samfundet.models.general import Image

# Images are authored as a leaf directive holding the image's id, so the reference survives
# the image file being replaced. Public reads rewrite them to plain Markdown images.
#
#   ::image{id=42}
#   ::image{#43 alt="Edgar"}
#
DIRECTIVE = re.compile(
    # The trailing blank lines are captured so a dropped directive doesn't leave a hole behind
    r'^[ \t]{0,3}::image(?:\[[^\]\n]*\])?\{(?P<attributes>[^}\n]*)\}[ \t]*(?P<trailing>\n?(?:[ \t]*\n)*)',
    re.MULTILINE,
)

ATTRIBUTE = re.compile(r'(?P<key>[a-zA-Z_][\w-]*)[ \t]*=[ \t]*(?:"(?P<double>[^"]*)"|\'(?P<single>[^\']*)\'|(?P<bare>[^\s"\'{}]+))')

ID_SHORTHAND = re.compile(r'#(?P<id>[\w-]+)')

IMAGE_VARIANT = 'large'


def render_image_directives(*texts: str | None) -> list[str | None]:
    """
    Takes several texts at once so a page's translations cost a single query. Directives pointing
    at an image which no longer exists are dropped.
    """
    ids = _collect_ids(texts)
    images = Image.objects.filter(id__in=ids).in_bulk() if ids else {}
    return [_substitute(text, images) for text in texts]


def _collect_ids(texts: tuple[str | None, ...]) -> set[int]:
    ids: set[int] = set()
    for text in texts:
        if not text:
            continue
        for match in DIRECTIVE.finditer(text):
            image_id = _image_id(match)
            if image_id is not None:
                ids.add(image_id)
    return ids


def _substitute(text: str | None, images: dict[int, Image]) -> str | None:
    if not text:
        return text

    def replace(match: re.Match[str]) -> str:
        image_id = _image_id(match)
        image = images.get(image_id) if image_id is not None else None
        if image is None:
            # Drop the directive, so readers never see a broken image or an internal id
            return ''
        alt = _attributes(match).get('alt') or image.title
        return f'![{_escape_alt(alt)}]({image.urls[IMAGE_VARIANT]}){match.group("trailing")}'

    return DIRECTIVE.sub(replace, text)


def _attributes(match: re.Match[str]) -> dict[str, str]:
    attributes: dict[str, str] = {}
    source = match.group('attributes')

    for attribute in ATTRIBUTE.finditer(source):
        value = attribute.group('double') or attribute.group('single') or attribute.group('bare') or ''
        attributes[attribute.group('key')] = value
        # Blanked out so a `#` inside a quoted value isn't mistaken for the id shorthand below
        source = source[: attribute.start()] + ' ' * (attribute.end() - attribute.start()) + source[attribute.end() :]

    shorthand = ID_SHORTHAND.search(source)
    if shorthand:
        attributes.setdefault('id', shorthand.group('id'))

    return attributes


def _image_id(match: re.Match[str]) -> int | None:
    raw = _attributes(match).get('id')
    if raw is None or not raw.isdigit():
        return None
    return int(raw)


def _escape_alt(alt: str) -> str:
    return alt.replace('\\', '\\\\').replace('[', '\\[').replace(']', '\\]')
