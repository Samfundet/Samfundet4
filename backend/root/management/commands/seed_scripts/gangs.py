from samfundet.models.general import GangType, Gang

# Template gangs for seeding
GANGS = {
    'Arrangerende': [
        ('Kulturutvalget', 'KU'),
        ('Lørdagskomiteen', 'LØK'),
        ('Klubbstyret', 'KLST'),
    ],
    'Drift':
        [
            ('Markedsføringsgjengen', 'MG'),
            ('Fotogjengen', 'FG'),
            ('Diversegjengen', 'DG'),
            ('Forsterkerkomiteen', 'FK'),
            ('Regi', None),
            ('Videokomiteen', 'VK'),
        ],
    'Kunstneriske':
        [
            ('Studentersamfundets interne teater', 'SIT'),
            ('Studentersamfundets Symfoniorkester', 'Symforch'),
            ('Strindens promenadeorkester', 'SPO'),
            ('Pirum', None),
            ('Candiss', None),
        ],
    'Styrende': [
        ('Finansstyret', 'FS'),
        ('Styret', None),
        ('Rådet', None),
    ]
}


def seed():
    Gang.objects.all().delete()
    GangType.objects.all().delete()
    yield 10, 'Deleted old gangs'

    # Create gang types
    for i, gang_type in enumerate(GANGS):
        gtype = GangType.objects.create(title_nb=gang_type)

        # Create gangs
        for gang in GANGS[gang_type]:
            name, abbr = gang
            Gang.objects.create(
                name_nb=name,
                name_en=name,
                abbreviation=abbr,
                webpage='https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                gang_type=gtype,
            )

        yield 10 + i / len(GANGS.keys()) * 90, 'Creating gangs'

    yield 100, f'Created {Gang.objects.all().count()} gangs'
