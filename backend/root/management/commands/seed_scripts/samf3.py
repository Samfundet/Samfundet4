from __future__ import annotations
import csv
import multiprocessing
import os.path
from typing import Iterator

from django.core.files.images import ImageFile
from django.db import transaction
from django.utils.timezone import make_aware
from django.utils import dateparse

from samfundet.models.event import Event
from samfundet.models.model_choices import EventAgeRestriction, EventCategory, EventTicketType, EventStatus
from samfundet.models.general import Image

BASE_IMAGE_PATH = os.path.join(os.path.dirname(__file__), 'seed_samf3')
BASE_IMAGE_PATH = os.path.join(BASE_IMAGE_PATH, 'images')

# Maps old samf categories to new samf4 categories
SAMF3_CATEGORIES = {
    # Samf meeting
    'party_meeting': EventCategory.SAMFUNDET_MEETING,
    'samfundet_meeting': EventCategory.SAMFUNDET_MEETING,
    # Quiz, lecture, debate
    'course': EventCategory.LECTURE,
    'debate_event': EventCategory.DEBATE,
    'quiz': EventCategory.QUIZ,
    # Concert
    'concert': EventCategory.CONCERT,
    'dj': EventCategory.CONCERT,
    'performance': EventCategory.CONCERT,
    'music': EventCategory.CONCERT,
    # Other
    'movie': EventCategory.OTHER,
    'happening': EventCategory.OTHER,
    'art': EventCategory.OTHER,
    'theme_party': EventCategory.OTHER,
    'theater': EventCategory.OTHER,
    'meeting': EventCategory.OTHER,
    'excenteraften': EventCategory.OTHER,
    'show': EventCategory.OTHER,
    'uka_event': EventCategory.OTHER,
    'football_match': EventCategory.OTHER,
}


def load_image(image_name) -> Image | None:
    if image_name is None:
        return None

    image_path = os.path.join(BASE_IMAGE_PATH, image_name)
    if not os.path.exists(image_path):
        return None

    with open(image_path, 'rb') as image:
        file = ImageFile(image, name=image_name)
        image = Image.objects.create(title=f'samf3-{image_name}', image=file)

    return image


# Parse a row
def add_event(image_csv, row) -> Event | None:
    image_name = get_image_path_for_event(image_csv, row)
    image = load_image(image_name)
    if not image:
        return None
    # Date format in samf3: '2023-04-26 18:00:00'
    publish_dt = make_aware(dateparse.parse_datetime(row['publication_time']))
    start_dt = make_aware(dateparse.parse_datetime(row['non_billig_start_time']))
    category = SAMF3_CATEGORIES[row['event_type']]
    return Event(
        title_nb=row['non_billig_title_no'],
        title_en=row['title_en'],
        description_short_nb=row['short_description_no'],
        description_short_en=row['short_description_en'],
        description_long_nb=row['long_description_no'],
        description_long_en=row['long_description_en'],
        duration=int(row['duration']),
        location=f"Samf3 Area<{row['organizer_id']}>",
        age_restriction=EventAgeRestriction.NO_RESTRICTION,  # TODO
        category=category,
        image=image,
        host=f"Samf3 Organizer<{row['organizer_id']}>",
        start_dt=start_dt,
        publish_dt=publish_dt,
        event_group=None,
        capacity=10,  # Not a part of Samf3
        ticket_type=EventTicketType.INCLUDED,  # TODO
        status=EventStatus.ACTIVE,  # TODO
    )


def image_to_fname(image_dict) -> str:
    name = image_dict['image_file_file_name']
    img_id = image_dict['id']
    return f'{img_id}_{name}'


def get_image_path_for_event(image_csv, event):
    for img in image_csv:
        if img['id'] == event['image_id']:
            return image_to_fname(img)
    return None


# Parse rows
def seed() -> Iterator[tuple[int, str]]:

    # Delete old
    with transaction.atomic():
        Event.objects.all().delete()
    yield 1, 'Deleted old events'

    # CSV paths
    root_path = os.path.join(os.path.dirname(__file__), 'seed_samf3')
    event_path = os.path.join(root_path, 'samf3_events.csv')
    image_path = os.path.join(root_path, 'samf3_images.csv')

    # Read files
    chunk_size = 30
    max_events = 30000
    with open(event_path, 'r') as event_file:
        with open(image_path, 'r') as image_file:
            events = list(reversed(list(csv.DictReader(event_file))))
            events = events[0:min(max_events, len(events))]
            images = list(csv.DictReader(image_file))
            event_models = []

            # Pool parallel
            pool = multiprocessing.Pool(10)

            for chunk in range(len(events) // chunk_size):
                start = chunk * chunk_size
                events_in_chunk = events[start:min(start + chunk_size, len(events))]
                jobs = [(images, event) for event in events_in_chunk]
                models = pool.starmap(add_event, jobs)
                models = [e for e in models if e is not None]
                event_models.extend(models)

                progress = len(event_models) / len(events) * 100
                yield progress, f'Converted {len(event_models)}/{len(events)} events'

                # Break early
                if len(event_models) >= max_events:
                    break

            # Save django models
            Event.objects.bulk_create(event_models)
            yield 100, f'Saved {len(event_models)} samf3 events'
