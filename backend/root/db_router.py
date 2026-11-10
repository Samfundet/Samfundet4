"""
Handles routing for databases (which database should be used for which model).
All models use the default database except billig, mdb and samf3 models.
"""

from __future__ import annotations

from typing import Any

from django.db import models

from samfundet.models.mdb import MedlemsInfo
from samfundet.models.billig import (
    BilligEvent,
    BilligTicket,
    BilligPurchase,
    BilligPriceGroup,
    BilligTicketCard,
    BilligTicketGroup,
    BilligPaymentError,
)
from samfundet.samf3_import.models import Samf3EverythingClosedPeriod

# List of models routed to billig database.
BILLIG_MODELS: list[type[models.Model]] = [
    BilligEvent,
    BilligTicketGroup,
    BilligPriceGroup,
    BilligPaymentError,
    BilligTicketCard,
    BilligPurchase,
    BilligTicket,
]

# List of models routed to mdb database.
MDB_MODELS: list[type[models.Model]] = [
    MedlemsInfo,
]

# List of models routed to the samf3 database, read by the import_samf3 command.
SAMF3_MODELS: list[type[models.Model]] = [
    Samf3EverythingClosedPeriod,
]

DISALLOWED_MODELS = {m._meta.model_name for m in BILLIG_MODELS + MDB_MODELS + SAMF3_MODELS}


class SamfundetDatabaseRouter:
    def db_for_read(self, model: type[models.Model], **hints: dict[str, Any]) -> str | None:
        if model in BILLIG_MODELS:
            return 'billig'
        if model in MDB_MODELS:
            return 'mdb'
        if model in SAMF3_MODELS:
            return 'samf3'
        return None

    def db_for_write(self, model: type[models.Model], **hints: dict[str, Any]) -> str | None:
        if model in BILLIG_MODELS:
            return 'billig'
        if model in MDB_MODELS:
            return 'mdb'
        # Writes are only for local development and tests.
        # In production the samf3 connection is read-only (see prod.py).
        if model in SAMF3_MODELS:
            return 'samf3'
        return None

    def allow_migrate(
        self,
        db: str,
        app_label: str,
        model_name: str | None = None,
        **hints: dict[str, Any],
    ) -> bool:
        return model_name not in DISALLOWED_MODELS
