from __future__ import annotations

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

from django.db.models import QuerySet
from django.utils import timezone
from django.db import models

# ======================== #
#       Billig Event       #
# ======================== #


class BilligEvent(models.Model):
    """
    A billig event connected to information about ticket types
    and sale periods. Paid events are connected to a billig event.
    Note that this model must use billig column names.
    """

    class Meta:
        managed = False
        verbose_name = 'BilligEvent'
        verbose_name_plural = 'BilligEvents'
        db_table = 'billig.event'

    # The primary billig event id, used as foreign key in billig ticket groups
    id = models.IntegerField(null=False, blank=False, primary_key=True, db_column='event')

    # General info
    event_name = models.CharField(max_length=140, null=False, blank=False)
    sale_from = models.DateTimeField(blank=False, null=False)
    sale_to = models.DateTimeField(blank=False, null=False)
    hidden = models.BooleanField(blank=False, null=False)

    # Due to the relation in BilligTicketGroup, this model also
    # have a 'ticket_groups' field not defined here

    # ======================== #
    #       Utilities          #
    # ======================== #

    @property
    def in_sale_period(self) -> bool:
        return self.sale_from <= timezone.datetime.now() <= self.sale_to

    @staticmethod
    def get_relevant() -> QuerySet:
        # Exclude events which ended their sale more than a month ago
        # There will be a lot of events here, so very slow to get all of them
        one_month_ago = timezone.datetime.now() - timezone.timedelta(days=31)
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

    class Meta:
        managed = False
        verbose_name = 'BilligTicketGroup'
        verbose_name_plural = 'BilligTicketGroups'
        db_table = 'billig.ticket_group'

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

    # Maximum amount allowed to buy
    ticket_limit = models.PositiveIntegerField(blank=False, null=False)

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
        db_table = 'billig.price_group'

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
