from __future__ import annotations

import random

from django.db import transaction

from samfundet.models.general import Gang
from samfundet.models.recruitment import Recruitment, RecruitmentPosition, RecruitmentPositionTag

# Some example data to use for the new RecruitmentPosition instances
POSITION_DATA_1 = {
    'short_description_nb': 'Kreativ utvikler',
    'short_description_en': 'Creative Developer EN',
    'long_description_nb': 'Du vil være ansvarlig for å utvikle og implemetere kreative ideer for å forbedre våre tjenester',
    'long_description_en': 'You will be responsible for developing and implementing creative ideas to improve our services.',
    'is_funksjonaer_position': False,
    'default_admission_letter_nb': 'Standard søkandstekst...',
    'default_admission_letter_en': 'Default application text...',
}

POSITION_DATA_2 = {
    'short_description_nb': 'Event Maestro NB',
    'short_description_en': 'Event Maestro EN',
    'long_description_nb': 'Du vil orkestrere og administrere våre store hendelser, samtidig som du sørger for at alt går på skinner',
    'long_description_en': 'You will orchestrate and manage our grand events, ensuring everything runs smoothly.',
    'is_funksjonaer_position': False,
    'default_admission_letter_nb': 'Standard søkandstekst...',
    'default_admission_letter_en': 'Default application text...',
}

POSITION_DATA_3 = {
    'short_description_nb': 'Web trollmann',
    'short_description_en': 'Web Wizard',
    'long_description_nb': 'Du vil fortrylle vårt publikum med fengslende CSS på tvers av ulike nettlesere.',
    'long_description_en': 'You will enchant our audience with captivating CSS across various web-browsers.',
    'is_funksjonaer_position': True,
    'default_admission_letter_nb': 'Standard søkandstekst...',
    'default_admission_letter_en': 'Default application text...',
}

# List of mock positions data
POSITION_DATA_LIST = [POSITION_DATA_1, POSITION_DATA_2, POSITION_DATA_3]

TAGS = [
    {'name': 'web', 'color': '#33cccc'},
    {'name': 'media', 'color': '#ff6666'},
    {'name': 'scene', 'color': '#99ff66'},
    {'name': 'sikring', 'color': '#ff6600'},
    {'name': 'theGullible', 'color': '#660033'},
    {'name': 'DJ', 'color': '#000099'},
]


def seed():
    yield 0, 'recruitment_positions'
    gangs = Gang.objects.all()
    recruitments = Recruitment.objects.all()

    # Fetch all existing tags and create a dictionary with tag names as keys
    existing_tags = {tag.name: tag for tag in RecruitmentPositionTag.objects.all()}

    # Create or update tags with the specified color
    for tag_data in TAGS:
        tag, created = RecruitmentPositionTag.objects.update_or_create(name=tag_data['name'], defaults={'color': tag_data['color']})
        existing_tags[tag.name] = tag

    all_tags = list(existing_tags.values())

    positions_to_create = []

    for gang in gangs:
        number_of_positions = random.randint(1, 12)
        for recruitment in recruitments:
            for i in range(number_of_positions):
                position_data = random.choice(POSITION_DATA_LIST).copy()
                position_data.update(
                    {
                        'name_nb': f'{gang.abbreviation} stilling {i}',
                        'name_en': f'{gang.abbreviation} position {i}',
                        'gang': gang,
                        'recruitment': recruitment,
                    }
                )
                positions_to_create.append(RecruitmentPosition(**position_data))

    # Use a transaction to ensure atomicity
    with transaction.atomic():
        RecruitmentPosition.objects.bulk_create(positions_to_create)

        # Fetch created positions from the database
        created_positions = RecruitmentPosition.objects.all()

        # Create a set to track assigned tags and avoid duplicates
        position_tags_to_create = set()
        for position in created_positions:
            random_tags = random.sample(all_tags, 2)
            for tag in random_tags:
                position_tags_to_create.add((position.id, tag.id))

        # Prepare objects for bulk creation
        position_tags_to_create = [
            RecruitmentPosition.tags.through(recruitmentposition_id=pos_id, recruitmentpositiontag_id=tag_id) for pos_id, tag_id in position_tags_to_create
        ]

        # Bulk insert M2M relationships
        RecruitmentPosition.tags.through.objects.bulk_create(position_tags_to_create, ignore_conflicts=True)

    created_count = len(positions_to_create)

    yield 100, f'Created {created_count} recruitment_positions'
