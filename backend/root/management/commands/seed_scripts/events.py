import random

from django.utils import timezone

from root.utils.samfundet_random import words
from samfundet.models import Event, EventGroup, Venue, Image

# Number of events
COUNT = 300

# Event time as offset plus/minus today
DAY_RANGE = 365 // 2

# Duration in hours
DURATION_MIN = 1
DURATION_MAX = 5

# Chance for recurring event
# (multiple events with same event group)
RECURRING_CHANCE = 0.1

# Event categories to choose from
CATEGORIES = [
    Event.Category.SAMFUNDET_MEETING,
    Event.Category.CONCERT,
    Event.Category.DEBATE,
    Event.Category.LECTURE,
    Event.Category.QUIZ,
    Event.Category.OTHER,
]


def seed():
    Event.objects.all().delete()
    EventGroup.objects.all().delete()
    yield 0, 'Deleted old events'

    venues = Venue.objects.all()
    images = Image.objects.all()
    seed_events = []

    n_recurring = 0
    for i in range(COUNT):

        # Event title and time
        title_nb, title_en = words(2, include_english=True)
        event_time = timezone.now() + timezone.timedelta(
            days=random.randint(-DAY_RANGE, DAY_RANGE),
            hours=random.randint(-12, 12),
            minutes=random.randint(-30, 30),
        )
        event_duration = random.randint(0, 180)
        event_venue = random.choice(venues)
        capacity = random.randint(0, 500)
        category = random.choice(CATEGORIES)
        image = random.choice(images)

        # Small chance of recurring event
        if random.random() <= RECURRING_CHANCE:
            recurring = random.randint(2, 3)
        else:
            recurring = 1
        n_recurring += 1 if recurring > 1 else 0
        group = EventGroup.objects.create(name=words(1))

        # Create event(s)
        for j in range(recurring):

            tag = f' ({j + 1}/{recurring})'
            if recurring == 1:
                tag = ''

            recurring_offset = timezone.timedelta(days=j * 7)
            seed_events.append(
                Event(
                    title_nb=title_nb + tag,
                    title_en=title_en + tag,
                    start_dt=event_time + recurring_offset,
                    duration=event_duration,
                    description_long_nb=words(10),
                    description_long_en=words(10),
                    description_short_nb=words(10),
                    description_short_en=words(10),
                    publish_dt=event_time + recurring_offset - timezone.timedelta(days=random.randint(7, 21)),
                    host=words(1),
                    location=event_venue.name,
                    event_group=group,
                    capacity=capacity,
                    category=category,
                    image=image
                )
            )

        yield int(i / COUNT * 100), f"Created event '{title_nb}'"

    Event.objects.bulk_create(seed_events)

    # Done!
    yield 100, f'Created {Event.objects.all().count()} events ({n_recurring} recurring)'
