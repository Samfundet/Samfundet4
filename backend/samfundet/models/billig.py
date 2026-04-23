from __future__ import annotations

from django.db import models
from django.utils import timezone

#
# This file handles mirrors the database models in billig
#
# By mirroring what we need from the models in unmanaged django models
# we can use them in the same way as our other models without
# thinking about them being in a different database.
# Unlike other models in the project, these models are not managed by django
# and can only be read. The actual tables may contain more columns than
# represented here, we only need to think about data relevant for Samf4.
#
# At the time of writing, we currently have read access
# to the following tables in billig, although only some are used (*):
#
# public.kort
# billig.event_lim_web (*)
# billig.ticket
# billig.price_group (*)
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
from django.db.models import QuerySet

# Percentage of tickets that must be sold
# before the event/ticket is marked as almost sold out
LIMIT_FOR_ALMOST_SOLD_OUT = 0.8

# ======================== #
#       Billig Event       #
# ======================== #


class BilligEvent(models.Model):
    """
    A billig event connected to information about ticket types
    and sale periods. Paid events are connected to a billig event.
    Note that this model must use billig column names.
    """

    # The primary billig event id, used as foreign key in billig ticket groups
    id = models.IntegerField(null=False, blank=False, primary_key=True, db_column='event')

    # General info
    name = models.CharField(max_length=140, null=False, blank=False, db_column='event_name')
    event_location = models.CharField(max_length=255, blank=True, null=True)
    event_note = models.TextField(blank=True, null=True)
    event_time = models.DateTimeField(blank=True, null=True)
    event_type = models.CharField(max_length=255, blank=True, null=True)
    external_id = models.IntegerField(blank=True, null=True)
    organisation = models.IntegerField(blank=True, null=True)
    a4_ticket_layout = models.IntegerField(blank=True, null=True)
    receipt_ticket_layout = models.IntegerField(blank=True, null=True)
    tp_ticket_layout = models.IntegerField(blank=True, null=True)
    ticket_fee = models.IntegerField(blank=True, null=True)
    sale_from = models.DateTimeField(blank=False, null=False)
    sale_to = models.DateTimeField(blank=False, null=False)
    hidden = models.BooleanField(blank=False, null=False)

    # BilligEvent model instances will also have access
    # to a list field 'ticket_groups' not defined here.
    # See 'related_field' in BilligTicketGroup

    class Meta:
        managed = False
        verbose_name = 'BilligEvent'
        verbose_name_plural = 'BilligEvents'
        db_table = 'billig.event_lim_web'

    def __str__(self) -> str:
        return self.name

    # ======================== #
    #       Utilities          #
    # ======================== #

    @property
    def in_sale_period(self) -> bool:
        now = timezone.make_naive(timezone.now())
        return self.sale_from <= now <= self.sale_to

    @property
    def is_sold_out(self) -> bool:
        return all(ticket.is_sold_out for ticket in self.ticket_groups.all())

    @property
    def is_almost_sold_out(self) -> bool:
        total_tickets = sum(ticket.num for ticket in self.ticket_groups.all())
        total_sold = sum(ticket.num_sold for ticket in self.ticket_groups.all())
        if total_tickets == 0:
            return False
        return total_sold / total_tickets >= LIMIT_FOR_ALMOST_SOLD_OUT

    @staticmethod
    def get_relevant() -> QuerySet:
        # Exclude events which ended their sale more than a month ago
        # There will be a lot of events here, so very slow to get all of them
        one_month_ago = timezone.now() - timezone.timedelta(days=31)
        return BilligEvent.objects.filter(
            sale_to__gt=one_month_ago,
            hidden=False,
        )


# ======================== #
#   Billig Ticket Group     #
# ======================== #


class BilligTicketGroup(models.Model):
    """
    A ticket group for an event. Usually have just one, but sometimes we
    may have something like "Dinner and concert" or "Just the concert"
    """

    DEFAULT_TICKET_LIMIT = 9

    # The primary billig ticket group id
    id = models.IntegerField(null=False, blank=False, primary_key=True, db_column='ticket_group')
    name = models.CharField(max_length=140, blank=False, null=False, db_column='ticket_group_name')

    # The event this ticket group is connected to. The related name makes
    # the ticket groups accessible in billig events using billig.ticket_groups
    event = models.ForeignKey(
        BilligEvent,
        blank=False,
        null=False,
        on_delete=models.DO_NOTHING,
        related_name='ticket_groups',
        db_column='event',
    )

    # Number of tickets/sold tickets
    num = models.PositiveIntegerField(blank=False, null=False)
    num_sold = models.PositiveIntegerField(blank=False, null=False)

    is_theater_ticket_group = models.BooleanField(blank=False, null=False, default=False)

    # Maximum amount allowed to buy
    ticket_limit = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        verbose_name = 'BilligTicketGroup'
        verbose_name_plural = 'BilligTicketGroups'
        db_table = 'billig.ticket_group'

    def __str__(self) -> str:
        return self.name

    # ======================== #
    #       Utilities          #
    # ======================== #

    @property
    def is_sold_out(self) -> bool:
        return self.num_sold >= self.num

    @property
    def is_almost_sold_out(self) -> bool:
        percent_sold = self.num_sold / self.num
        return percent_sold >= LIMIT_FOR_ALMOST_SOLD_OUT

    @property
    def price_group_ticket_limit(self) -> int:
        return self.ticket_limit if self.ticket_limit is not None else self.DEFAULT_TICKET_LIMIT

    def group_ticket_limit(self, *, price_group_count: int) -> int:
        if self.ticket_limit is not None:
            return self.ticket_limit
        return self.DEFAULT_TICKET_LIMIT * max(price_group_count, 1)


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

    # The primary id of the billig price group (named price_group in billig db)
    id = models.IntegerField(null=False, blank=False, primary_key=True, db_column='price_group')
    name = models.CharField(max_length=140, blank=False, null=False, db_column='price_group_name')

    # The ticket group this ticket price is connected to. The related name makes
    # the price groups accessible in ticket groups using ticket_group.price_groups
    ticket_group = models.ForeignKey(
        BilligTicketGroup,
        blank=False,
        null=False,
        on_delete=models.DO_NOTHING,
        related_name='price_groups',
        db_column='ticket_group',
    )

    # General info
    can_be_put_on_card = models.BooleanField(blank=False, null=False)
    membership_needed = models.BooleanField(blank=False, null=False)
    netsale = models.BooleanField(blank=False, null=False)
    price = models.IntegerField(blank=False, null=False)

    class Meta:
        managed = False
        verbose_name = 'BilligPriceGroup'
        verbose_name_plural = 'BilligPriceGroups'
        db_table = 'billig.price_group'

    def __str__(self) -> str:
        return self.name


class BilligPaymentError(models.Model):
    error = models.CharField(max_length=64, primary_key=True)
    failed = models.DateTimeField(blank=True, null=True)
    owner_cardno = models.CharField(max_length=140, blank=True, null=True)
    owner_email = models.CharField(max_length=254, blank=True, null=True)
    message = models.TextField(blank=False, null=False)

    class Meta:
        managed = False
        verbose_name = 'BilligPaymentError'
        verbose_name_plural = 'BilligPaymentErrors'
        db_table = 'billig.payment_error'


class BilligTicketCard(models.Model):
    card = models.BigIntegerField(primary_key=True)
    owner_member_id = models.IntegerField(blank=True, null=True)
    membership_ends = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        verbose_name = 'BilligTicketCard'
        verbose_name_plural = 'BilligTicketCards'
        db_table = 'billig.ticket_card'


class BilligPurchase(models.Model):
    id = models.IntegerField(null=False, blank=False, primary_key=True, db_column='purchase')
    owner_member_id = models.IntegerField(blank=True, null=True)
    owner_email = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        verbose_name = 'BilligPurchase'
        verbose_name_plural = 'BilligPurchases'
        db_table = 'billig.purchase'


class BilligTicket(models.Model):
    id = models.IntegerField(null=False, blank=False, primary_key=True, db_column='ticket')
    price_group = models.ForeignKey(
        BilligPriceGroup,
        blank=False,
        null=False,
        on_delete=models.DO_NOTHING,
        related_name='tickets',
        db_column='price_group',
    )
    purchase = models.ForeignKey(
        BilligPurchase,
        blank=False,
        null=False,
        on_delete=models.DO_NOTHING,
        related_name='tickets',
        db_column='purchase',
    )
    used = models.DateTimeField(blank=True, null=True)
    refunded = models.DateTimeField(blank=True, null=True)
    on_card = models.BooleanField(blank=False, null=False)
    refunder = models.TextField(blank=True, null=True)
    point_of_refund = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        verbose_name = 'BilligTicket'
        verbose_name_plural = 'BilligTickets'
        db_table = 'billig.ticket'
