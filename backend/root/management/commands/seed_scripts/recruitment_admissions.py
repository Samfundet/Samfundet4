from random import randint

from samfundet.models.recruitment import RecruitmentAdmission, RecruitmentPosition
from samfundet.models.general import User

# Some example data to use for the new RecruitmentAdmission instances
ADMISSION_DATA = {
    'admission_text': 'This is the admission text',
    'applicant_priority': 0,
    'interview_time': None,
    'interview_location': None,
    'recruiter_priority': 0,
    'recruiter_status': 0
}


def seed():
    yield 0, 'recruitment_admissions'
    positions = RecruitmentPosition.objects.all()
    users = User.objects.all()
    created_count = 0

    for position_index, position in enumerate(positions):
        for i in range(randint(0, 5)):  # Create between 0 and 5 instances for each position
            admission_data = ADMISSION_DATA.copy()
            admission_data.update(
                {
                    'recruitment_position': position,
                    'recruitment': position.recruitment,
                    'user':
                        users[randint(0,
                                      len(users) - 1)]  # random user from all users
                }
            )
            admission, created = RecruitmentAdmission.objects.get_or_create(**admission_data)

            if created:
                created_count += 1
            yield (position_index + 1) / len(positions), 'recruitment_admissions'

    yield 100, f'Created {created_count} recruitment_admissions'
