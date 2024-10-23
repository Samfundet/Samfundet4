from __future__ import annotations

import random
from random import sample

from django.db import transaction

from root.utils.samfundet_random import words

from samfundet.models.general import Gang
from samfundet.models.recruitment import Recruitment, RecruitmentPosition, RecruitmentPositionTag

# Some example data to use for the new RecruitmentPosition instances
POSITION_DATA = {
    'is_funksjonaer_position': False,
    'default_application_letter_nb': 'Default Application Letter NB',
    'default_application_letter_en': 'Default Application Letter EN',
}

TAGS = [
    {'name': 'web', 'color': '#33cccc'},
    {'name': 'media', 'color': '#ff6666'},
    {'name': 'scene', 'color': '#99ff66'},
    {'name': 'sikring', 'color': '#ff6600'},
    {'name': 'theGullible', 'color': '#660033'},
    {'name': 'DJ', 'color': '#000099'},
]


def create_tags() -> list:
    existing_tags = {tag.name: tag for tag in RecruitmentPositionTag.objects.all()}

    # Create or update tags with the specified color
    for tag_data in TAGS:
        tag = RecruitmentPositionTag.objects.update_or_create(name=tag_data['name'], defaults={'color': tag_data['color']})[0]
        existing_tags[tag.name] = tag

    return list(existing_tags.values())


def seed():
    yield 0, 'recruitment_positions'
    RecruitmentPosition.objects.all().delete()
    yield 0, 'Deleted old recruitment positions'

    gangs = Gang.objects.all()
    recruitments = Recruitment.objects.all()
    created_count = 0
    all_tags = create_tags()

    positions_to_create = []

    for recruitment_index, recruitment in enumerate(recruitments):
        for gang_index, gang in enumerate(sample(list(gangs), 6)):
            for i in range(2):  # Create 2 instances for each gang and recruitment
                position_data = POSITION_DATA.copy()
                position_data.update(
                    {
                        'name_nb': f'{gang.abbreviation} stilling {i}',
                        'name_en': f'{gang.abbreviation} position {i}',
                        'short_description_nb': words(3),
                        'short_description_en': words(3),
                        'long_description_nb': words(20),
                        'long_description_en': words(20),
                        'gang': gang,
                        'recruitment': recruitment,
                    }
                )
                positions_to_create.append(RecruitmentPosition(**position_data))

    with transaction.atomic():
        RecruitmentPosition.objects.bulk_create(positions_to_create)

        # Fetch created positions from the database
        created_positions = RecruitmentPosition.objects.all()

        # Create a set to track assigned tags and avoid duplicates
        position_tags_to_create = set()
        for position in created_positions:
            random_tags = random.sample(all_tags, 2)
            for tag in random_tags:
                position_tags_to_create.add((position.id, tag.name))

        # Prepare objects for bulk creation
        position_tags_to_create = [
            RecruitmentPosition.tags.through(recruitmentposition_id=pos_id, recruitmentpositiontag_id=tag_id) for pos_id, tag_id in position_tags_to_create
        ]

        # Bulk insert M2M relationships
        RecruitmentPosition.tags.through.objects.bulk_create(position_tags_to_create, ignore_conflicts=True)

    created_count = len(positions_to_create)

    yield 100, f'Created {created_count} recruitment positions'
