"""Helpers for the local `samf3` database. Never used against production."""

from __future__ import annotations

from pathlib import Path

from django.db import connections

SCHEMA_PATH = Path(__file__).parent / 'schema.sql'
SAMPLE_DATA_PATH = Path(__file__).parent / 'dev_sample_data.sql'


def create_schema() -> None:
    """Create the Samf3 tables the import reads, if they don't exist."""
    with connections['samf3'].cursor() as cursor:
        cursor.execute(SCHEMA_PATH.read_text())


def create_sample_data() -> None:
    """Add a few sample Samf3 rows, if they don't exist. The image files are in dev_upload/."""
    with connections['samf3'].cursor() as cursor:
        cursor.execute(SAMPLE_DATA_PATH.read_text())
