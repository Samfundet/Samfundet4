from __future__ import annotations

import random

from django.db import transaction
from django.utils import timezone

from root.utils.samfundet_random import words

from samfundet.models.event import (
    User,
    Event,
    Image,
    EventGroup,
    EventCategory,
    EventTicketType,
    EventCustomTicket,
    EventRegistration,
    EventAgeRestriction,
    NonMemberEmailRegistration,
)
from samfundet.models.general import Venue

# Number of events
COUNT = 100

# Event time as offset plus/minus today
DAY_RANGE = 365 // 2

# Capacity
MIN_CAPACITY = 10
MAX_CAPACITY = 300

# Chance for recurring event
# (multiple events with same event group)
RECURRING_CHANCE = 0.1

# Event categories to choose from
CATEGORIES = [
    EventCategory.SAMFUNDET_MEETING,
    EventCategory.CONCERT,
    EventCategory.DEBATE,
    EventCategory.LECTURE,
    EventCategory.QUIZ,
    EventCategory.OTHER,
]

# Ticket groups (weighted random)
# Reduces change of registration/custom types because
# seeding these is much slower. Most events are billig!
TICKET_TYPES = {
    EventTicketType.BILLIG: 10,
    EventTicketType.REGISTRATION: 1,
    EventTicketType.INCLUDED: 5,
    EventTicketType.CUSTOM: 1,
    EventTicketType.FREE: 5,
}

# Age groups
AGE_GROUPS = [
    EventAgeRestriction.NO_RESTRICTION,
    EventAgeRestriction.AGE_18,
    EventAgeRestriction.AGE_20,
    EventAgeRestriction.MIXED,
]

VENUES = Venue.objects.all()
IMAGES = Image.objects.all()


def create_event_ticket_type(capacity) -> tuple[str, dict]:
    ticket_type = random.choices(list(TICKET_TYPES.keys()), weights=list(TICKET_TYPES.values()), k=1)[0]
    ticket_type_data: dict = {}
    # Registration type, register some number of users/emails
    if ticket_type == EventTicketType.REGISTRATION:
        reg = EventRegistration.objects.create()
        # Add users
        all_users = User.objects.all()
        reg.registered_users.add(*random.choices(all_users, k=capacity // 3))
        # Add emails
        non_members = [NonMemberEmailRegistration(email=f'{words(1)}@samfundet.no') for _ in range(capacity // 3)]
        NonMemberEmailRegistration.objects.bulk_create(non_members)
        reg.registered_emails.add(*non_members)
        # Save
        ticket_type_data = {'registration': reg}
        reg.save()

    return ticket_type, ticket_type_data


def random_end_dt(start_dt):
    """
    Generate a random end time based on the start time.
    Randomly chooses between SHORT (1-5 hours) and LONG (10-15 days) durations.
    """
    # Define duration options
    event_duration_options = {'SHORT': timezone.timedelta(hours=random.uniform(1, 5)), 'LONG': timezone.timedelta(days=random.uniform(10, 15))}

    # Randomly choose between SHORT and LONG durations
    # You can adjust the weights to change the probability of each option
    duration_type = random.choice(['SHORT', 'LONG'])

    # Get the selected duration
    duration = event_duration_options[duration_type]

    return start_dt + duration


def dummy_metadata() -> dict:
    title_nb, title_en = words(2, include_english=True)
    dsc_short_nb, dsc_short_en = words(10, include_english=True)
    dsc_long_nb, dsc_long_en = words(120, include_english=True)
    return {
        'title_nb': title_nb,
        'title_en': title_en,
        'description_short_nb': dsc_short_nb,
        'description_short_en': dsc_short_en,
        'description_long_nb': dsc_long_nb,
        'description_long_en': dsc_long_en,
        'location': random.choice(VENUES).name,
        'age_restriction': random.choice(AGE_GROUPS),
        'category': random.choice(CATEGORIES),
        'image': random.choice(IMAGES),
        'host': words(1),
    }


def do_seed():  # noqa: C901
    Event.objects.all().delete()
    EventGroup.objects.all().delete()
    EventCustomTicket.objects.all().delete()
    EventRegistration.objects.all().delete()
    yield 0, 'Deleted old events'

    n_recurring = 0
    for i in range(COUNT):
        metadata = dummy_metadata()
        capacity = random.randint(MIN_CAPACITY, MAX_CAPACITY)

        # Generate start datetime
        start_dt = timezone.now() + timezone.timedelta(
            days=random.randint(-DAY_RANGE, DAY_RANGE),
            hours=random.randint(-12, 12),
            minutes=random.randint(-30, 30),
        )

        # Generate end datetime (1-5 hours after start)
        end_dt = random_end_dt(start_dt)

        # Create price group with relevant info
        ticket_type, ticket_type_data = create_event_ticket_type(capacity)

        # Small chance of recurring event
        if random.random() <= RECURRING_CHANCE:
            recurring = random.randint(2, 3)
            group = EventGroup.objects.create(name=words(1))
        else:
            recurring = 1
            group = None
        n_recurring += 1 if recurring > 1 else 0

        # Custom price group type, add some number of custom ticket types
        custom_tickets = None
        if ticket_type == EventTicketType.CUSTOM:
            custom_tickets = [
                EventCustomTicket.objects.create(
                    name_nb=f'Billett {i + 1}',
                    name_en=f'Ticket {i + 1}',
                    price=random.randint(50, 200),
                )
                for i in range(0, random.randint(2, 4))
            ]

        # Create event(s)
        for j in range(recurring):
            # Add tag to recurring titles
            metadata_this = {**metadata}
            if recurring != 1:
                tag = f' ({j + 1}/{recurring})'
                metadata_this['title_nb'] += tag
                metadata_this['title_en'] += tag

            # Add event
            recurring_offset = timezone.timedelta(days=j * 7)
            event_start_dt = start_dt + recurring_offset
            event_end_dt = end_dt + recurring_offset

            # Adjust visibility dates for recurring events
            # For recurring events, make visibility_from the same for all events in the group
            event_visibility_from_dt = event_start_dt

            # Visibility to is relative to the specific event's end time
            event_visibility_to_dt = event_end_dt

            event = Event.objects.create(
                **metadata_this,
                start_dt=event_start_dt,
                end_dt=event_end_dt,
                visibility_from_dt=event_visibility_from_dt - timezone.timedelta(days=random.randint(7, 35)),
                visibility_to_dt=event_visibility_to_dt,
                event_group=group,
                capacity=capacity,
                ticket_type=ticket_type,
                **ticket_type_data,
            )

            # Add custom ticket types
            if ticket_type == EventTicketType.CUSTOM:
                event.custom_tickets.add(*custom_tickets)

        yield int(i / COUNT * 100), 'Creating events'

    # Done!
    yield 100, f'Created {Event.objects.all().count()} events ({n_recurring} recurring)'


def seed():
    # Seed with transaction (much faster)
    with transaction.atomic():
        yield from do_seed()
