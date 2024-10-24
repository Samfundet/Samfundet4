from __future__ import annotations

from random import sample, randint

from root.utils.samfundet_random import words

from samfundet.models.general import Gang
from samfundet.models.recruitment import Recruitment, RecruitmentPosition

# Expanded list of possible tags
TAGS = [
    'webdev',
    'frontend',
    'backend',
    'design',
    'foto',
    'video',
    'event',
    'pr',
    'social-media',
    'kulturformidling',
    'økonomi',
    'mat',
    'drikke',
    'teknisk',
    'lyd',
    'lys',
    'scene',
    'sikkerhet',
    'kunst',
    'musikk',
    'dans',
    'teater',
    'film',
    'festival',
    'prosjektledelse',
    'koordinering',
    'publikumskontakt',
    'markedsføring',
    'react',
    'python',
    'javascript',
    'django',
    'database',
    'ui/ux',
]

# Base position data
POSITION_DATA = {
    'is_funksjonaer_position': False,
    'default_application_letter_nb': 'Default Application Letter NB',
    'default_application_letter_en': 'Default Application Letter EN',
}


def generate_tags(num_tags: int = None) -> str:
    """Generate a random set of tags."""
    if num_tags is None:
        num_tags = randint(2, 5)
    selected_tags = sample(TAGS, min(num_tags, len(TAGS)))
    return ','.join(selected_tags)


def create_positions_for_recruitment(recruitment: Recruitment, gangs: list[Gang]) -> tuple[int, int]:
    """
    Create positions for a specific recruitment period and its organization's gangs.

    Args:
        recruitment: The recruitment period
        gangs: List of gangs belonging to the recruitment's organization

    Returns:
        tuple: (number of positions created, number of funksjonær positions created)
    """
    created_count = 0
    funksjonaer_count = 0

    # Sample a subset of gangs if there are more than 6
    selected_gangs = sample(gangs, min(6, len(gangs))) if len(gangs) > 6 else gangs

    for gang in selected_gangs:
        # Create between 4 and 15 positions for each gang
        num_positions = randint(4, 15)
        # Calculate funksjonær positions (25% of total)
        num_funksjonaer = round(num_positions * 0.25)
        funksjonaer_indices = sample(range(num_positions), num_funksjonaer)

        for i in range(num_positions):
            position_data = POSITION_DATA.copy()
            is_funksjonaer = i in funksjonaer_indices

            position_data.update(
                {
                    'name_nb': f'{gang.abbreviation} {"funksjonær" if is_funksjonaer else "stilling"} {i + 1}',
                    'name_en': f'{gang.abbreviation} {"functionary" if is_funksjonaer else "position"} {i + 1}',
                    'short_description_nb': words(3),
                    'short_description_en': words(3),
                    'long_description_nb': words(20),
                    'long_description_en': words(20),
                    'gang': gang,
                    'recruitment': recruitment,
                    'tags': generate_tags(),
                    'is_funksjonaer_position': is_funksjonaer,
                }
            )

            _, created = RecruitmentPosition.objects.get_or_create(**position_data)
            if created:
                created_count += 1
                if is_funksjonaer:
                    funksjonaer_count += 1

    return created_count, funksjonaer_count


def seed():
    yield 0, 'recruitment_positions'
    RecruitmentPosition.objects.all().delete()
    yield 0, 'Deleted old recruitmentpositions'

    recruitments = Recruitment.objects.all()
    total_created = 0
    total_funksjonaer = 0

    for recruitment_index, recruitment in enumerate(recruitments):
        # Get gangs specific to this recruitment's organization
        organization_gangs = list(Gang.objects.filter(organization=recruitment.organization))

        if organization_gangs:  # Only create positions if the organization has gangs
            created, funksjonaer = create_positions_for_recruitment(recruitment, organization_gangs)
            total_created += created
            total_funksjonaer += funksjonaer

        progress = (recruitment_index + 1) / len(recruitments) * 100
        yield min(progress, 99), f'Processing recruitment {recruitment_index + 1}/{len(recruitments)}'

    yield 100, f'Created {total_created} recruitment_positions ({total_funksjonaer} funksjonær positions)'
