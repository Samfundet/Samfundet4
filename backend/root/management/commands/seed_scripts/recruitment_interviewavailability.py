from __future__ import annotations

import datetime

from samfundet.models.recruitment import Recruitment, RecruitmentInterviewAvailability

DEFAULT_DATA = {
    'start_time': datetime.time(8, 0),
    'end_time': datetime.time(23, 30),
    'timeslot_interval': 30,
}


def seed():
    yield 0, 'recruitment_interviewavailability'
    RecruitmentInterviewAvailability.objects.all().delete()
    yield 0, 'Deleted old interview availabilities'

    recruitments = Recruitment.objects.all()
    created_count = 0

    for i, recruitment in enumerate(recruitments):
        # Default availability for each recruitment. This is what fills out the "unavailability dialog" timeslots
        data = DEFAULT_DATA.copy()
        data.update({'recruitment': recruitment, 'position': None, 'start_date': recruitment.visible_from,
                     'end_date': recruitment.shown_application_deadline})
        _, created = RecruitmentInterviewAvailability.objects.get_or_create(**data)

        if created:
            created_count += 1
        yield (i + 1) / len(recruitments), 'recruitment_interviewavailability'

    yield 100, f'Created {created_count} recruitment availabilities'
