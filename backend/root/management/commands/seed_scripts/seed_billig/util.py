import random
from typing import Any

from django.utils import timezone

# ======================== #
#  Billig Seed Utilities   #
# ======================== #

# Number of ticket groups to create per event
MIN_TICKET_GROUPS = 1
MAX_TICKET_GROUPS = 3

# Number of price groups to create per ticket group
MIN_PRICE_GROUPS = 1
MAX_PRICE_GROUPS = 4

# Number of available tickets (used for num, num_sold)
MIN_TICKET_COUNT = 10
MAX_TICKET_COUNT = 600

# Global counters to make unique billig IDs
# Could have used SQL auto key, but this is easier to seed foreign keys with pure SQL
NEXT_EVENT_ID = 0
NEXT_TICKET_GROUP_ID = 0
NEXT_PRICE_GROUP_ID = 0


def create_billig_event(
    name: str | None = None,
    sale_from: timezone.datetime | None = None,
    sale_to: timezone.datetime | None = None,
    hidden: bool | None = None,
) -> dict[str, Any]:
    """
    Utility for creating a dict representing a billig event.
    This makes it much easier to use and convert to SQL queries later.
    """
    global NEXT_EVENT_ID
    NEXT_EVENT_ID += 1

    # Default values
    name = name or f'Billig - Dummy Event {NEXT_EVENT_ID}'
    sale_from = sale_from or timezone.now() + timezone.timedelta(days=random.randint(-90, 90))
    sale_to = sale_to or sale_from + timezone.timedelta(days=30)
    hidden = random.randint(0, 25) == 0 if hidden is None else hidden

    return {
        'id': NEXT_EVENT_ID,
        'name': f"'{name}'",
        'sale_from': f"'{sale_from.strftime('%d.%m.%Y')}'",
        'sale_to': f"'{sale_to.strftime('%d.%m.%Y')}'",
        'hidden': 'true' if hidden else 'false',
    }


def create_price_groups(ticket_group: dict) -> list[dict[str, Any]]:
    global NEXT_PRICE_GROUP_ID

    price_groups: list[dict[str, Any]] = []
    n_price_groups = random.randint(MIN_PRICE_GROUPS, MAX_PRICE_GROUPS)
    for _ in range(n_price_groups):
        NEXT_PRICE_GROUP_ID += 1
        price_groups.append(
            {
                'id': NEXT_PRICE_GROUP_ID,
                'ticket_group': ticket_group['id'],
                'name': f"'Billig - Price Group {NEXT_PRICE_GROUP_ID}'",
                'membership_needed': 'true' if random.randint(0, 1) == 0 else 'false',
                'can_be_put_on_card': 'true' if random.randint(0, 10) != 0 else 'false',
                'netsale': 'true' if random.randint(0, 10) != 0 else 'false',
                'price': random.randint(50, 300),
            }
        )
    return price_groups


def create_ticket_groups(event: dict) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """
    Utility function to create ticket and price group dicts for a billig event (dictionary)
    Returns a tuple of (ticket_groups, price_groups).
    """
    global NEXT_TICKET_GROUP_ID, NEXT_PRICE_GROUP_ID

    # Loop to create ticket groups
    ticket_groups, price_groups = [], []
    n_ticket_groups = random.randint(MIN_TICKET_GROUPS, MAX_TICKET_GROUPS)
    for _ in range(n_ticket_groups):
        # Create ticket group
        NEXT_TICKET_GROUP_ID += 1
        num = random.randint(MIN_TICKET_COUNT, MAX_TICKET_COUNT)
        num_sold = int(num * random.random())
        ticket_group = {
            'id': NEXT_TICKET_GROUP_ID,
            'event': event['id'],
            'name': f"'Billig - Ticket Group {NEXT_TICKET_GROUP_ID}'",
            'ticket_limit': random.randint(1, 5),
            'num_sold': num_sold,
            'num': num,
        }
        ticket_groups.append(ticket_group)

        # Add price groups for this ticket group
        price_groups.extend(create_price_groups(ticket_group))

    return ticket_groups, price_groups
