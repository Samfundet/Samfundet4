from __future__ import annotations

from typing import Any
from collections.abc import Iterable

from samfundet.models.general import ClosedPeriod
from samfundet.samf3_import.base import SkipRow, Samf3Importer, samf3_local_date
from samfundet.samf3_import.models import Samf3EverythingClosedPeriod

# ClosedPeriod's messages are TextFields, which Django doesn't validate the length of,
# so check it here instead of saving text the frontend can't show.
MESSAGE_MAX_LENGTH = ClosedPeriod._meta.get_field('message_nb').max_length


class ClosedPeriodImporter(Samf3Importer):
    """
    Samf3 `everything_closed_periods` -> Samf4 `ClosedPeriod`.

    Samf3 stores times, Samf4 stores dates, so the times are converted to the date in Norway.
    Samf3's `event_message_*` (shown on events in the period) has no field in Samf4 and is dropped.
    """

    name = 'closed_periods'
    model = ClosedPeriod

    def source_rows(self) -> Iterable[Samf3EverythingClosedPeriod]:
        return Samf3EverythingClosedPeriod.objects.order_by('id')

    def build(self, row: Samf3EverythingClosedPeriod) -> dict[str, Any]:
        if row.closed_from is None or row.closed_to is None:
            raise SkipRow('Missing closed_from or closed_to')

        for field_name in ('message_no', 'message_en'):
            message = getattr(row, field_name)
            if message and len(message) > MESSAGE_MAX_LENGTH:
                raise SkipRow(f'{field_name} is {len(message)} characters, Samf4 allows {MESSAGE_MAX_LENGTH}')

        return {
            'message_nb': row.message_no,
            'message_en': row.message_en,
            'start_dt': samf3_local_date(row.closed_from),
            'end_dt': samf3_local_date(row.closed_to),
        }
