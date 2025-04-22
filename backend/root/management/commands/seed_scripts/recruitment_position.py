from __future__ import annotations

from random import sample, randint

from django.db import transaction

from root.utils.samfundet_random import words

from samfundet.models.general import Gang
from samfundet.models.recruitment import Recruitment, RecruitmentPosition

# Define position types with their associated tags
POSITION_TYPES = {
    'technical': {
        'tags': ['webdev', 'react', 'python', 'backend', 'frontend', 'database', 'devops'],
        'name_prefix': 'Tech',
    },
    'media': {
        'tags': ['photo', 'video', 'editing', 'photoshop', 'design', 'social-media'],
        'name_prefix': 'Media',
    },
    'event': {
        'tags': ['rigge', 'lys', 'lyd', 'scene', 'event-planning', 'booking'],
        'name_prefix': 'Event',
    },
    'bar': {
        'tags': ['bartender', 'kaffe', 'service', 'customer-service', 'cash-register'],
        'name_prefix': 'Bar',
    },
    'culture': {
        'tags': ['kultur', 'musikk', 'kunst', 'teater', 'festival', 'arrangement'],
        'name_prefix': 'Culture',
    },
    'pr': {
        'tags': ['marketing', 'social-media', 'writing', 'communication', 'pr', 'design'],
        'name_prefix': 'PR',
    },
    'restaurant': {
        'tags': ['cooking', 'food-prep', 'service', 'kitchen', 'chef', 'catering', 'hygiene', 'menu-planning'],
        'name_prefix': 'Rest',
    },
    'scene': {
        'tags': ['stage-management', 'props', 'lighting', 'sound', 'scenography', 'production', 'backstage', 'rigging'],
        'name_prefix': 'Scene',
    },
    'theater': {
        'tags': ['acting', 'directing', 'dramaturgy', 'costume', 'makeup', 'script', 'performance', 'improv'],
        'name_prefix': 'Theater',
    },
}


def generate_tags(position_type: str, num_tags: int = 3) -> str:
    """Generate a comma-separated string of tags for a position"""
    # Get base tags for the position type
    base_tags = POSITION_TYPES[position_type]['tags']
    # Select random number of tags (2-4)
    selected_tags = sample(base_tags, min(num_tags, len(base_tags)))
    return ','.join(selected_tags)


def generate_position_data(gang: Gang, recruitment: Recruitment, position_index: int, position_type: str) -> dict:
    """Generate data for a single position"""
    name_prefix = POSITION_TYPES[position_type]['name_prefix']

    return {
        'name_nb': f'{gang.abbreviation} {name_prefix} {position_index}',
        'name_en': f'{gang.abbreviation} {name_prefix} {position_index}',
        'short_description_nb': words(3),
        'short_description_en': words(3),
        'long_description_nb': words(20),
        'long_description_en': words(20),
        'is_funksjonaer_position': bool(randint(0, 1)),
        'default_application_letter_nb': 'Default Application Letter NB',
        'default_application_letter_en': 'Default Application Letter EN',
        'gang': gang,
        'recruitment': recruitment,
        'tags': generate_tags(position_type),
    }


def seed():
    yield 0, 'recruitment_positions'
    RecruitmentPosition.objects.all().delete()
    yield 0, 'Deleted old recruitmentpositions'

    # Prefetch all gangs and recruitments to avoid repeated database queries
    gangs = list(Gang.objects.all())
    recruitments = list(Recruitment.objects.all())
    created_count = 0

    # Create all position objects but don't save them yet
    positions_to_create = []
    total_iterations = len(recruitments) * len(gangs)
    current_iteration = 0

    # Pre-generate all position data
    for _recruitment_index, recruitment in enumerate(recruitments):
        for _gang_index, gang in enumerate(gangs):
            # For each gang, create 2-9 positions with different types
            num_positions = randint(2, 9)
            position_types = sample(list(POSITION_TYPES.keys()), num_positions)

            for i, position_type in enumerate(position_types):
                position_data = generate_position_data(gang=gang, recruitment=recruitment, position_index=i + 1, position_type=position_type)

                # Instead of get_or_create, append to a list for bulk creation
                positions_to_create.append(position_data)

            current_iteration += 1
            progress = current_iteration / total_iterations * 80  # Report up to 80% for data generation
            yield progress, 'recruitment_positions'

    # Use bulk_create in batches to efficiently insert the records
    # Use a transaction to make this faster and more reliable
    with transaction.atomic():
        batch_size = 100  # Adjust based on your database capabilities
        for i in range(0, len(positions_to_create), batch_size):
            batch = positions_to_create[i : i + batch_size]
            # Convert dictionaries to model instances
            instances = [RecruitmentPosition(**data) for data in batch]
            created = RecruitmentPosition.objects.bulk_create(instances)
            created_count += len(created)

            progress = 80 + (i / len(positions_to_create) * 20)  # From 80% to 100%
            yield min(progress, 99), 'recruitment_positions'

    yield 100, f'Created {created_count} recruitment_positions'
