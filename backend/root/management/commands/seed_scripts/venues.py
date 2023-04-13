import random

from django.utils import timezone

from root.utils.samfundet_random import words
from samfundet.models.general import Venue

VENUES = [
    'Storsalen',
    'Bodegaen',
    'Klubben',
    'Strossa',
    'Selskapssiden',
    'Knaus',
    'Edgar',
    'Lyche',
    'Daglighallen',
    'Rundhallen',
]


def seed():
    Venue.objects.all().delete()
    yield 0, 'Deleted old venues'

    for i, name in enumerate(VENUES):
        Venue.objects.create(
            name=name,
            description=words(10),
            floor=random.randint(1, 4),
            last_renovated=timezone.now() + timezone.timedelta(days=-random.randint(30, 365 * 30)),
            handicapped_approved=random.randint(1, 3) != 1,
            responsible_crew=words(1)
        )
        yield i / len(VENUES), 'Creating venues'

    yield 100, f'Created {len(Venue.objects.all())} venues'
