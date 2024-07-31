from __future__ import annotations

from random import sample, randint

from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication


def seed():
    yield 0, 'recruitment_interviewers'
    # Clear any existing interviewers
    for position in RecruitmentPosition.objects.all():
        position.interviewers.clear()
    yield 0, 'Cleared old interviewers'

    positions = RecruitmentPosition.objects.all()
    applicants_by_position = RecruitmentApplication.objects.values_list('recruitment_position_id', 'user_id')

    created_count = 0

    for position_index, position in enumerate(positions):
        # Get the users who have applied for this position
        applicants_for_position = set(user_id for pos_id, user_id in applicants_by_position if pos_id == position.id)
        # Get the list of interviewers excluding those who applied for this position
        interviewers = User.objects.exclude(id__in=applicants_for_position)

        available_interviewers = list(interviewers)
        if len(available_interviewers) < 3:
            print(f'Skipping position {position.id} due to insufficient interviewers')
            continue  # Skip this position if there are not enough interviewers

        # Select 3-6 random interviewers for each position
        num_interviewers = randint(3, min(6, len(available_interviewers)))
        selected_interviewers = sample(available_interviewers, num_interviewers)

        # Assign interviewers to the position
        position.interviewers.set(selected_interviewers)
        created_count += num_interviewers

        yield (position_index + 1) / len(positions), 'recruitment_interviewers'

    yield 100, f'Assigned {created_count} interviewers to recruitment positions'
