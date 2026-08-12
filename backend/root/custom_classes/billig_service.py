from __future__ import annotations

import uuid
import logging
from typing import Any

from django.db import connections, transaction
from django.utils import timezone
from django.db.models import F, Max

from samfundet.models.billig import (
    BilligEvent,
    BilligTicket,
    BilligPurchase,
    BilligPriceGroup,
    BilligTicketCard,
    BilligTicketGroup,
    BilligPaymentError,
)

logger = logging.getLogger(__name__)


class BilligService:
    @staticmethod
    def get_contact_fields(data: dict[str, Any]) -> tuple[str, str]:
        membercard = str(data.get('membercard') or data.get('cardnumber') or '').strip()
        email = str(data.get('email', '')).strip()
        return membercard, email

    @staticmethod
    def get_event_with_tickets(event_id: int) -> BilligEvent | None:
        try:
            return BilligEvent.objects.prefetch_related('ticket_groups__price_groups').get(id=event_id)
        except BilligEvent.DoesNotExist:
            logger.warning('Billig event not found: %s', event_id)
            return None

    @staticmethod
    def can_purchase_tickets(event_id: int) -> tuple[bool, str | None]:
        event = BilligService.get_event_with_tickets(event_id)
        if not event:
            return False, 'Event not found'

        now = timezone.make_naive(timezone.now())
        reason = next(
            (
                reason
                for condition, reason in (
                    (event.hidden, 'Event is hidden'),
                    (now < event.sale_from, 'Ticket sale has not started yet'),
                    (now > event.sale_to, 'Ticket sale has ended'),
                    (event.is_sold_out, 'Event is sold out'),
                )
                if condition
            ),
            None,
        )
        return reason is None, reason

    @staticmethod
    def get_ticket_group_data(ticket_group: BilligTicketGroup) -> dict[str, Any] | None:
        price_groups = [
            {
                'id': price_group.id,
                'name': price_group.name,
                'price': price_group.price,
                'membership_needed': price_group.membership_needed,
                'can_be_put_on_card': price_group.can_be_put_on_card,
            }
            for price_group in ticket_group.price_groups.all()
            if price_group.netsale
        ]
        if not price_groups:
            return None

        return {
            'id': ticket_group.id,
            'name': ticket_group.name,
            'is_sold_out': ticket_group.is_sold_out,
            'is_almost_sold_out': ticket_group.is_almost_sold_out,
            'ticket_limit': ticket_group.ticket_limit,
            'price_groups': price_groups,
        }

    @staticmethod
    def get_ticket_groups_for_event(event_id: int) -> list[dict[str, Any]]:
        event = BilligService.get_event_with_tickets(event_id)
        if not event:
            return []

        return [
            ticket_group_data
            for ticket_group in event.ticket_groups.all()
            if (ticket_group_data := BilligService.get_ticket_group_data(ticket_group)) is not None
        ]

    @staticmethod
    def create_fake_purchase(
        *,
        cart_rows: list[tuple[int, int]],
        membercard: str | None,
        email: str | None,
    ) -> list[str]:
        owner_member_id = None
        if membercard:
            owner_member_id = BilligTicketCard.objects.filter(card=int(membercard)).values_list('owner_member_id', flat=True).first()

        next_purchase_id = (BilligPurchase.objects.aggregate(max_id=Max('id'))['max_id'] or 0) + 1
        next_ticket_id = (BilligTicket.objects.aggregate(max_id=Max('id'))['max_id'] or 0) + 1
        price_groups = BilligPriceGroup.objects.select_related('ticket_group').filter(id__in=[price_group_id for price_group_id, _ in cart_rows])
        price_group_map = {price_group.id: price_group for price_group in price_groups}
        sold_counts_by_ticket_group: dict[int, int] = {}
        ticket_refs: list[str] = []

        with transaction.atomic(using='billig'):
            for price_group_id, count in cart_rows:
                price_group = price_group_map[price_group_id]
                sold_counts_by_ticket_group[price_group.ticket_group_id] = sold_counts_by_ticket_group.get(price_group.ticket_group_id, 0) + count
                for _ in range(count):
                    purchase = BilligPurchase.objects.create(
                        id=next_purchase_id,
                        owner_member_id=owner_member_id,
                        owner_email=email or None,
                    )
                    BilligTicket.objects.create(
                        id=next_ticket_id,
                        price_group=price_group,
                        purchase=purchase,
                        on_card=owner_member_id is not None,
                    )
                    ticket_refs.append(f'{next_ticket_id}12345')
                    next_purchase_id += 1
                    next_ticket_id += 1

            for ticket_group_id, count in sold_counts_by_ticket_group.items():
                BilligTicketGroup.objects.filter(id=ticket_group_id).update(num_sold=F('num_sold') + count)

        return ticket_refs

    @staticmethod
    def create_fake_payment_error(
        *,
        message: str,
        cart_rows: list[tuple[int, int]],
        membercard: str | None,
        email: str | None,
        persist_cart: bool,
    ) -> str:
        error_id = uuid.uuid4().hex

        with transaction.atomic(using='billig'):
            BilligPaymentError.objects.create(
                error=error_id,
                failed=timezone.now(),
                owner_cardno=membercard,
                owner_email=email,
                message=message,
            )

            if persist_cart:
                with connections['billig'].cursor() as cursor:
                    for price_group_id, count in cart_rows:
                        cursor.execute(
                            """
                            INSERT INTO "billig.payment_error_price_group"
                            (error, price_group, number_of_tickets)
                            VALUES (%s, %s, %s)
                            """,
                            [error_id, price_group_id, count],
                        )

        return error_id

    @staticmethod
    def get_payment_error_context(error_id: str) -> dict[str, Any]:
        payment_error = BilligPaymentError.objects.filter(error=error_id).first()
        if payment_error is None:
            return {
                'found': False,
                'retry_possible': False,
                'message': 'An unknown payment error occurred.',
            }

        cart_rows: list[dict[str, int]] = []
        event_ids: set[int] = set()
        with connections['billig'].cursor() as cursor:
            cursor.execute(
                """
                SELECT pepg.price_group, pepg.number_of_tickets, tg.event
                FROM "billig.payment_error_price_group" pepg
                JOIN "billig.price_group" pg ON pg.price_group = pepg.price_group
                JOIN "billig.ticket_group" tg ON tg.ticket_group = pg.ticket_group
                WHERE pepg.error = %s
                ORDER BY pepg.price_group
                """,
                [error_id],
            )
            for price_group_id, number_of_tickets, event_id in cursor.fetchall():
                cart_rows.append(
                    {
                        'price_group': int(price_group_id),
                        'number_of_tickets': int(number_of_tickets),
                    }
                )
                event_ids.add(int(event_id))

        return {
            'found': True,
            'retry_possible': bool(cart_rows),
            'message': payment_error.message,
            'owner_cardno': payment_error.owner_cardno,
            'owner_email': payment_error.owner_email,
            'cart_rows': cart_rows,
            'event_id': next(iter(event_ids)) if len(event_ids) == 1 else None,
        }
