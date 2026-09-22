from __future__ import annotations

from enum import StrEnum
from dataclasses import dataclass


class BilligCheckoutError(StrEnum):
    EVENT_NOT_FOUND = 'event_not_found'
    EVENT_HIDDEN = 'event_hidden'
    SALE_NOT_STARTED = 'sale_not_started'
    SALE_ENDED = 'sale_ended'
    SOLD_OUT = 'sold_out'

    @property
    def label(self) -> str:
        return {
            self.EVENT_NOT_FOUND: 'Event not found',
            self.EVENT_HIDDEN: 'Event is hidden',
            self.SALE_NOT_STARTED: 'Ticket sale has not started yet',
            self.SALE_ENDED: 'Ticket sale has ended',
            self.SOLD_OUT: 'Event is sold out',
        }[self]


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
    is_theater_ticket_group: bool
    ticket_limit: int | None
    per_price_group_limit: int
    group_limit: int
    price_groups: list[BilligCheckoutPriceGroupDto]
