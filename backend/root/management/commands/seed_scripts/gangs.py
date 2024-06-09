from __future__ import annotations

from samfundet.models.general import Gang, GangType, GangSection

# Template gangs for seeding
GANGS = {
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
}


def seed():
    # Create gang types
    for i, gang_type in enumerate(GANGS):
        gtype, _created = GangType.objects.get_or_create(title_nb=gang_type)

        # Create gangs
        for gang in GANGS[gang_type]:
            name, abbr, sections, = gang
            g, _ = Gang.objects.get_or_create(
                name_nb=name,
                name_en=name,
                abbreviation=abbr,
                webpage='https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                gang_type=gtype,
            )

            for section in sections:
                GangSection.objects.get_or_create(
                    gang_id=g.id,
                    name_nb=section,
                    name_en=section,
                )

        yield 10 + i / len(GANGS.keys()) * 90, 'Creating gangs'

    yield 100, f'Created {Gang.objects.all().count()} gangs'
