from __future__ import annotations

import random

from django.utils import timezone

from samfundet.models.billig import BilligEvent, BilligPriceGroup, BilligTicketGroup

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
# Could have used auto primary key, but this
# makes it easier to seed and name stuff
NEXT_EVENT_ID = 0
NEXT_TICKET_GROUP_ID = 0
NEXT_PRICE_GROUP_ID = 0


def create_event(
    *,
    name: str | None = None,
    sale_from: timezone.datetime | None = None,
    sale_to: timezone.datetime | None = None,
    hidden: bool | None = None,
) -> BilligEvent:
    """
    Utility for creating a BilligEvent with some default values.
    Returns event without saving it!
    """
    global NEXT_EVENT_ID  # noqa: PLW0603
    NEXT_EVENT_ID += 1

    # Default values
    name = name or f'Billig - Dummy Event {NEXT_EVENT_ID}'
    sale_from = sale_from or timezone.now() + timezone.timedelta(days=random.randint(-90, 90))
    sale_to = sale_to or sale_from + timezone.timedelta(days=30)
    hidden = random.randint(0, 25) == 0 if hidden is None else hidden

    return BilligEvent(
        id=NEXT_EVENT_ID,
        name=name,
        sale_from=sale_from,
        sale_to=sale_to,
        hidden=hidden,
    )


def create_prices(ticket: BilligTicketGroup) -> list[BilligPriceGroup]:
    """
    Utility function to create prices for a ticket group.
    Returns list of price groups without saving them.
    """
    global NEXT_PRICE_GROUP_ID  # noqa: PLW0603

    # Loop for some number of times
    price_groups: list[BilligPriceGroup] = []
    n_price_groups = random.randint(MIN_PRICE_GROUPS, MAX_PRICE_GROUPS)
    for _ in range(n_price_groups):
        # Create a price group
        NEXT_PRICE_GROUP_ID += 1
        price_groups.append(
            BilligPriceGroup(
                id=NEXT_PRICE_GROUP_ID,
                ticket_group=ticket,
                name=f'Billig - Price Group {NEXT_PRICE_GROUP_ID}',
                membership_needed=random.randint(0, 1) == 0,
                can_be_put_on_card=random.randint(0, 10) != 0,
                netsale=random.randint(0, 10) != 0,
                price=random.randint(50, 300),
            )
        )

    return price_groups


def create_tickets(event: BilligEvent) -> list[BilligTicketGroup]:
    """
    Utility function to create tickets for an event
    Returns list of tickets without saving them.
    """
    global NEXT_TICKET_GROUP_ID  # noqa: PLW0603

    # Loop to create ticket groups
    ticket_groups: list[BilligTicketGroup] = []
    n_ticket_groups = random.randint(MIN_TICKET_GROUPS, MAX_TICKET_GROUPS)
    for _ in range(n_ticket_groups):
        # Create a ticket group
        NEXT_TICKET_GROUP_ID += 1
        num = random.randint(MIN_TICKET_COUNT, MAX_TICKET_COUNT)
        num_sold = int(num * random.random())
        ticket_groups.append(
            BilligTicketGroup(
                id=NEXT_TICKET_GROUP_ID,
                event=event,
                name=f'Billig - Ticket Group {NEXT_TICKET_GROUP_ID}',
                ticket_limit=random.randint(1, 5),
                num_sold=num_sold,
                num=num,
            )
        )

    return ticket_groups
