#
# Creates and seeds the billig database.
#
# This seed script is a bit different because billig_dev
# is not managed by django, but uses a different sqlite3
# database simulating the real billig in prod (cirkus).
#
#

import os
from typing import Tuple, Iterable

import django
from django.db import transaction
from django.utils import timezone
from django import db

from samfundet.models.billig import BilligEvent, BilligTicketGroup, BilligPriceGroup
from samfundet.models.event import Event, EventTicketType

from .seed_billig import util

# Number of billig events to create in addition
# to those connected to django events (ticket type billig)
COUNT = 20

# Get django database name from config (see database setup in dev.py)
DB_NAME = db.connections.databases['billig']['NAME']
SEED_DIRECTORY = os.path.join(os.path.dirname(__file__), 'seed_billig')

# ======================== #
#     Create Database      #
# ======================== #


def get_schema() -> str:
    # Generate schema (pass schema.sql to sqlite3)
    seed_schema = os.path.join(SEED_DIRECTORY, 'schema.sql')
    with open(seed_schema, 'r') as f:
        schema = f.read()
    return schema


def create_db() -> Tuple[bool, str]:
    """
    Creates a new sqlite3 database with schema using shell scripts
    """

    schema = get_schema()
    schema_queries = schema.split(';')
    with django.db.connections['billig'].cursor() as cursor:
        with transaction.atomic():
            for query in schema_queries:
                cursor.execute(query)

    return True, 'Created database and schema'


# ======================== #
#         Seeding          #
# ======================== #


def seed_tables() -> Iterable[Tuple[int, str]]:

    events, tickets, prices = [], [], []

    # Create a few billig events that are not used
    events.extend([util.create_event() for _ in range(COUNT)])
    yield 10, f'Created {COUNT} unused billig events'

    # Find django/samf4 events with billig ticket type
    events_with_billig = Event.objects.filter(ticket_type=EventTicketType.BILLIG)

    # Run atomic transaction. This prevents save() from running every
    # iteration and is about 69 times faster (rough estimate)
    with transaction.atomic():
        for i, event in enumerate(list(events_with_billig)):
            # Create billig event
            billig_event = util.create_event(
                name=f'Billig - {event.title_nb}',
                sale_from=event.start_dt - timezone.timedelta(days=90),
                sale_to=event.start_dt + timezone.timedelta(minutes=30),
                hidden=False
            )
            events.append(billig_event)

            # Set billig ID in django event
            # (This is not a real foreign key, see Event model)
            event.billig_id = billig_event.id
            event.save()

            # Progress return for an ultra smooth loading bar (up to 80%)
            progress = 10 + int(i / len(events_with_billig) * 70)
            yield progress, 'Connecting billig to existing events'

    # Saving must be done in this order because billig foreign keys
    # depend on each other. All are done in bulk for speed.

    # Save billig events
    BilligEvent.objects.bulk_create(events)
    yield 80, 'Saved events'

    # Create and save ticket groups
    for event in events:
        tickets.extend(util.create_tickets(event))
    BilligTicketGroup.objects.bulk_create(tickets)
    yield 90, 'Saved tickets'

    # Create and save price groups
    for ticket in tickets:
        prices.extend(util.create_prices(ticket))
    BilligPriceGroup.objects.bulk_create(prices)

    # Done!
    yield 100, f'Created {len(events)} billig events'


# Main seed script entry point
def seed() -> Iterable[Tuple[int, str]]:

    # Create database and schema
    yield 0, 'Creating billig_dev database...'
    ok, message = create_db()
    if not ok:
        # Failed to create DB
        yield 100, message
        return

    # Seed billig database
    for percent, message in seed_tables():
        yield percent, message
