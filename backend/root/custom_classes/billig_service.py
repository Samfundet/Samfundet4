from __future__ import annotations

import logging
from typing import Any, Optional

from django.utils import timezone

from samfundet.models.billig import BilligEvent

logger = logging.getLogger(__name__)


class BilligService:
    """
    Service for interacting with Billig ticketing system.

    This class provides methods for:
    - Getting event and ticket information
    - Validating purchase data
    - Preparing form data
    - Processing callbacks
    """

    @staticmethod
    def get_event_with_tickets(event_id: int) -> Optional[BilligEvent]:
        """
        Get Billig event with all ticket information.

        Args:
            event_id: Billig event ID

        Returns:
            Optional[BilligEvent]: Event with ticket information, or None if not found
        """
        try:
            event = BilligEvent.objects.get(id=event_id)
            # Prefetch related ticket groups and price groups for performance
            # This optimizes database queries
            event.ticket_groups.select_related().prefetch_related('price_groups')
            return event
        except BilligEvent.DoesNotExist:
            logger.warning(f'Billig event not found: {event_id}')
            return None

    @staticmethod
    def can_purchase_tickets(event_id: int) -> tuple[bool, Optional[str]]:
        """
        Check if tickets can be purchased for an event.

        Args:
            event_id: Billig event ID

        Returns:
            Tuple[bool, Optional[str]]: (can_purchase, reason)
        """
        event = BilligService.get_event_with_tickets(event_id)

        if not event:
            return False, 'Event not found'

        if event.hidden:
            return False, 'Event is hidden'

        now = timezone.now()
        if now < event.sale_from:
            return False, 'Ticket sale has not started yet'

        if now > event.sale_to:
            return False, 'Ticket sale has ended'

        if event.is_sold_out:
            return False, 'Event is sold out'

        return True, None

    @staticmethod
    def prepare_purchase_data(request_data: dict[str, Any], event_id: int) -> dict[str, Any]:
        """
        Prepare purchase data to be sent to Billig.

        Args:
            request_data: Data from the request
            event_id: Billig event ID

        Returns:
            Dict[str, Any]: Data to be sent to Billig
        """
        purchase_data = {'ticket_type': request_data.get('ticket_type', ''), 'authenticity_token': request_data.get('authenticity_token', '')}

        # Add price group counts
        for key, value in request_data.items():
            if key.startswith('price_group_'):
                try:
                    price_group_id = int(key.replace('price_group_', ''))
                    count = int(value)
                    if count > 0:
                        purchase_data[f'price_{price_group_id}_count'] = count
                except (ValueError, TypeError):
                    continue

        # Add membercard or email based on ticket type
        if purchase_data['ticket_type'] == 'card':
            purchase_data['membercard'] = request_data.get('membercard', '')
        elif purchase_data['ticket_type'] == 'paper':
            purchase_data['email'] = request_data.get('email', '')

        return purchase_data

    @staticmethod
    def validate_purchase_data(data: dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate purchase data.

        Args:
            data: Purchase data

        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        # Check if any tickets are selected
        has_tickets = False
        for key, value in data.items():
            if key.startswith('price_group_'):
                try:
                    count = int(value)
                    if count > 0:
                        has_tickets = True
                        break
                except (ValueError, TypeError):
                    pass

        if not has_tickets:
            return False, 'No tickets selected'

        # Check ticket type
        ticket_type = data.get('ticket_type')
        if ticket_type not in ['card', 'paper']:
            return False, 'Invalid ticket type'

        # Check member card or email
        if ticket_type == 'card' and not data.get('membercard'):
            return False, 'Member card number is required for card tickets'

        if ticket_type == 'paper' and not data.get('email'):
            return False, 'Email is required for paper tickets'

        return True, None

    @staticmethod
    def get_ticket_groups_for_event(event_id: int) -> list[dict[str, Any]]:
        """
        Get ticket groups for an event.

        Args:
            event_id: Billig event ID

        Returns:
            List[Dict[str, Any]]: List of ticket groups with price groups
        """
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
                if not price_group.netsale:  # Skip price groups not available for online sale
                    continue

                price_group_data = {
                    'id': price_group.id,
                    'name': price_group.name,
                    'price': price_group.price,
                    'membership_needed': price_group.membership_needed,
                    'can_be_put_on_card': price_group.can_be_put_on_card,
                }
                ticket_group_data['price_groups'].append(price_group_data)

            if ticket_group_data['price_groups']:  # Only add if it has available price groups
                result.append(ticket_group_data)

        return result

    @staticmethod
    def process_success_callback(callback_data: dict[str, Any]) -> None:
        """
        Process successful purchase callback.

        Args:
            callback_data: Callback data from Billig
        """
        # Extract relevant data
        tickets = callback_data.get('tickets', '')
        event_id = callback_data.get('event_id')

        # Log the successful purchase
        logger.info(f'Successful Billig purchase: event={event_id}, tickets={tickets}')

        # Add any additional logic here (e.g., updating purchase records)

    @staticmethod
    def process_failure_callback(callback_data: dict[str, Any]) -> None:
        """
        Process failed purchase callback.

        Args:
            callback_data: Callback data from Billig
        """
        # Extract relevant data
        error = callback_data.get('error', 'unknown')
        event_id = callback_data.get('event_id')

        # Log the failed purchase
        logger.warning(f'Failed Billig purchase: event={event_id}, error={error}')

        # Add any additional logic here (e.g., updating failure records)
