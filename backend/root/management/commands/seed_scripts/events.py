
from django.utils import timezone

from samfundet.models import Event, EventGroup
from root.utils.samfundet_random import words


def seed():

    print("Deleting existing events...")
    Event.objects.all().delete()
    EventGroup.objects.all().delete()

    print("Creating new events...")
    for i in range(10):
        group = EventGroup()
        group.save()
        title_no, title_en = words(2, include_english=True)
        obj = Event(
            title_no=title_no,
            title_en=title_en,
            start_dt=timezone.now(),
            end_dt=timezone.now() + timezone.timedelta(hours=2),
            description_long_no=words(10),
            description_long_en=words(10),
            description_short_no=words(10),
            description_short_en=words(10),
            publish_dt=timezone.now(),
            host=words(1),
            location=words(2),
            event_group=group
        )
        obj.save()

    print(f"Created {len(Event.objects.all())} events.")


