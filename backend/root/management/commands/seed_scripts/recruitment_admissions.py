from __future__ import annotations

from random import randint

from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentAdmission

# Some example data to use for the new RecruitmentAdmission instances
ADMISSION_DATA = {
    'admission_text': 'This is the admission text',
    'applicant_priority': 0,
    'recruiter_priority': 0,
    'recruiter_status': 0,
}


def seed():
    yield 0, 'recruitment_admissions'
    positions = RecruitmentPosition.objects.all()
    users = User.objects.all()
    created_count = 0
    admissions_to_create = []

    for position_index, position in enumerate(positions):
        for _ in range(randint(1, 15)):  # Create between 1 and 15 instances for each position
            admission_data = ADMISSION_DATA.copy()
            admission_data.update(
                {
                    'recruitment_position': position,
                    'recruitment': position.recruitment,
                    'user': users[randint(0, len(users) - 1)],  # random user from all users
                }
            )
            admissions_to_create.append(RecruitmentAdmission(**admission_data))
            created_count += 1

        yield (position_index + 1) / len(positions), 'recruitment_admissions'

    RecruitmentAdmission.objects.bulk_create(admissions_to_create)

    yield 100, f'Created {created_count} recruitment_admissions'
