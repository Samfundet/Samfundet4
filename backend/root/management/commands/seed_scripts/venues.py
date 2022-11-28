import random

from django.utils import timezone

from samfundet.models import Venue
from root.utils.samfundet_random import words

COUNT = 8


def seed():

    Venue.objects.all().delete()
    yield 0, "Deleted old venues"

    for i in range(COUNT):
        name = words(2)
        obj = Venue(
            name=name,
            description=words(10),
            floor=random.randint(1, 4),
            last_renovated=random.randint(1995, 2021),
            handicapped_approved=random.randint(1,3) != 1,
            responsible_crew=words(1)
        )
        obj.save()
        yield i/COUNT, f"Created venue '{name}'"

    yield 100, f"Created {len(Venue.objects.all())} venues"

