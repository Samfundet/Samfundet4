from __future__ import annotations

import logging
import re
import uuid
from typing import Any
from urllib.parse import urlencode

from django.db import connections, transaction
from django.db.models import F, Max
from django.utils import timezone

from samfundet.models.billig import (
    BilligEvent,
    BilligPaymentError,
    BilligPriceGroup,
    BilligPurchase,
    BilligTicket,
    BilligTicketCard,
    BilligTicketGroup,
)

logger = logging.getLogger(__name__)

SEAT_FIELD_PATTERN = re.compile(r'^seat_(\d+)_(\d+)$')


class BilligService:
    PDF_BASE_URL = 'http://billig.samfundet.no/pdf'

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
        if event.hidden:
            return False, 'Event is hidden'
        if now < event.sale_from:
            return False, 'Ticket sale has not started yet'
        if now > event.sale_to:
            return False, 'Ticket sale has ended'
        if event.is_sold_out:
            return False, 'Event is sold out'

        return True, None

    @staticmethod
    def get_online_price_groups(event: BilligEvent) -> dict[int, BilligPriceGroup]:
        online_price_groups: dict[int, BilligPriceGroup] = {}
        for ticket_group in event.ticket_groups.all():
            for price_group in ticket_group.price_groups.all():
                if price_group.netsale:
                    online_price_groups[price_group.id] = price_group
        return online_price_groups

    @staticmethod
    def validate_purchase_data(data: dict[str, Any], *, event: BilligEvent) -> tuple[bool, str | None]:
        online_price_groups = BilligService.get_online_price_groups(event)

        selected_price_groups: dict[int, int] = {}
        for key, value in data.items():
            if not key.startswith('price_group_'):
                continue
            try:
                price_group_id = int(key.replace('price_group_', ''))
                count = int(value)
            except (TypeError, ValueError):
                return False, 'Invalid ticket quantity'

            if count < 0:
                return False, 'Invalid ticket quantity'
            if count > 0:
                selected_price_groups[price_group_id] = count

        if not selected_price_groups:
            return False, 'No tickets selected'

        invalid_price_groups = [price_group_id for price_group_id in selected_price_groups if price_group_id not in online_price_groups]
        if invalid_price_groups:
            return False, 'Invalid price group selection'

        membercard, email = BilligService.get_contact_fields(data)
        if bool(membercard) == bool(email):
            return False, 'Exactly one of membercard or email must be set'
        if membercard and any(not online_price_groups[price_group_id].can_be_put_on_card for price_group_id in selected_price_groups):
            return False, 'Selected tickets cannot be put on card'

        selected_seats_by_ticket_group: dict[int, set[int]] = {}
        for key, value in data.items():
            match = SEAT_FIELD_PATTERN.fullmatch(key)
            if not match or not value:
                continue
            ticket_group_id = int(match.group(1))
            seat_id = int(match.group(2))
            if seat_id <= 0:
                return False, 'Invalid seat selection'
            selected_seats_by_ticket_group.setdefault(ticket_group_id, set()).add(seat_id)

        for ticket_group in event.ticket_groups.all():
            online_group_price_groups = [price_group for price_group in ticket_group.price_groups.all() if price_group.netsale]
            if not online_group_price_groups:
                continue

            selected_count = sum(selected_price_groups.get(price_group.id, 0) for price_group in online_group_price_groups)
            if selected_count == 0:
                continue

            for price_group in online_group_price_groups:
                selected_price_group_count = selected_price_groups.get(price_group.id, 0)
                if selected_price_group_count > ticket_group.price_group_ticket_limit:
                    return False, 'Ticket selection exceeds available limit'

            remaining_tickets = max(ticket_group.num - ticket_group.num_sold, 0)
            ticket_group_limit = min(
                ticket_group.group_ticket_limit(price_group_count=len(online_group_price_groups)),
                remaining_tickets,
            )
            if selected_count > ticket_group_limit:
                return False, 'Ticket selection exceeds available limit'

            if ticket_group.is_theater_ticket_group and len(selected_seats_by_ticket_group.get(ticket_group.id, set())) != selected_count:
                return False, 'Selected theater tickets must have matching seats'

        return True, None

    @staticmethod
    def get_ticket_groups_for_event(event_id: int) -> list[dict[str, Any]]:
        event = BilligService.get_event_with_tickets(event_id)
        if not event:
            return []

        result = []
        for ticket_group in event.ticket_groups.all():
            ticket_group_data = {
                'id': ticket_group.id,
                'name': ticket_group.name,
                'is_sold_out': ticket_group.is_sold_out,
                'is_almost_sold_out': ticket_group.is_almost_sold_out,
                'ticket_limit': ticket_group.ticket_limit,
                'price_groups': [],
            }

            for price_group in ticket_group.price_groups.all():
                if not price_group.netsale:
                    continue

                price_group_data = {
                    'id': price_group.id,
                    'name': price_group.name,
                    'price': price_group.price,
                    'membership_needed': price_group.membership_needed,
                    'can_be_put_on_card': price_group.can_be_put_on_card,
                }
                ticket_group_data['price_groups'].append(price_group_data)

            if ticket_group_data['price_groups']:
                result.append(ticket_group_data)

        return result

    @staticmethod
    def prepare_purchase_data(request_data: dict[str, Any], *, event: BilligEvent) -> dict[str, Any]:
        purchase_data: dict[str, Any] = {}
        online_price_groups = BilligService.get_online_price_groups(event)

        for key, value in request_data.items():
            if not key.startswith('price_group_'):
                continue
            try:
                price_group_id = int(key.replace('price_group_', ''))
                count = int(value)
            except (TypeError, ValueError):
                continue

            if count > 0 and price_group_id in online_price_groups:
                purchase_data[f'price_{price_group_id}_count'] = count

        valid_ticket_group_ids = {ticket_group.id for ticket_group in event.ticket_groups.all()}
        for key, value in request_data.items():
            match = SEAT_FIELD_PATTERN.fullmatch(key)
            if not match or not value:
                continue
            ticket_group_id = int(match.group(1))
            if ticket_group_id in valid_ticket_group_ids:
                purchase_data[key] = value

        membercard, email = BilligService.get_contact_fields(request_data)
        if membercard:
            purchase_data['ticket_type'] = 'card'
        if email:
            purchase_data['ticket_type'] = 'paper'
        if membercard:
            purchase_data['membercard'] = membercard
        if email:
            purchase_data['email'] = email

        return purchase_data

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
                '''
                SELECT pepg.price_group, pepg.number_of_tickets, tg.event
                FROM "billig.payment_error_price_group" pepg
                JOIN "billig.price_group" pg ON pg.price_group = pepg.price_group
                JOIN "billig.ticket_group" tg ON tg.ticket_group = pg.ticket_group
                WHERE pepg.error = %s
                ORDER BY pepg.price_group
                ''',
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

    @staticmethod
    def get_success_context(ticket_refs: list[str]) -> dict[str, Any]:
        refs_in_order = [ticket_ref.strip() for ticket_ref in ticket_refs if ticket_ref.strip()]
        numeric_ticket_ids = [int(ticket_ref) for ticket_ref in refs_in_order if ticket_ref.isdigit()]

        tickets_by_id = {
            ticket.id: ticket
            for ticket in BilligTicket.objects.select_related('price_group__ticket_group__event').filter(id__in=numeric_ticket_ids)
        }

        ticket_rows: list[dict[str, Any]] = []
        total_price = 0
        for ticket_ref in refs_in_order:
            ticket_id = int(ticket_ref) if ticket_ref.isdigit() else None
            ticket = tickets_by_id.get(ticket_id) if ticket_id is not None else None

            row = {
                'ticketno': ticket_ref,
                'on_card': ticket.on_card if ticket is not None else None,
                'price_group': None,
                'price_group_name': None,
                'price': None,
                'event': None,
                'event_name': None,
                'event_time': None,
            }
            if ticket is not None:
                row.update(
                    {
                        'price_group': ticket.price_group_id,
                        'price_group_name': ticket.price_group.name,
                        'price': ticket.price_group.price,
                        'event': ticket.price_group.ticket_group.event_id,
                        'event_name': ticket.price_group.ticket_group.event.name,
                        'event_time': ticket.price_group.ticket_group.event.event_time,
                    }
                )
                total_price += ticket.price_group.price
            ticket_rows.append(row)

        pdf_query = urlencode({f'ticket{i}': ticket_ref for i, ticket_ref in enumerate(refs_in_order)})
        return {
            'tickets': ticket_rows,
            'total_price': total_price,
            'pdf_url': f'{BilligService.PDF_BASE_URL}?{pdf_query}' if refs_in_order else None,
        }
