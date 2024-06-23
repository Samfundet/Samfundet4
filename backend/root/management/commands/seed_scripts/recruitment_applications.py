from __future__ import annotations

from random import randint

from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication

# Some example data to use for the new RecruitmentApplication instances
APPLICATION_DATA = {
    'application_text': 'This is the application text',
    'applicant_priority': 0,
    'recruiter_priority': 0,
    'recruiter_status': 0,
}


def seed():
    yield 0, 'recruitment_applications'

    RecruitmentApplication.objects.all().delete()
    yield 0, 'Deleted old admissions'

    positions = RecruitmentPosition.objects.all()
    users = User.objects.all()
    created_count = 0

    for position_index, position in enumerate(positions):
        for _ in range(randint(0, 10)):  # Create between 0 and 5 instances for each position
            application_data = APPLICATION_DATA.copy()
            application_data.update(
                {
                    'recruitment_position': position,
                    'recruitment': position.recruitment,
                    'user': users[randint(0, len(users) - 1)],  # random user from all users
                }
            )
            _application, created = RecruitmentApplication.objects.get_or_create(**application_data)

            if created:
                created_count += 1
            yield (position_index + 1) / len(positions), 'recruitment_applications'

    yield 100, f'Created {created_count} recruitment_applications'
