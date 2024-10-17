from __future__ import annotations

import random

from root.utils.samfundet_random import words

from samfundet.models.recruitment import Recruitment, RecruitmentPosition, RecruitmentPositionSharedInterviewGroup


def seed():
    yield 0, 'recruitment_positions_shared_interview'
    RecruitmentPositionSharedInterviewGroup.objects.all().delete()
    yield 0, 'Deleted old recruitmentpositionsharedgroup'

    recruitments = Recruitment.objects.all()
    created_count = 0
    for recruitment in recruitments:
        for i in range(3):
            RecruitmentPositionSharedInterviewGroup.objects.create(recruitment=recruitment, name_nb=f'{words(2)} {i}', name_en=f'{words(2)} {i}')
            created_count += 1
        shared_groups = list(RecruitmentPositionSharedInterviewGroup.objects.filter(recruitment=recruitment))
        positions = random.sample(list(RecruitmentPosition.objects.filter(recruitment=recruitment)), 6)
        for pos in positions:
            pos.shared_interview_group = random.choice(shared_groups)
            pos.save()

    yield 100, f'Created {created_count} recruitment_position_shared_groups'
