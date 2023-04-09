#
# Since events are quite complicated, all models considered a part of them
# are separated into this file. This includes eventgroups, ticket models etc.
#
# This file should not include related models such as venues or images.
#

from __future__ import annotations

import uuid
from typing import Any

from django.db import models
from django.db.models import Prefetch
from django.utils import timezone
from django.utils.translation import gettext as _

from samfundet.models.billig import BilligEvent, BilligTicketGroup
from samfundet.models.general import User, Image

# ======================== #
#      Event Group         #
# ======================== #


class EventGroup(models.Model):
    """
    Used for recurring events
    Connects multiple recurring events (e.g. the same concert two days in a row)
    Enables frontend to know about recurring events and provide tools
    for admins to edit both or links for users to see other times.
    """
    name = models.CharField(max_length=140)
    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        verbose_name = 'EventGroup'
        verbose_name_plural = 'EventGroups'


# ======================== #
#       Registration       #
#       (påmelding)        #
# ======================== #


class NonMemberEmailRegistration(models.Model):
    """
    Non-member registration for events.
    Uses a unique id to enable confirmation/cancellation of registration

    With this we can create a link 'samfundet.no/confirm_registration?id=<UUID>'
    that only the person who registered will know.
    """
    # Long unique identifier (used for email cancellation)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Email of the registered user
    # WARNING: sensitive data! Make sure this is not exposed through the API or otherwise!
    email = models.EmailField(blank=False, null=False, editable=False)


class EventRegistration(models.Model):
    """
    Used for events with registration payment type
    Stores list of registered users and emails.
    """
    # Registered users
    registered_users = models.ManyToManyField(User, blank=True)
    # Registered emails (for those not logged in/not a member)
    registered_emails = models.ManyToManyField(NonMemberEmailRegistration, blank=True)

    @property
    def count(self) -> int:
        return self.registered_users.count() + self.registered_emails.count()


# ======================== #
#      Custom Ticket       #
# ======================== #


class EventCustomTicket(models.Model):
    """
    Used for events with custom price group.
    Stores name and price of each custom ticket type.
    """
    name_nb = models.CharField(max_length=140, blank=False, null=False)
    name_en = models.CharField(max_length=140, blank=False, null=False)
    price = models.PositiveIntegerField(blank=False, null=False)


# ======================== #
#       Event Status       #
# ======================== #


class EventStatus(models.TextChoices):
    """
    Status for a given event. Deleted status
    is used to hide event without actually deleting it
    so that it can be restored if something wrong happens
    """
    ACTIVE = 'active', _('Aktiv')
    ARCHIVED = 'archived', _('Arkivert')
    CANCELED = 'cancelled', _('Avlyst')
    DELETED = 'deleted', _('Slettet')


# ======================== #
#       Ticket Type        #
# ======================== #


class EventTicketType(models.TextChoices):
    """
    Handles event ticket type.
        Included/Free - simple info shown on event
        Billig - event connected to billig payment system
        Registration - connect event to registration model (påmelding)
        Custom - connect event to custom payment list (only used to show in frontend)
    """
    INCLUDED = 'included', _('Included with entrance')
    FREE = 'free', _('Free')
    BILLIG = 'billig', _('Paid')
    REGISTRATION = 'registration', _('Free with registration')
    CUSTOM = 'custom', _('Custom')


# ======================== #
#      Age Restriction     #
# ======================== #


class EventAgeRestriction(models.TextChoices):
    NO_RESTRICTION = 'none', _('Ingen aldersgrense')
    AGE_18 = 'eighteen', _('18 år')
    AGE_20 = 'twenty', _('20 år')
    MIXED = 'mixed', _('18 år (student), 20 år (ikke-student)')


# ======================== #
#      Event Category      #
# ======================== #


class EventCategory(models.TextChoices):
    """
    Used for sorting, filtering and organizing stuff in frontend
    """
    SAMFUNDET_MEETING = 'samfundsmote', _('Samfundsmøte')
    CONCERT = 'concert', _('Konsert')
    DEBATE = 'debate', _('Debatt')
    QUIZ = 'quiz', _('Quiz')
    LECTURE = 'lecture', _('Kurs')
    OTHER = 'other', _('Annet')


# ======================== #
#     Main Event Model     #
# ======================== #


class Event(models.Model):
    """
    The primary event model. This is by far the most complex model in Samf4,
    so don't be scared if you're just starting out!

    Metadata:
        The model contains a lot of metadata such as titles, descriptions, age restrictions etc.
        This data is really only used to display information in the front end.

    EventGroup:
        Each event may have an event_group, which groups similar events together. This should be
        used for things like concerts occuring multiple times. We can use the group to show links to other times
        in the frontend, or to allow admins to edit grouped events at the same time!

    TicketType:
        The ticket type determines if the event is free/paid/requires registration etc.
        Free/included are quite simple, and just shows this info in the frontend.

        Custom, registration and billig types require more data such as which billig event is connected
        to the event or who has registered (påmelding) for the event.

    Helper functions:
        To makes common actions easier to do, e.g:
            - Prefetching many billig events (batch of many is faster)
            - Registering users/emails (påmelding) while checking that capacity
              is not exceeded and that registration is possible.
    """

    class Meta:
        verbose_name = 'Event'
        verbose_name_plural = 'Events'

    # Instances have a hidden _billig field used to store the fetched billig event.
    # This is necessary because billig cannot be a real foreign key (see below)
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._billig: BilligEvent | None = None

    # ======================== #
    #     General Metadata     #
    # ======================== #

    # Event group is used for events occurring multiple times (e.g. a concert repeating twice)
    event_group = models.ForeignKey(EventGroup, on_delete=models.PROTECT, blank=True, null=True)

    # Event status
    status = models.CharField(max_length=30, choices=EventStatus.choices, blank=False, null=False, default=EventStatus.ACTIVE)

    # Text/images etc
    title_nb = models.CharField(max_length=140, blank=False, null=False)
    title_en = models.CharField(max_length=140, blank=False, null=False)
    description_long_nb = models.TextField(blank=False, null=False)
    description_long_en = models.TextField(blank=False, null=False)
    description_short_nb = models.TextField(blank=False, null=False)
    description_short_en = models.TextField(blank=False, null=False)
    location = models.CharField(max_length=140, blank=False, null=False)
    image = models.ForeignKey(Image, on_delete=models.PROTECT, blank=False, null=False)
    host = models.CharField(max_length=140, blank=False, null=False)

    age_restriction = models.CharField(max_length=30, choices=EventAgeRestriction.choices, blank=False, null=False, default=None)
    category = models.CharField(max_length=30, choices=EventCategory.choices, blank=False, null=False, default=EventCategory.OTHER)

    # ======================== #
    #    Duration/Timestamps   #
    # ======================== #

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)
    start_dt = models.DateTimeField(blank=False, null=False)
    duration = models.PositiveIntegerField(blank=False, null=False)
    publish_dt = models.DateTimeField(blank=False, null=False)

    # ======================== #
    #      Ticket Related      #
    # ======================== #

    capacity = models.PositiveIntegerField(blank=False, null=False)
    ticket_type = models.CharField(max_length=30, choices=EventTicketType.choices, blank=False, null=False, default=EventTicketType.FREE)
    registration = models.ForeignKey(EventRegistration, blank=True, null=True, on_delete=models.PROTECT, editable=False)
    custom_tickets = models.ManyToManyField(EventCustomTicket, blank=True)

    # Billig ID used as a foreign key to the billig database
    # This cannot be a real foreign key because django currently does not support cross-db relationships
    billig_id = models.IntegerField(blank=True, null=True, unique=True)

    # ======================== #
    #    Computed Properties   #
    # ======================== #

    @property
    def total_registrations(self) -> int:
        """
        Total number of registrations made for registration type events.
        """
        if self.ticket_type == EventTicketType.REGISTRATION and self.registration:
            return self.registration.count
        return 0

    @property
    def image_url(self) -> str:
        return self.image.image.url

    @property
    def end_dt(self) -> timezone.datetime:
        return self.start_dt + timezone.timedelta(minutes=self.duration)

    @property
    def billig(self) -> BilligEvent | None:
        """
        Handles automatic fetching of billig event using the billig_id.

        The private '_billig' is used to save the event and prevent repeated database queries to billig.
        This field can also be set on many events at the same time by using prefetch_billig
        """
        if self.billig_id is None:
            return None
        if hasattr(self, '_billig'):
            return self._billig
        self._billig = BilligEvent.objects.get(event=self.billig_id)
        return self._billig

    # ======================== #
    #      Billig Helper       #
    # ======================== #

    @staticmethod
    def prefetch_billig(events: list[Event], tickets: bool = True, prices: bool = True) -> None:
        """
        Gets the billig event/ticket/prices for a list of events, and stores it in each event.billig.
        This is much faster than getting each billig event in separate queries when using `event.billig`

        Example:
            ```python
            Event.fetch_billig_events(your_events)
            if your_events[0].billig:
                print("Yay! Billig is fetched!")
            ```

        Note that if you don't need billig for any logic you don't need to
        do this because the serializer will fetch the data automatically.
        """

        # Fetch billig events for all events with billig
        events_with_billig = [e for e in events if e.ticket_type == EventTicketType.BILLIG]
        billig_ids = [int(e.billig_id) for e in events_with_billig if e.billig_id is not None]
        billig_events = BilligEvent.objects.filter(id__in=billig_ids)

        # Prefetch related tickets and prices to improve performance
        if tickets and prices:
            billig_events = billig_events.prefetch_related(Prefetch('ticket_groups', queryset=BilligTicketGroup.objects.prefetch_related('price_groups')))
        elif tickets:
            billig_events = billig_events.prefetch_related(Prefetch('ticket_groups', queryset=BilligTicketGroup.objects.all()))

        # Attach billig events to event objects (set the private _billig field)
        # This is neccessary because billig_id is not a real foreign key
        # since cross-db relationships are not currently supported in django
        for event in events_with_billig:
            for billig in billig_events:
                if event.billig_id == billig.id:
                    event._billig = billig
                    break

    # ======================== #
    #   Registration Helpers   #
    # ======================== #

    def get_or_create_registration(self) -> EventRegistration:
        """
        Gets the reservation object or creates a new one if it does not exist
        """
        if not self.registration:
            self.registration = EventRegistration.objects.create()
        return self.registration

    def register_attendant_by_email(self, email: str) -> bool:
        """
        Try to register (påmelding) by email. Returns false if event
        is not registration type or if it is full.
        """
        if self.ticket_type == EventTicketType.REGISTRATION and self.total_registrations < self.capacity:
            reg = NonMemberEmailRegistration.objects.create(email=email)
            self.get_or_create_registration().registered_emails.add(reg)
            return True
        return False

    def register_attendant_by_user(self, user: User) -> bool:
        """
        Try to register (påmelding) by user. Returns false if event
        is not registration type or if it is full.
        """
        if self.ticket_type == EventTicketType.REGISTRATION and self.total_registrations < self.capacity:
            self.get_or_create_registration().registered_users.add(user)
            return True
        return False
