
import random
from django.utils import timezone

from samfundet.models import Event, EventGroup
from root.utils.samfundet_random import words


def seed():

    Event.objects.all().delete()
    EventGroup.objects.all().delete()
    yield 0, "Deleted old events"

    for i in range(100):
        group = EventGroup()
        group.save()
        title_no, title_en = words(2, include_english=True)
        event_time = timezone.now() + timezone.timedelta(
            days=random.randint(-30, 30), 
            hours=random.randint(-12, 12)
        )
        obj = Event(
            title_no=title_no,
            title_en=title_en,
            start_dt=event_time,
            end_dt=event_time + timezone.timedelta(hours=random.randint(1, 5)),
            description_long_no=words(10),
            description_long_en=words(10),
            description_short_no=words(10),
            description_short_en=words(10),
            publish_dt=event_time - timezone.timedelta(days=random.randint(7, 21)),
            host=words(1),
            location=words(2),
            event_group=group
        )
        obj.save()
        yield i, f"Created event '{title_no}'"

    yield 100, f"Created {len(Event.objects.all())} events"

