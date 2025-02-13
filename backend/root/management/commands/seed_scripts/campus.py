from __future__ import annotations

from samfundet.models.general import Campus

CAMPUS = [
    {
        'name_en': 'The Royal Norwegian Air Force Academy',
        'name_nb': 'Luftkrigsskolen',
    },
    {
        'name_en': 'Queen Maud University College',
        'name_nb': 'Dronning Mauds Minne Høgskole',
        'abbreviation': 'DMMH',
    },
    {
        'name_en': 'Norwegian School of Photography',
        'name_nb': 'Fotofagskolen',
    },
    {
        'name_en': 'Trondheim Academy of Fine Art',
        'name_nb': 'Kunstakademiet i Trondheim',
        'abbreviation': 'KIT',
    },
    {
        'name_en': 'NTNU Dragvoll',
        'name_nb': 'NTNU Dragvoll',
    },
    {
        'name_en': 'NTNU Business School',
        'name_nb': 'NTNU Handelshøyskolen',
    },
    {
        'name_en': 'NTNU Kalvskinnet',
        'name_nb': 'NTNU Kalvskinnet',
    },
    {
        'name_en': 'NTNU Øya',
        'name_nb': 'NTNU Øya',
    },
    {
        'name_en': 'NTNU Tunga',
        'name_nb': 'NTNU Tunga',
    },
    {
        'name_en': 'Trøndelag høyere yrkesfagskole',
        'name_nb': 'Trøndelag høyere yrkesfagskole',
    },
    {
        'name_en': 'Norwegian Business School',
        'name_nb': 'Handelshøyskolen BI',
        'abbreviation': 'BI',
    },
]


def seed():
    yield 0, 'Deleted old campus'

    for i, campus in enumerate(CAMPUS):
        Campus.objects.get_or_create(**campus)
        yield i / len(CAMPUS), 'Creating venues'

    yield 100, f'Created {len(Campus.objects.all())} venues'
