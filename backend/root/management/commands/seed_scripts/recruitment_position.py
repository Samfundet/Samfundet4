from __future__ import annotations

from random import sample, choice

from root.utils.samfundet_random import words

from samfundet.models.general import Gang, GangSection
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
}


def generate_tags(position_type: str, num_tags: int = 3) -> str:
    """Generate a comma-separated string of tags for a position"""
    # Get base tags for the position type
    base_tags = POSITION_TYPES[position_type]['tags']
    # Select random number of tags (2-4)
    selected_tags = sample(base_tags, min(num_tags, len(base_tags)))
    return ','.join(selected_tags)


def generate_position_data(gang: Gang, recruitment: Recruitment, position_index: int, position_type: str, section: GangSection = None) -> dict:
    """Generate data for a single position"""
    name_prefix = POSITION_TYPES[position_type]['name_prefix']

    # Construct position name based on whether it has a section or not
    if section:
        # For section positions, add a clear identifier
        name_nb = f'{gang.abbreviation or gang.name_nb[:3]} {section.name_nb} {name_prefix} {position_index}'
        name_en = f'{gang.abbreviation or gang.name_en[:3]} {section.name_en or section.name_nb} {name_prefix} {position_index}'
        return {
            'name_nb': f'{name_nb} (Section)',
            'name_en': f'{name_en} (Section)',
            'short_description_nb': words(3),
            'short_description_en': words(3),
            'long_description_nb': words(20),
            'long_description_en': words(20),
            'is_funksjonaer_position': choice([True, False]),
            'default_application_letter_nb': 'Default Application Letter NB',
            'default_application_letter_en': 'Default Application Letter EN',
            'section': section,  # Only include section
            'recruitment': recruitment,
            'tags': generate_tags(position_type),
        }
    else:
        # For gang positions, add a clear identifier
        name_nb = f'{gang.abbreviation or gang.name_nb[:3]} {name_prefix} {position_index}'
        name_en = f'{gang.abbreviation or gang.name_en[:3]} {name_prefix} {position_index}'
        return {
            'name_nb': f'{name_nb} (Gang)',
            'name_en': f'{name_en} (Gang)',
            'short_description_nb': words(3),
            'short_description_en': words(3),
            'long_description_nb': words(20),
            'long_description_en': words(20),
            'is_funksjonaer_position': choice([True, False]),
            'default_application_letter_nb': 'Default Application Letter NB',
            'default_application_letter_en': 'Default Application Letter EN',
            'gang': gang,  # Only include gang
            'recruitment': recruitment,
            'tags': generate_tags(position_type),
        }


def seed():
    yield 0, 'recruitment_positions'
    # Delete all existing recruitment positions
    RecruitmentPosition.objects.all().delete()
    yield 10, 'Deleted old recruitmentpositions'

    # Get all gangs and all recruitments
    gangs = Gang.objects.all()
    recruitments = Recruitment.objects.all()

    if not recruitments:
        yield 100, 'No recruitments found, nothing to seed'
        return

    total_combinations = len(gangs) * len(recruitments)
    created_count = 0
    combination_index = 0

    # Process each gang for each recruitment period
    for recruitment in recruitments:
        for gang in gangs:
            # Get all sections for this gang
            gang_sections = list(GangSection.objects.filter(gang=gang))

            # Create 2 positions owned by the gang (all gangs get these)
            position_types = sample(list(POSITION_TYPES.keys()), 2)
            for i, position_type in enumerate(position_types):
                position_data = generate_position_data(gang=gang, recruitment=recruitment, position_index=i + 1, position_type=position_type)

                # Create the position
                try:
                    # Use create instead of get_or_create to ensure we always make a new position
                    position = RecruitmentPosition.objects.create(**position_data)
                    created_count += 1
                except Exception as e:
                    yield 50, f'Warning: Could not create gang position {i + 1} for gang {gang.name_nb}: {str(e)}'

            # If this gang has sections, create 2 more positions owned by sections
            if gang_sections:
                # If there are multiple sections, choose 1-2 different sections
                sections_to_use = sample(gang_sections, min(2, len(gang_sections)))

                # If only one section is available, use it twice (with different position types)
                if len(sections_to_use) == 1:
                    sections_to_use = [sections_to_use[0], sections_to_use[0]]

                # Only proceed if we have sections to use
                if sections_to_use:
                    position_types = sample(list(POSITION_TYPES.keys()), 2)

                    for i, (section, position_type) in enumerate(zip(sections_to_use, position_types)):
                        position_data = generate_position_data(
                            gang=gang,
                            recruitment=recruitment,
                            position_index=i + 1,  # Use separate indices for section positions
                            position_type=position_type,
                            section=section,
                        )

                        # Create the position
                        try:
                            # Use create instead of get_or_create to ensure we always make a new position
                            position = RecruitmentPosition.objects.create(**position_data)
                            created_count += 1
                        except Exception as e:
                            yield 75, f'Warning: Could not create section position {i + 1} for section {section.name_nb}: {str(e)}'

            # Report progress
            combination_index += 1
            progress = (combination_index / total_combinations) * 90
            yield progress, f'Processed {combination_index}/{total_combinations} gang-recruitment combinations'

    # Verify results
    gang_positions_by_recruitment = {}
    section_positions_by_recruitment = {}

    # Count positions for each gang by recruitment
    for position in RecruitmentPosition.objects.all():
        recruitment_id = position.recruitment.id

        if recruitment_id not in gang_positions_by_recruitment:
            gang_positions_by_recruitment[recruitment_id] = {}

        if recruitment_id not in section_positions_by_recruitment:
            section_positions_by_recruitment[recruitment_id] = {}

        if position.gang:
            gang_id = position.gang.id
            if gang_id not in gang_positions_by_recruitment[recruitment_id]:
                gang_positions_by_recruitment[recruitment_id][gang_id] = 0
            gang_positions_by_recruitment[recruitment_id][gang_id] += 1

        elif position.section:
            section_gang_id = position.section.gang.id
            if section_gang_id not in section_positions_by_recruitment[recruitment_id]:
                section_positions_by_recruitment[recruitment_id][section_gang_id] = 0
            section_positions_by_recruitment[recruitment_id][section_gang_id] += 1

    # Count gangs with correct position distribution for each recruitment
    perfect_gangs = 0
    total_gang_recruitment_pairs = 0

    for recruitment in recruitments:
        recruitment_id = recruitment.id

        if recruitment_id not in gang_positions_by_recruitment:
            continue

        for gang in gangs:
            gang_id = gang.id
            total_gang_recruitment_pairs += 1

            # Get counts
            gang_positions = gang_positions_by_recruitment[recruitment_id].get(gang_id, 0)
            section_positions = section_positions_by_recruitment[recruitment_id].get(gang_id, 0)

            # Check if gang has sections
            has_sections = GangSection.objects.filter(gang_id=gang_id).exists()

            if has_sections and gang_positions == 2 and section_positions == 2:
                perfect_gangs += 1
            elif not has_sections and gang_positions == 2 and section_positions == 0:
                perfect_gangs += 1

    yield (
        100,
        f'Created {created_count} recruitment positions. {perfect_gangs}/{total_gang_recruitment_pairs} gang-recruitment pairs have the correct position distribution.',
    )
