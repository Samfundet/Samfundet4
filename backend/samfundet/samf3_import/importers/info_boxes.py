from __future__ import annotations

from typing import Any
from collections.abc import Iterable

from django.utils import timezone

from samfundet.models.general import Infobox
from samfundet.samf3_import.base import SkipRow, Samf3Importer
from samfundet.samf3_import.images import import_samf3_image
from samfundet.samf3_import.models import Samf3InfoBox

TITLE_MAX_LENGTH = Infobox._meta.get_field('title_nb').max_length
TEXT_MAX_LENGTH = Infobox._meta.get_field('text_nb').max_length

# Samf3's color names -> Samf4's info box colors, the hex values the admin form offers
# (INFOBOX_COLOR_KEYS in InfoboxFormAdminPage.tsx, values from COLORS in types.ts).
COLORS = {
    'red': '#a03033',  # red_samf, the same red as Samf3's
    'blue': '#337ab7',  # blue, the same blue as Samf3's
    'green': '#4ab74c',  # green
    # Samf4 always shows white text, so white and black have no matching color.
    'white': '#a03033',  # red_samf
    'black': '#337ab7',  # blue
}

# Samf3's links can be paths on Samf3, like `/arrangement/123`.
SAMF3_SITE = 'https://www.samfundet.no'


class InfoBoxImporter(Samf3Importer):
    """
    Samf3 `info_boxes` -> Samf4 `Infobox`.

    Only the boxes still showing are imported, since Samf4 shows every info box and has no
    end time. Samf3's start time, end time and position have no field in Samf4 and are
    dropped, but the boxes are imported in Samf3's order. Samf3 has a link per language,
    Samf4 one: `link_no`, or `link_en` when it is empty.
    """

    name = 'info_boxes'
    model = Infobox

    def source_rows(self) -> Iterable[Samf3InfoBox]:
        # Samf3 stores UTC in a naive column, and Django compares in UTC, so this works.
        return Samf3InfoBox.objects.filter(end_time__gt=timezone.now()).order_by('position', 'id')

    def build(self, row: Samf3InfoBox) -> dict[str, Any]:
        for field_name, max_length in (
            ('title_no', TITLE_MAX_LENGTH),
            ('title_en', TITLE_MAX_LENGTH),
            ('body_no', TEXT_MAX_LENGTH),
            ('body_en', TEXT_MAX_LENGTH),
        ):
            value = getattr(row, field_name) or ''
            if len(value) > max_length:
                raise SkipRow(f'{field_name} is {len(value)} characters, Samf4 allows {max_length}')

        color = COLORS.get(row.color or '')
        if color is None:
            raise SkipRow(f'Unknown color {row.color!r}')

        return {
            'title_nb': row.title_no,
            'title_en': row.title_en,
            'text_nb': row.body_no,
            'text_en': row.body_en,
            'color': color,
            'url': samf3_link(row.link_no) or samf3_link(row.link_en),
            # Raises MissingImage, a SkipRow, when the image can't be imported.
            'image': import_samf3_image(row.image_id) if row.image_state and row.image_id else None,
        }


def samf3_link(link: str | None) -> str | None:
    """A Samf3 link as an absolute URL, like the Samf4 admin form makes them. None if empty."""
    link = (link or '').strip()
    if not link:
        return None
    if link.startswith(('http://', 'https://')):
        return link
    if link.startswith('/'):
        return f'{SAMF3_SITE}{link}'
    return f'https://{link}'
