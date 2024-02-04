from __future__ import annotations

from samfundet.models.general import User

TEST_USERS = [
    ('amaliejvik', 'Amalie', 'Johansen Vik'),
    ('heidihr', 'Heidi', 'Herfindal Rasmussen'),
    ('eahoff', 'Erik', 'Hoff'),
    ('marionly', 'Marion', 'Lystad'),
    ('tiniuspre', 'Tinius', 'Prestrud'),
    ('johanggj', 'Johanne', 'Grønlien Gjedrem'),
    ('robinej', 'Robin', 'Espinosa Jelle'),
    ('snosaet', 'Snorre', 'Sæther'),
    ('simensee', 'Simen', 'Seeberg-Rommetveit'),
    ('sindrlot', 'Sindre', 'Lothe'),
    ('simenmyr', 'Simen', 'Myrrusten'),
    ('mathihaa', 'Mathias', 'Haakon Aas'),
    ('johanndy', 'Johanne', 'Dybevik'),
    ('magnuosy', 'Magnus', 'Sygard'),
    ('snorrekr', 'Snorre', 'Kristiansen'),
    ('marcusaf', 'Marcus', 'Frenje'),
    ('sigverok', 'Sigve', 'Røkenes'),
    ('emil123', 'Emil', 'Telstad'),
    ('kevinkr', 'Kevin', 'Kristiansen'),
]


def create_test_users(username, firstname, lastname):
    User.objects.create_user(
        username=username,
        email=f'{username}@mg-web.no',
        password='passord',  # nosec
        first_name=firstname,
        last_name=lastname,
    )


def seed():
    User.objects.filter(is_superuser=False).delete()
    yield 0, 'Deleted existing non-superusers'

    for i, user in enumerate(TEST_USERS):
        create_test_users(user[0], user[1], user[2])
        yield i / len(TEST_USERS), 'Creating test users'
    yield 100, f'Created {len(TEST_USERS)} test users'
