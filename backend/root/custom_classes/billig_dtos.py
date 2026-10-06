from __future__ import annotations

from typing import TypedDict


class BilligCheckoutPriceGroupDto(TypedDict):
    """Online price group offered in checkout; price is in whole NOK."""

    id: int
    name: str
    price: int
    membership_needed: bool
    can_be_put_on_card: bool


class BilligCheckoutTicketGroupDto(TypedDict):
    """Ticket group and purchase limits offered in checkout."""

    id: int
    name: str
    is_sold_out: bool
    is_almost_sold_out: bool
    ticket_limit: int | None
    per_price_group_limit: int
    group_limit: int
    price_groups: list[BilligCheckoutPriceGroupDto]
