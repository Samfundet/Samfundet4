from __future__ import annotations

from random import sample

from root.utils.samfundet_random import words

from samfundet.models.general import Gang
from samfundet.models.recruitment import Recruitment, RecruitmentPosition

# Some example data to use for the new RecruitmentPosition instances
POSITION_DATA = {
    'is_funksjonaer_position': False,
    'default_application_letter_nb': 'Default Application Letter NB',
    'default_application_letter_en': 'Default Application Letter EN',
    'tags': 'tag1,tag2',
}


def seed():
    yield 0, 'recruitment_positions'
    RecruitmentPosition.objects.all().delete()
    yield 0, 'Deleted old recruitmentpositions'

    gangs = Gang.objects.all()
    recruitments = Recruitment.objects.all()
    created_count = 0
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
                _position, created = RecruitmentPosition.objects.get_or_create(**position_data)

                if created:
                    created_count += 1
                yield (gang_index + recruitment_index / len(recruitments)) / len(gangs), 'recruitment_positions'

    yield 100, f'Created {created_count} recruitment_positions'
