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
        # Create shared interview groups for this recruitment
        for i in range(3):
            RecruitmentPositionSharedInterviewGroup.objects.create(recruitment=recruitment, name_nb=f'{words(2)} {i}', name_en=f'{words(2)} {i}')
            created_count += 1

        # Get all shared groups for this recruitment
        shared_groups = list(RecruitmentPositionSharedInterviewGroup.objects.filter(recruitment=recruitment))

        # Get available positions for this recruitment
        available_positions = list(RecruitmentPosition.objects.filter(recruitment=recruitment))

        # Determine how many positions to sample (up to 6, or fewer if not enough available)
        sample_size = min(6, len(available_positions))

        # Only proceed if we have positions to work with
        if sample_size > 0:
            # Sample positions
            positions = random.sample(available_positions, sample_size)

            # Assign shared interview groups to positions
            for pos in positions:
                pos.shared_interview_group = random.choice(shared_groups)
                pos.save()

            yield 50, f'Assigned {sample_size} positions to shared interview groups for recruitment {recruitment}'
        else:
            yield 50, f'No positions available for recruitment {recruitment}, skipping shared group assignment'

    yield 100, f'Created {created_count} recruitment_position_shared_groups'
