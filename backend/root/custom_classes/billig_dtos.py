from __future__ import annotations

from dataclasses import dataclass

from django.db.models import TextChoices


class BilligCheckoutError(TextChoices):
    EVENT_NOT_FOUND = 'event_not_found', 'Event not found'
    EVENT_HIDDEN = 'event_hidden', 'Event is hidden'
    SALE_NOT_STARTED = 'sale_not_started', 'Ticket sale has not started yet'
    SALE_ENDED = 'sale_ended', 'Ticket sale has ended'
    SOLD_OUT = 'sold_out', 'Event is sold out'


@dataclass(frozen=True, kw_only=True)
class BilligCheckoutPriceGroupDto:
    """Online price group offered in checkout; price is in whole NOK."""

    id: int
    name: str
    price: int
    membership_needed: bool
    can_be_put_on_card: bool


@dataclass(frozen=True, kw_only=True)
class BilligCheckoutTicketGroupDto:
    """Ticket group and purchase limits offered in checkout."""

    id: int
    name: str
    is_sold_out: bool
    is_almost_sold_out: bool
    ticket_limit: int | None
    per_price_group_limit: int
    group_limit: int
    price_groups: list[BilligCheckoutPriceGroupDto]
