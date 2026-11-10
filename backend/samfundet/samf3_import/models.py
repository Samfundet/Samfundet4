"""
Models for importing Samf3 data into Samf4 (WEB-245).

Two kinds of models live here:

* `Samf3ImportedMixin`, which Samf4 models mix in to remember which Samf3 row they came from.
* Unmanaged mirrors of the Samf3 tables we read (`managed = False`), like billig.py and mdb.py.
  They are routed to the read-only `samf3` database in root/db_router.py. They only declare the
  columns the import needs, so the real tables may have more.

Samf3 is a Rails app, so its tables are named in plural snake case and have no prefix.
"""

from __future__ import annotations

from django.db import models

from root.utils.mixins import CustomBaseModel


class Samf3ImportedMixin(models.Model):
    """
    Remembers which Samf3 row a Samf4 row was imported from, and when.

    Content made in Samf4 has no `samf3_id`, so the import never touches it.
    If `updated_at` is later than `imported_at`, the row was edited in Samf4 after the
    last import, and the import skips it instead of overwriting the edit.
    """

    samf3_id = models.PositiveBigIntegerField(
        unique=True,
        null=True,
        blank=True,
        editable=False,
        verbose_name='Samf3 ID',
        help_text='ID of the Samf3 row this was imported from. Empty for content made in Samf4.',
    )
    imported_at = models.DateTimeField(
        null=True,
        blank=True,
        editable=False,
        verbose_name='Importert fra Samf3',
    )

    class Meta:
        abstract = True


class Samf3ImportedModel(Samf3ImportedMixin, CustomBaseModel):
    """Base for Samf4 models the import writes to. `Samf3Importer.model` must be one of these."""

    class Meta:
        abstract = True


# ======================== #
#      Samf3 mirrors       #
# ======================== #


class Samf3EverythingClosedPeriod(models.Model):
    """Samf3's `EverythingClosedPeriod`: a period where all of Samfundet is closed."""

    id = models.BigIntegerField(primary_key=True)
    message_no = models.TextField(null=True)
    message_en = models.TextField(null=True)
    # Shown on events in the period. Samf4 has no field for these, so they are not imported.
    event_message_no = models.TextField(null=True)
    event_message_en = models.TextField(null=True)
    # `timestamp without time zone`. Rails stores these in UTC.
    closed_from = models.DateTimeField(null=True)
    closed_to = models.DateTimeField(null=True)

    class Meta:
        managed = False
        db_table = 'everything_closed_periods'

    def __str__(self) -> str:
        return f'{self.message_no} {self.closed_from}-{self.closed_to}'
