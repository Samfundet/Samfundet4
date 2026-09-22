from __future__ import annotations

from samfundet.organization.models import Gang, GangType, GangSection, Organization

# Template gangs for seeding
# Organization -> Gang type -> Gangs -> Sections
GANGS = {
    'Samfundet': [
        {
            'title_nb': 'Arrangerende',
            'title_en': 'Organizing',
            'gangs': [
                ('Kulturutvalget', 'KU', []),
                ('Lørdagskomiteen', 'LØK', []),
                ('Klubbstyret', 'KLST', []),
            ],
        },
        {
            'title_nb': 'Drift',
            'title_en': 'Operations',
            'gangs': [
                (
                    'Markedsføringsgjengen',
                    'MG',
                    [
                        'Web',
                        'Layout',
                        'Info',
                        'Marked',
                        'Redaksjonen',
                        'STØNT',
                        'Video',
                    ],
                ),
                ('Fotogjengen', 'FG', []),
                ('Diversegjengen', 'DG', []),
                ('Forsterkerkomiteen', 'FK', []),
                ('Regi', None, []),
                ('Videokomiteen', 'VK', []),
            ],
        },
        {
            'title_nb': 'Kunstneriske',
            'title_en': 'Artistic',
            'gangs': [
                ('Studentersamfundets interne teater', 'SIT', []),
                ('Studentersamfundets Symfoniorkester', 'Symforch', []),
                ('Strindens promenadeorkester', 'SPO', []),
                ('Pirum', None, []),
                ('Candiss', None, []),
            ],
        },
        {
            'title_nb': 'Styrende',
            'title_en': 'Governing',
            'gangs': [
                ('Finansstyret', 'FS', []),
                ('Styret', None, []),
                ('Rådet', None, []),
            ],
        },
    ],
    'UKA': [
        {
            'title_nb': '',
            'title_en': '',
            'gangs': [
                ('Admin', None, ['Digital Innovasjon', 'HMS', 'HR', 'ITK', 'Logistikk', 'Velferd']),
                ('Arena', None, ['Arrangement', 'Baccarat', 'Serveringen', 'Telt', 'Vertskapet Dødens Dal']),
                ('Drift', None, ['Byggeprosjektet', 'KSG', 'Selskap', 'Vertskapet Huset']),
                ('Kultur', None, ['Event', 'FK', 'HusU', 'Regi', 'Revy', 'SaSp', 'VK']),
                ('PR', None, ['Film og Foto', 'Grafikken', 'Markedsføringen', 'Næringsliv', 'Presse', 'UKEsenderen', 'Profileringen']),
                ('Økonomi', None, ['Budsjett', 'Regnskap', 'Salget']),
            ],
        }
    ],
    'ISFiT': [
        {
            'title_nb': '',
            'title_en': '',
            'gangs': [
                ('Admin', None, []),
                ('Communication', None, []),
                ('Student Peace Prize', 'SPP', []),
                ('Culture', None, []),
                ('Participants', None, []),
                ('Organizational Resources', 'OR', []),
                ('Human Resources', 'HR', []),
            ],
        }
    ],
}


def seed():  # noqa: C901
    total_gangs = sum(len(gang_type['gangs']) for org in GANGS.values() for gang_type in org)
    created_count = 0

    yield 0, 'Creating gangs'

    for org_name, org_data in GANGS.items():
        organization = Organization.objects.get(name=org_name)

        for gang_type in org_data:
            gtype = None
            if gang_type['title_nb'] != '':
                gtype, _ = GangType.objects.get_or_create(
                    title_nb=gang_type['title_nb'],
                    title_en=gang_type['title_en'],
                    organization=organization,
                )

            for gang in gang_type['gangs']:
                name, abbr, sections = gang
                g, _ = Gang.objects.get_or_create(
                    name_nb=name,
                    name_en=name,
                    abbreviation=abbr,
                    webpage='https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    gang_type=gtype,
                    organization=organization,
                )

                for section in sections:
                    GangSection.objects.get_or_create(
                        gang_id=g.id,
                        name_nb=section,
                        name_en=section,
                    )

                created_count += 1
                yield created_count / total_gangs * 100, 'Creating gangs'

    yield 100, f'Created {Gang.objects.all().count()} gangs'
