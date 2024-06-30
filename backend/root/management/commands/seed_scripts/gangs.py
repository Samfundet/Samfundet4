from __future__ import annotations

from samfundet.models.general import Gang, GangType, GangSection, Organization

# Template gangs for seeding
GANGS = {
    'Samfundet': {
        'Arrangerende': [
            ('Kulturutvalget', 'KU', []),
            ('Lørdagskomiteen', 'LØK', []),
            ('Klubbstyret', 'KLST', []),
        ],
        'Drift': [
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
        'Kunstneriske': [
            ('Studentersamfundets interne teater', 'SIT', []),
            ('Studentersamfundets Symfoniorkester', 'Symforch', []),
            ('Strindens promenadeorkester', 'SPO', []),
            ('Pirum', None, []),
            ('Candiss', None, []),
        ],
        'Styrende': [
            ('Finansstyret', 'FS', []),
            ('Styret', None, []),
            ('Rådet', None, []),
        ],
    },
    'UKA': {
        '': [
            ('Admin', None, ['Digital Innovasjon', 'HMS', 'HR', 'ITK', 'Logistikk', 'Velferd']),
            ('Arena', None, ['Arrangement', 'Baccarat', 'Serveringen', 'Telt', 'Vertskapet Dødens Dal']),
            ('Drift', None, ['Byggeprosjektet', 'KSG', 'Selskap', 'Vertskapet Huset']),
            ('Kultur', None, ['Event', 'FK', 'HusU', 'Regi', 'Revy', 'SaSp', 'VK']),
            ('PR', None, ['Film og Foto', 'Grafikken', 'Markedsføringen', 'Næringsliv', 'Presse', 'UKEsenderen', 'Profileringen']),
            ('Økonomi', None, ['Budsjett', 'Regnskap', 'Salget']),
        ]
    },
    'ISFiT': {
        '': [
            ('Admin', None, []),
            ('Communication', None, []),
            ('Student Peace Prize', 'SPP', []),
            ('Culture', None, []),
            ('Participants', None, []),
            ('Organizational Resources', 'OR', []),
            ('Human Resources', 'HR', []),
        ]
    },
}


def seed():
    total_gangs = sum(len(gangs) for org in GANGS for gangs in GANGS[org])
    created_count = 0

    yield 0, 'Creating gangs'

    for org in GANGS:
        organization = Organization.objects.get(name=org)

        for gang_type in GANGS[org]:
            gtype = None
            if gang_type != '':
                gtype, _ = GangType.objects.get_or_create(title_nb=gang_type)

            for gang in GANGS[org][gang_type]:
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
