#
# Creates and seeds the mdb database.
#
# This seed script is a bit different because the local mdb
# is not managed by django, but uses a different postgres
# database simulating the real mdb in prod (cirkus).
#
#
from __future__ import annotations

import os
from collections.abc import Iterable

import django
from django import db
from django.db import transaction

from samfundet.models.mdb import MedlemsInfo

# Get django database name from config (see database setup in dev.py)
DB_NAME = db.connections.databases['mdb']['NAME']
SEED_DIRECTORY = os.path.join(os.path.dirname(__file__), 'seed_mdb')

# ======================== #
#     Create Database      #
# ======================== #


def get_schema() -> str:
    # Generate schema (pass schema.sql to postgres)
    seed_schema = os.path.join(SEED_DIRECTORY, 'schema.sql')
    with open(seed_schema) as f:
        schema = f.read()
    return schema


def create_db() -> tuple[bool, str]:
    """Creates a new postgres database with schema using shell scripts"""

    schema = get_schema()
    schema_queries = schema.split(';')
    with django.db.connections['mdb'].cursor() as cursor, transaction.atomic():
        for query in schema_queries:
            cursor.execute(query)

    return True, 'Created database and schema'


# ======================== #
#         Seeding          #
# ======================== #

MEMBERS = [
    MedlemsInfo(
        medlem_id=10123,
        fornavn='Robin',
        etternavn='Espinosa Jelle',
        fodselsdato='1970-01-01',
        telefon='12345678',
        mail='robin@example.com',
        skole='NTNU',
        studie='',
        brukernavn='robinej',
    ),
    MedlemsInfo(
        medlem_id=20569,
        fornavn='Sanctus',
        etternavn='Richardus',
        fodselsdato='1970-01-01',
        telefon='87654321',
        mail='sanctus.richardus@example.com',
        skole='NTNU',
        studie='',
        brukernavn='sanctusr',
    ),
]


def seed_tables() -> Iterable[tuple[int, str]]:
    # Create a few fake members
    with transaction.atomic():
        for m in MEMBERS:
            m.save()

    yield 100, f'Created {len(MEMBERS)} fake mdb members'


# Main seed script entry point
def seed() -> Iterable[tuple[int, str]]:
    # Create database and schema
    yield 0, 'Creating mdb database...'
    ok, message = create_db()
    if not ok:
        # Failed to create DB
        yield 100, message
        return

    # Seed mdb database
    for percent, message in seed_tables():
        yield percent, message
