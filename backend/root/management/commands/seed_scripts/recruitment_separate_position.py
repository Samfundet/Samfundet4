from __future__ import annotations

from root.utils.samfundet_random import words

from samfundet.models.recruitment import Recruitment, RecruitmentSeparatePosition


def seed():
    RecruitmentSeparatePosition.objects.all().delete()
    yield 0, 'recruitment_separate_positions'
    recruitments = Recruitment.objects.all()
    created_count = 0

    yield 100, f'{len(recruitments)} recruitment_separate_positions'

    for recruitment in recruitments:
        for i in range(5):
            RecruitmentSeparatePosition.objects.create(
                recruitment=recruitment,
                name_nb=f'{words(2)} ({i})',
                name_en=f'{words(2)} ({i})',
                description_en=f'{words(5)}',
                description_nb=f'{words(5)}',
                url='https://open.spotify.com/track/6rbLnlNqSDSlvw5Z5beetG',
            )
            created_count += 1
    yield 100, f'Created {created_count} recruitment_separate_positions'
