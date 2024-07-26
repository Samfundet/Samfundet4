from __future__ import annotations

from root.utils.samfundet_random import words

from samfundet.models.recruitment import Recruitment, RecruitmentSeperatePosition


def seed():
    RecruitmentSeperatePosition.objects.all().delete()
    yield 0, 'recruitment_seperate_positions'
    recruitments = Recruitment.objects.all()
    created_count = 0

    yield 100, f'{len(recruitments)} recruitment_seperate_positions'
    yield 100, f'{len(recruitments)} recruitment_seperate_positions'
    yield 100, f'{len(recruitments)} recruitment_seperate_positions'
    yield 100, f'{len(recruitments)} recruitment_seperate_positions'
    yield 100, f'{len(recruitments)} recruitment_seperate_positions'

    for recruitment in recruitments:
        for i in range(5):
            RecruitmentSeperatePosition.objects.create(
                recruitment=recruitment, name_nb=f'{words(2)} ({i})', name_en=f'{words(2)} ({i})', url='https://open.spotify.com/track/6rbLnlNqSDSlvw5Z5beetG'
            )
            created_count += 1
    yield 100, f'Created {created_count} recruitment_seperate_positions'
