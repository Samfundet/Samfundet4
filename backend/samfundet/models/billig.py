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

from django.db import models
from django.db.models import QuerySet

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

    # ======================== #
    #       Utilities          #
    # ======================== #

    @property
    def in_sale_period(self) -> bool:
        return self.sale_from <= datetime.now() <= self.sale_to

    @property
    def ticket_groups(self) -> QuerySet:
        return BilligTicketGroup.get_by_event_id(self.id)

    # ======================== #
    #         Queries          #
    # ======================== #

    # SQL data used for queries
    # These are the columns and table names in the billig db
    QUERY_TABLE = 'billig.event'
    QUERY_COLUMNS = """
        event as id,
        event_name as name,
        sale_from,
        sale_to
    """
    # Billig has a hidden column, don't include these
    QUERY_CONDITION = ''

    @classmethod
    def get_relevant(cls) -> QuerySet:
        # Exclude events which ended their sale more than a month ago
        # There will be a lot of events here, so very slow to get all of them
        one_month_ago = datetime.now() - timedelta(days=31)
        one_month_ago_str = one_month_ago.strftime('%m.%d.%Y')
        return cls.objects.raw(
            f"""
            SELECT  {cls.QUERY_COLUMNS}
            FROM    {cls.QUERY_TABLE}
            WHERE
                hidden = false AND 
                sale_to >= {one_month_ago_str};
            """
        )

    @classmethod
    def get_by_id(cls, id: int) -> QuerySet:
        return cls.objects.raw(
            f"""
            SELECT  {cls.QUERY_COLUMNS}
            FROM    {cls.QUERY_TABLE}
            WHERE   event = {int(id)};
            """
        )


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

    # ======================== #
    #       Utilities          #
    # ======================== #

    @property
    def price_groups(self) -> QuerySet:
        return BilligPriceGroup.get_by_ticket_group_id(self.id)

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
    QUERY_TABLE = 'billig.ticket_group'
    QUERY_COLUMNS = """
        ticket_group as id,
        event as event_id,
        ticket_group_name as name,
        ticket_limit,
        num_sold,
        num
    """

    @classmethod
    def get_by_event_id(cls, event_id: int) -> QuerySet:
        return cls.objects.raw(
            f"""
                SELECT  {cls.QUERY_COLUMNS}
                FROM    {cls.QUERY_TABLE}
                WHERE   event_id = {int(event_id)};
            """
        )


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
    name = models.IntegerField(blank=False, null=False)

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
    QUERY_TABLE = 'billig.price_group'
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
    def get_by_ticket_group_id(cls, ticket_group_id: int) -> QuerySet:
        return cls.objects.raw(
            f"""
                    SELECT  {cls.QUERY_COLUMNS}
                    FROM    {cls.QUERY_TABLE}
                    WHERE   ticket_group = {int(ticket_group_id)};
                """
        )
