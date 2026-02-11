"""
Handles routing for databases (which database should be used for which model).
All models use the default database except billig and mdb models.
"""

from __future__ import annotations

from typing import Any

from django.db import models

from samfundet.models.billig import (
    BilligEvent,
    BilligPriceGroup,
    BilligTicketGroup,
)
from samfundet.models.mdb import MedlemsInfo

# List of models routed to billig database.
BILLIG_MODELS: list[type[models.Model]] = [
    BilligEvent,
    BilligTicketGroup,
    BilligPriceGroup,
]

# List of models routed to mdb database.
MDB_MODELS: list[type[models.Model]] = [
    MedlemsInfo,
]


class SamfundetDatabaseRouter:
    def db_for_read(self, model: type[models.Model], **hints: dict[str, Any]) -> str | None:
        if model in BILLIG_MODELS:
            return 'billig'
        if model in MDB_MODELS:
            return 'mdb'
        return None

    def db_for_write(self, model: type[models.Model], **hints: dict[str, Any]) -> str | None:
        if model in BILLIG_MODELS:
            return 'billig'
        if model in MDB_MODELS:
            return 'mdb'
        return None

    def allow_migrate(
        self,
        db: str,
        app_label: str,
        model_name: str | None = None,
        **hints: dict[str, Any],
    ) -> bool:
        return (model_name not in [m._meta.model_name for m in BILLIG_MODELS] and
               model_name not in [m._meta.model_name for m in MDB_MODELS])
