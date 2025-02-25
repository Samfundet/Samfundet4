from __future__ import annotations

from django.utils import timezone

from samfundet.models.general import Organization
from samfundet.models.recruitment import Recruitment

recruitments = [
    {
        'name_nb': 'Aktivt opptak',
        'name_en': 'Active Recruitment',
        'visible_from': timezone.now(),
        'shown_application_deadline': timezone.now() + timezone.timedelta(days=9),
        'actual_application_deadline': timezone.now() + timezone.timedelta(days=10),
        'reprioritization_deadline_for_applicant': timezone.now() + timezone.timedelta(days=11),
        'reprioritization_deadline_for_groups': timezone.now() + timezone.timedelta(days=12),
        'promo_media': 'x4dzJ8z1j5M',
        'reprioritization_deadline_for_gangs': timezone.now() + timezone.timedelta(days=12),
    },
    {
        'name_nb': 'Tidligere opptak',
        'name_en': 'Past Recruitment',
        'visible_from': timezone.now() - timezone.timedelta(days=60),
        'shown_application_deadline': timezone.now() - timezone.timedelta(days=51),
        'actual_application_deadline': timezone.now() - timezone.timedelta(days=50),
        'reprioritization_deadline_for_applicant': timezone.now() - timezone.timedelta(days=52),
        'reprioritization_deadline_for_groups': timezone.now() - timezone.timedelta(days=53),
        'promo_media': 'x4dzJ8z1j5M',
        'reprioritization_deadline_for_gangs': timezone.now() - timezone.timedelta(days=53),
    },
    {
        'name_nb': 'Framtidig opptak',
        'name_en': 'Future Recruitment',
        'visible_from': timezone.now() - timezone.timedelta(days=60),
        'shown_application_deadline': timezone.now() - timezone.timedelta(days=51),
        'actual_application_deadline': timezone.now() - timezone.timedelta(days=50),
        'reprioritization_deadline_for_applicant': timezone.now() - timezone.timedelta(days=52),
        'reprioritization_deadline_for_groups': timezone.now() - timezone.timedelta(days=53),
        'promo_media': 'x4dzJ8z1j5M',
        'reprioritization_deadline_for_gangs': timezone.now() - timezone.timedelta(days=53),
    },
]


def seed():
    yield 0, 'recruitment'
    Recruitment.objects.all().delete()
    yield 0, 'Deleted old recruitments'
    organizations = Organization.objects.all()
    total_recruitments = len(recruitments) * len(organizations)
    created_recruitments = 0
    recruitment_objects = []

    for org in organizations:
        for recruitment_data in recruitments:
            recruitment_instance = Recruitment(
                name_nb=recruitment_data['name_nb'],
                name_en=recruitment_data['name_en'],
                organization=org,
                max_applications=None,
                visible_from=recruitment_data['visible_from'],
                shown_application_deadline=recruitment_data['shown_application_deadline'],
                actual_application_deadline=recruitment_data['actual_application_deadline'],
                reprioritization_deadline_for_applicant=recruitment_data['reprioritization_deadline_for_applicant'],
                reprioritization_deadline_for_gangs=recruitment_data['reprioritization_deadline_for_gangs'],
            )
            recruitment_objects.append(recruitment_instance)

            created_recruitments += 1
            yield (created_recruitments / total_recruitments) * 100, 'recruitment'

    # Using bulk_create to add all recruitment instances to the database
    Recruitment.objects.bulk_create(recruitment_objects)

    yield 100, f'Created {created_recruitments} recruitments'
