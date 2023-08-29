from django.utils import timezone

from samfundet.models.general import Organization
from samfundet.models.recruitment import Recruitment

organizations = ['Samfundet', 'ISFiT', 'UKA']

recruitments = [
    {
        'name_nb': 'Aktivt opptak',
        'name_en': 'Active Recruitment',
        'visible_from': timezone.now(),
        'shown_application_deadline': timezone.now() + timezone.timedelta(days=9),
        'actual_application_deadline': timezone.now() + timezone.timedelta(days=10),
        'reprioritization_deadline_for_applicant': timezone.now() + timezone.timedelta(days=11),
        'reprioritization_deadline_for_groups': timezone.now() + timezone.timedelta(days=12),
    },
    {
        'name_nb': 'Tidligere opptak 1',
        'name_en': 'Past Recruitment 1',
        'visible_from': timezone.now() - timezone.timedelta(days=60),
        'shown_application_deadline': timezone.now() - timezone.timedelta(days=51),
        'actual_application_deadline': timezone.now() - timezone.timedelta(days=50),
        'reprioritization_deadline_for_applicant': timezone.now() - timezone.timedelta(days=52),
        'reprioritization_deadline_for_groups': timezone.now() - timezone.timedelta(days=53),
    },
    {
        'name_nb': 'Framtidig opptak 1',
        'name_en': 'Future Recruitment 1',
        'visible_from': timezone.now() - timezone.timedelta(days=60),
        'shown_application_deadline': timezone.now() - timezone.timedelta(days=51),
        'actual_application_deadline': timezone.now() - timezone.timedelta(days=50),
        'reprioritization_deadline_for_applicant': timezone.now() - timezone.timedelta(days=52),
        'reprioritization_deadline_for_groups': timezone.now() - timezone.timedelta(days=53),
    },
]


def seed():
    yield 0, 'recruitment'

    total_recruitments = len(recruitments) * len(organizations)
    created_recruitments = 0

    for org_name in organizations:
        org = Organization.objects.get(name=org_name)
        for recruitment_data in recruitments:
            Recruitment.objects.get_or_create(
                name_nb=recruitment_data['name_nb'],
                name_en=recruitment_data['name_en'],
                organization=org,
                defaults={
                    'visible_from': recruitment_data['visible_from'],
                    'shown_application_deadline': recruitment_data['shown_application_deadline'],
                    'actual_application_deadline': recruitment_data['actual_application_deadline'],
                    'reprioritization_deadline_for_applicant': recruitment_data['reprioritization_deadline_for_applicant'],
                    'reprioritization_deadline_for_groups': recruitment_data['reprioritization_deadline_for_groups'],
                }
            )
            created_recruitments += 1
            yield (created_recruitments / total_recruitments) * 100, 'recruitment'

    yield 100, f'Created {created_recruitments} recruitments'
