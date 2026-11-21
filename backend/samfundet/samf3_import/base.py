"""
Shared code for the Samf3 importers. Each importer subclasses `Samf3Importer`, and
the `import_samf3` management command runs them.
"""

from __future__ import annotations

import datetime
from abc import ABC, abstractmethod
from typing import Any, ClassVar
from dataclasses import field, dataclass
from collections.abc import Iterable

from django.db import transaction
from django.utils import timezone
from django.db.models import F
from django.core.exceptions import ValidationError

from samfundet.samf3_import.models import Samf3ImportedModel


class SkipRow(Exception):  # noqa: N818
    """Raised by `Samf3Importer.build` when a Samf3 row can't be imported. The message is the reason."""


@dataclass
class SkippedRow:
    samf3_id: int
    reason: str


@dataclass
class ImportReport:
    importer: str
    created: int = 0
    updated: int = 0
    unchanged: int = 0
    skipped: list[SkippedRow] = field(default_factory=list)

    def summary(self) -> str:
        return f'{self.importer}: {self.created} created, {self.updated} updated, {self.unchanged} unchanged, {len(self.skipped)} skipped'


class Samf3Importer(ABC):
    """
    Imports one Samf3 table into one Samf4 model.

    Safe to run again: rows are matched on `samf3_id`, so a second run updates instead of
    duplicating. Rows edited in Samf4 since the last import are skipped, and rows made in
    Samf4 (no `samf3_id`) are never read or written.

    Subclasses set `name` and `model`, and implement `source_rows` and `build`.
    """

    # Used by `import_samf3 --only`.
    name: ClassVar[str]
    # The Samf4 model to import into.
    model: ClassVar[type[Samf3ImportedModel]]

    def __init_subclass__(cls, **kwargs: Any) -> None:
        # mypy checks the type of `model`, this also catches it at import time without mypy.
        super().__init_subclass__(**kwargs)
        model = getattr(cls, 'model', None)
        if model is None or not issubclass(model, Samf3ImportedModel):
            raise TypeError(f'{cls.__name__}.model must be a subclass of Samf3ImportedModel, got {model!r}')

    @abstractmethod
    def source_rows(self) -> Iterable[Any]:
        """The Samf3 rows to import."""

    @abstractmethod
    def build(self, row: Any) -> dict[str, Any]:
        """Map a Samf3 row to field values for `model`. Raise `SkipRow` if it can't be imported."""

    def source_id(self, row: Any) -> int:
        return row.pk

    def delete_imported(self) -> int:
        """
        Delete every row this importer has imported. Development only. Rows made in Samf4
        (no `samf3_id`) are kept. Returns the number of rows deleted, cascades included.
        """
        deleted, _ = self.model.objects.filter(samf3_id__isnull=False).delete()
        return deleted

    def run(self) -> ImportReport:
        report = ImportReport(importer=self.name)
        existing = {obj.samf3_id: obj for obj in self.model.objects.filter(samf3_id__isnull=False)}

        for row in self.source_rows():
            samf3_id = self.source_id(row)
            try:
                # Savepoint per row, so one bad row doesn't abort the rest.
                with transaction.atomic():
                    self._import_row(row=row, samf3_id=samf3_id, obj=existing.get(samf3_id), report=report)
            except SkipRow as skip:
                report.skipped.append(SkippedRow(samf3_id=samf3_id, reason=str(skip)))
            except ValidationError as error:
                report.skipped.append(SkippedRow(samf3_id=samf3_id, reason=f'Not valid in Samf4: {error.message_dict}'))

        return report

    def _import_row(self, *, row: Any, samf3_id: int, obj: Samf3ImportedModel | None, report: ImportReport) -> None:
        if obj is not None and edited_since_import(obj):
            raise SkipRow('Edited in Samf4 since the last import')

        values = self.build(row)

        if obj is None:
            obj = self.model(samf3_id=samf3_id, **values)
            obj.save()
            report.created += 1
        else:
            changed = {name: value for name, value in values.items() if getattr(obj, name) != value}
            if not changed:
                report.unchanged += 1
                return
            for name, value in changed.items():
                setattr(obj, name, value)
            obj.save()
            report.updated += 1

        # save() sets updated_at to now(), so copy it instead of using a new now(). An update()
        # doesn't call save(), so it doesn't bump updated_at again.
        self.model.objects.filter(pk=obj.pk).update(imported_at=F('updated_at'))


def edited_since_import(obj: Samf3ImportedModel) -> bool:
    return obj.imported_at is not None and obj.updated_at is not None and obj.updated_at > obj.imported_at


# ======================== #
#      Value helpers       #
# ======================== #


def samf3_datetime(value: datetime.datetime) -> datetime.datetime:
    """
    Samf3 stores times as `timestamp without time zone` in UTC (the Rails default),
    so Django reads them as naive datetimes. Make them aware.
    """
    if timezone.is_naive(value):
        return timezone.make_aware(value, datetime.UTC)
    return value


def samf3_local_date(value: datetime.datetime) -> datetime.date:
    """The date in Norway (settings.TIME_ZONE) of a Samf3 time."""
    return timezone.localtime(samf3_datetime(value)).date()
