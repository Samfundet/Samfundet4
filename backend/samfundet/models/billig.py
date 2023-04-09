from __future__ import annotations
#
# This file handles integration with database models in billig.
# The data is collected from billig using raw SQL queries.
#
# Unlike other models in the project, these models are not managed
# by django and can only be read. The actual tables may contain more
# columns than represented here, we only need to think about the
# data that are relevant for Samf4.
#
# By mirroring what we need from the models in unmanaged django models
# we can use them in the same way as our other models without
# thinking about them being in a different database.
#
# At the time of writing, we currently we have read access
# to the following tables in billig, although only some are used (*):
#
# public.kort
# billig.event (*)
# billig.ticket
# billig.price_group (*)
# billig.event_lim_web
# billig.ticket_card
# billig.ticket_group (*)
# billig.event_type
# billig.organisation
# billig.payment_error_price_group
# billig.payment_error
# billig.purchase
# billig.seat
# billig.ticket_seat
# billig.theater

from datetime import datetime, timedelta
from typing import List

from django.db import models

# ======================== #
#       Billig Event       #
# ======================== #


class BilligEvent(models.Model):
    """
    A billig event connected to information about ticket types
    and sale periods. Paid events are connected to a billig event.
    """

    class Meta:
        managed = False
        verbose_name = 'BilligEvent'
        verbose_name_plural = 'BilligEvents'

    # Field 'id' is actually named 'event' in billig, but this is nicer
    # Used as foreign key in billig_ticket_groups
    id = models.IntegerField(null=False, blank=False, primary_key=True)

    # Field 'name' is actually 'event_name' in billig, but this is nicer
    name = models.CharField(max_length=140, null=False, blank=False)

    # General info
    sale_from = models.DateTimeField(blank=False, null=False)
    sale_to = models.DateTimeField(blank=False, null=False)

    # The fetched ticket groups for this model instance
    ticket_groups: List[BilligTicketGroup] | None = None

    # ======================== #
    #       Utilities          #
    # ======================== #

    @property
    def in_sale_period(self) -> bool:
        return self.sale_from <= datetime.now() <= self.sale_to

    # Attaches relevant tickets and prices from prefetched lists
    def set_tickets_from_prefetched(
        self,
        ticket_groups: List[BilligTicketGroup],
        price_groups: List[BilligPriceGroup],
    ) -> None:
        """
        Utility function to attach ticket groups and price groups to a billig event from prefetched lists.
        This enables all tickets/prices to be fetched in a single SQL query first (much faster!)
        after which they are added to each event using this method.
        """
        # Set ticket groups with matching IDs
        self.ticket_groups = [t for t in ticket_groups if t.event_id == self.id]

        # Set price groups for this events ticket group
        for tg in self.ticket_groups:
            tg.price_groups = [pg for pg in price_groups if pg.ticket_group_id == tg.id]

    # ======================== #
    #         Queries          #
    # ======================== #

    # SQL data used for queries
    # These are the columns and table names in the billig db
    QUERY_TABLE = '[billig.event]'
    QUERY_COLUMNS = """
        event as id,
        event_name as name,
        sale_from,
        sale_to
    """

    @classmethod
    def fetch_related(
        cls,
        events: List[BilligEvent],
        get_tickets: bool = True,
        get_prices: bool = True,
    ) -> None:
        # Prefetch tickets and prices from billig
        tickets = BilligTicketGroup.get_by_event_ids([int(e.id) for e in events]) if get_tickets else []
        prices = BilligPriceGroup.get_by_ticket_group_ids([int(t.id) for t in tickets]) if get_prices else []
        # Attach tickets/prices to events
        for event in events:
            event.set_tickets_from_prefetched(tickets, prices)

    @classmethod
    def get_relevant(cls) -> List[BilligEvent]:
        # Exclude events which ended their sale more than a month ago
        # There will be a lot of events here, so very slow to get all of them
        one_month_ago = datetime.now() - timedelta(days=31)
        one_month_ago_str = one_month_ago.strftime('%m.%d.%Y')
        return list(
            cls.objects.raw(
                f"""
                SELECT  {cls.QUERY_COLUMNS}
                FROM    {cls.QUERY_TABLE}
                WHERE
                    hidden = false AND
                    sale_to >= {one_month_ago_str};
                """
            )
        )

    @classmethod
    def get_by_ids(cls, ids: List[int]) -> List[BilligEvent]:
        return list(
            cls.objects.raw(
                f"""
            SELECT  {cls.QUERY_COLUMNS}
            FROM    {cls.QUERY_TABLE}
            WHERE   event in ({", ".join([str(i) for i in ids])});
            """
            )
        )

    @classmethod
    def get_by_id(cls, id: int) -> BilligEvent | None:
        events = BilligEvent.get_by_ids([id])
        return events[0] if len(events) > 0 else None


# ======================== #
#   Billig Ticket Group     #
# ======================== #


class BilligTicketGroup(models.Model):
    """
    A ticket group for an event. Usually have just one, but sometimes we
    may have something like "Dinner and concert" or "Just the concert"
    """

    class Meta:
        managed = False
        verbose_name = 'BilligTicketGroup'
        verbose_name_plural = 'BilligTicketGroups'

    # Field 'id' is actually named 'ticket_group' in billig, but this is nicer
    id = models.IntegerField(null=False, blank=False, primary_key=True)

    # The event this ticket group is connected to (actually called just 'event' in billig)
    event_id = models.IntegerField(blank=False, null=False)

    # Actually called 'ticket_group_name' in billig
    name = models.CharField(max_length=140, blank=False, null=False)

    # Number of tickets/sold tickets
    num = models.PositiveIntegerField(blank=False, null=False)
    num_sold = models.PositiveIntegerField(blank=False, null=False)

    # Maximum amount allowed to buy
    ticket_limit = models.PositiveIntegerField(blank=False, null=False)

    # The fetched price groups for some model instance
    price_groups: List[BilligTicketGroup] | None = None

    # ======================== #
    #       Utilities          #
    # ======================== #

    @property
    def is_sold_out(self) -> bool:
        return self.num_sold >= self.num

    @property
    def is_almost_sold_out(self) -> bool:
        """
        Returns true if less than 20% of tickets are available
        """
        remain = self.num - self.num_sold
        percent_left = remain / self.num
        return percent_left < 0.2

    # ======================== #
    #         Queries          #
    # ======================== #

    # SQL data used for queries
    # These are the columns and table names in the billig db
    QUERY_TABLE = '[billig.ticket_group]'
    QUERY_COLUMNS = """
        ticket_group as id,
        event as event_id,
        ticket_group_name as name,
        ticket_limit,
        num_sold,
        num
    """

    @classmethod
    def get_by_event_ids(cls, event_ids: List[int]) -> List[BilligTicketGroup]:
        return list(
            cls.objects.raw(
                f"""
                    SELECT  {cls.QUERY_COLUMNS}
                    FROM    {cls.QUERY_TABLE}
                    WHERE   event IN ({', '.join([str(eid) for eid in event_ids])});
                """
            )
        )

    @classmethod
    def get_by_event_id(cls, event_id: int) -> BilligTicketGroup | None:
        ticket_groups = BilligTicketGroup.get_by_event_ids([event_id])
        return ticket_groups[0] if len(ticket_groups) > 0 else None


# ======================== #
#   Billig Price Group     #
# ======================== #


class BilligPriceGroup(models.Model):
    """
    One price in a billig ticket group.
    E.g.
        TicketGroup: dinner & concert
        PriceGroup: member / not a member

    In most cases we only have one ticket group, and two price groups
    for member/not a member, but sometimes billig is set up with more than this.
    """

    class Meta:
        managed = False
        verbose_name = 'BilligPriceGroup'
        verbose_name_plural = 'BilligPriceGroups'

    # Field 'id' is actually named 'price_group' in billig, but this is nicer
    id = models.IntegerField(null=False, blank=False, primary_key=True)

    # The ticket group this price group is a part of
    # Actually just named 'ticket_group' in billig
    ticket_group_id = models.IntegerField(blank=False, null=False)

    # Field 'name' is actually named 'price_group_name' in billig, but this is nicer
    name = models.CharField(max_length=140, blank=False, null=False)

    # General info
    can_be_put_on_card = models.BooleanField(blank=False, null=False)
    membership_needed = models.BooleanField(blank=False, null=False)
    netsale = models.BooleanField(blank=False, null=False)
    price = models.IntegerField(blank=False, null=False)

    # ======================== #
    #         Queries          #
    # ======================== #

    # SQL data used for queries
    # These are the columns and table names in the billig db
    QUERY_TABLE = '[billig.price_group]'
    QUERY_COLUMNS = """
        price_group as id,
        ticket_group as ticket_group_id,
        price_group_name as name,
        membership_needed,
        can_be_put_on_card,
        netsale,
        price
    """

    @classmethod
    def get_by_ticket_group_ids(cls, ticket_group_ids: List[int]) -> List[BilligPriceGroup]:
        ids_str = ', '.join([str(tid) for tid in ticket_group_ids])
        return list(
            cls.objects.raw(
                f"""
                SELECT  {cls.QUERY_COLUMNS}
                FROM    {cls.QUERY_TABLE}
                WHERE   ticket_group IN ({ids_str});
                """
            )
        )

    @classmethod
    def get_by_ticket_group_id(cls, ticket_group_id: int) -> BilligPriceGroup | None:
        price_groups = BilligPriceGroup.get_by_ticket_group_ids([ticket_group_id])
        return price_groups[0] if len(price_groups) > 0 else None
