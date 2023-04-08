#
# Creates and seeds the billig database.
#
# This seed script is a bit different because billig_dev
# is not managed by django, but uses a different sqlite3
# database simulating the real billig in prod (cirkus).
#
# The seed script generates the database and schema
# in sqlite3 by running terminal commands, and seeds
# the database with raw SQL queries.
#

import os
import random
import subprocess
from typing import Tuple, Iterable, List

from django.utils import timezone
from django import db

from samfundet.models.event import Event, EventTicketType

from .seed_billig import util

# Number of billig events to create
# in addition to those connected to django events
# with ticket type billig
COUNT = 20

# Get django database name from config (see dev.py)
DB_NAME = db.connections.databases['billig']['NAME']
SEED_DIRECTORY = os.path.join(os.path.dirname(__file__), 'seed_billig')

# ======================== #
#        Database          #
# ======================== #


def create_db() -> Tuple[bool, str]:
    """
    Creates a new sqlite3 database with schema using shell scripts
    """
    # Verify that sqlite3 is installed
    has_sqlite3 = subprocess.run('which sqlite3', stdout=subprocess.DEVNULL, shell=True)
    if has_sqlite3.returncode != 0:
        return False, 'Failed to seed billig - is sqlite3 installed?'

    # Create database file (just touch file)
    create_db = subprocess.run(f'touch {DB_NAME}', stdout=subprocess.DEVNULL, shell=True)
    if create_db.returncode != 0:
        return False, "Failed to seed billig, couldn't create db file"

    # Generate schema (pass schema.sql to sqlite3)
    seed_schema = os.path.join(SEED_DIRECTORY, 'schema.sql')
    create_schema = subprocess.run(f'cat "{seed_schema}" | sqlite3 "{DB_NAME}"', stdout=subprocess.DEVNULL, shell=True)
    if create_schema.returncode != 0:
        return False, "Failed to seed billig, couldn't create schema"

    return True, 'Created database and schema'


def insert_db(table_name: str, rows: List[dict]) -> bool:
    """
    Utility for inserting values into the database
    """
    # Generate query values
    query_rows = []
    for row in rows:
        vals = ", ".join([str(val) for val in row.values()])
        query_rows.append(f'({vals})')

    # Execute sql query
    query = f'INSERT INTO [{table_name}] VALUES {", ".join(query_rows)};'
    ret = subprocess.run(f'echo "{query}" | sqlite3 "{DB_NAME}"', shell=True)
    return ret.returncode == 0


# ======================== #
#         Seeding          #
# ======================== #


def seed_tables() -> Iterable[Tuple[int, str]]:
    # Database rows to seed (represented as dicts)
    billig_events: List[dict] = []
    billig_ticket_groups: List[dict] = []
    billig_price_groups: List[dict] = []

    # Create a few billig events that are not used
    billig_events.extend([util.create_billig_event() for _ in range(COUNT)])
    yield 10, f'Created ${COUNT} unused billig events'

    # Create billig events for events with billig ticket type
    events_with_billig = Event.objects.filter(ticket_type=EventTicketType.BILLIG)
    for i, event in enumerate(list(events_with_billig)):
        # Create billig event dict
        billig_event = util.create_billig_event(
            name=f'Billig - {event.title_nb}',
            sale_from=event.start_dt - timezone.timedelta(days=-90),
            sale_to=event.start_dt + timezone.timedelta(minutes=30),
            hidden=False
        )
        billig_events.append(billig_event)
        # Also set billig ID in django event
        event.billig_id = billig_event['id']
        event.save()
        # Progress return for smooth loading bar
        progress = 10 + int(i / len(events_with_billig) * 80)
        yield progress, 'Connecting billig to existing events'

    # Create ticket groups for events
    for event in billig_events:
        tickets, prices = util.create_ticket_groups(event)
        billig_ticket_groups.extend(tickets)
        billig_price_groups.extend(prices)

    # Insert events
    if not insert_db('billig.event', billig_events):
        yield 90, 'Failed to insert billig events'
        return
    yield 90, 'Added ticket groups'

    # Insert ticket groups
    if not insert_db('billig.ticket_group', billig_ticket_groups):
        yield 95, 'Failed to insert ticket groups'
        return
    yield 95, 'Added ticket groups'

    # Insert price groups
    if not insert_db('billig.price_group', billig_price_groups):
        yield 95, 'Failed to insert price groups'
        return

    # Done!
    yield 100, f'Created {len(billig_events)} billig events'


# Main seed script entry point
def seed() -> Iterable[Tuple[int, str]]:

    # Create database and schema
    yield 0, "Creating billig_dev database..."
    ok, message = create_db()
    if not ok:
        # Failed to create DB
        yield 0, message
        return

    # Seed
    for percent, message in seed_tables():
        yield percent, message
