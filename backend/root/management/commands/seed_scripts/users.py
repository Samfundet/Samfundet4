from __future__ import annotations

import os
import random

from django.db import transaction
from django.contrib.auth.hashers import make_password

from root.constants import Environment

from samfundet.models.general import User, Campus

ENV = os.environ.get('ENV', Environment.DEV)

# Keep existing test users
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


class UserGenerator:
    BATCH_SIZE = 500  # Increased batch size
    CHARS_MAP = {'æ': 'ae', 'ø': 'o', 'å': 'a', 'Æ': 'ae', 'Ø': 'o', 'Å': 'a'}

    # Common Norwegian first and last names - moved outside to avoid recreating in each instance
    FIRST_NAMES = [
        'Ole',
        'Lars',
        'Anders',
        'Magnus',
        'Erik',
        'Jonas',
        'Henrik',
        'Martin',
        'Andreas',
        'Kristian',
        'Thomas',
        'Daniel',
        'Marius',
        'Alexander',
        'Johan',
        'Håkon',
        'Fredrik',
        'Christian',
        'Mathias',
        'Kristoffer',
        'Emil',
        'Adrian',
        'Sebastian',
        'Tobias',
        'Simon',
        'Markus',
        'Espen',
        'Sindre',
        'Sander',
        'Emma',
        'Nora',
        'Ida',
        'Sara',
        'Maria',
        'Anna',
        'Ingrid',
        'Julie',
        'Emilie',
        'Hanna',
        'Marie',
        'Sofie',
        'Thea',
        'Malin',
        'Andrea',
        'Kristine',
        'Marte',
        'Silje',
        'Line',
        'Camilla',
        'Martine',
        'Victoria',
        'Elisabeth',
        'Karoline',
        'Caroline',
        'Marianne',
        'Astrid',
        'Aurora',
    ]

    LAST_NAMES = [
        'Hansen',
        'Johansen',
        'Olsen',
        'Larsen',
        'Andersen',
        'Pedersen',
        'Nilsen',
        'Kristiansen',
        'Jensen',
        'Karlsen',
        'Johnsen',
        'Pettersen',
        'Eriksen',
        'Berg',
        'Haugen',
        'Hagen',
        'Johannessen',
        'Andreassen',
        'Jacobsen',
        'Dahl',
        'Jørgensen',
        'Henriksen',
        'Lund',
        'Halvorsen',
        'Sørensen',
        'Jakobsen',
        'Moen',
        'Gundersen',
        'Iversen',
        'Strand',
        'Solberg',
        'Svendsen',
        'Eide',
        'Knutsen',
        'Martinsen',
        'Paulsen',
        'Bakken',
        'Kristoffersen',
        'Mathisen',
        'Gregersen',
        'Rønning',
        'Isaksen',
    ]

    EMAIL_DOMAINS = ['mg-web.no', 'samfundet.no', 'test.samfundet.no']

    def __init__(self):
        # Pre-compute all existing usernames and emails in one query
        existing_users = User.objects.values_list('username', 'email')
        self.used_usernames: set[str] = {user[0] for user in existing_users}
        self.used_emails: set[str] = {user[1] for user in existing_users}

        # Pre-hash the default password
        self.hashed_password = make_password('passord')

        # Pre-normalize all first and last names
        self.normalized_first_names = [(name, self._normalize_string(name)) for name in self.FIRST_NAMES]
        self.normalized_last_names = [(name, self._normalize_string(name)) for name in self.LAST_NAMES]

    def _normalize_string(self, text: str) -> str:
        """Remove Norwegian special characters."""
        for old, new in self.CHARS_MAP.items():
            text = text.replace(old, new)
        return text.lower()

    def _generate_username_email(self, firstname_norm: str, lastname_norm: str) -> tuple[str, str]:
        """Generate unique username and email."""
        base = f'{firstname_norm[:random.randint(3, 4)]}{lastname_norm[:random.randint(2, 3)]}'
        counter = 0

        while True:
            username = f'{base}{counter if counter else ""}'
            email = f'{username}@{random.choice(self.EMAIL_DOMAINS)}'

            if username not in self.used_usernames and email not in self.used_emails:
                self.used_usernames.add(username)
                self.used_emails.add(email)
                return username, email
            counter += 1

    def generate_users_batch(self, count: int, campus_list: list[Campus], is_superuser: bool = False) -> list[User]:
        """Generate a batch of User objects efficiently."""
        users = []
        for _ in range(count):
            firstname, firstname_norm = random.choice(self.normalized_first_names)
            lastname, lastname_norm = random.choice(self.normalized_last_names)
            username, email = self._generate_username_email(firstname_norm, lastname_norm)

            users.append(
                User(
                    username=username,
                    email=email,
                    password=self.hashed_password,  # Use pre-hashed password
                    first_name=firstname,
                    last_name=lastname,
                    is_superuser=is_superuser,
                    campus=random.choice(campus_list),
                )
            )
        return users


def seed():
    generator = UserGenerator()
    campus_list = list(Campus.objects.all())
    anonymous_user = User.get_anonymous()

    # Delete existing users efficiently
    with transaction.atomic():
        User.objects.filter(is_superuser=False).exclude(id=anonymous_user.id).delete()
        yield 0, 'Deleted existing non-superusers'

        # Calculate total users needed and create them in larger batches
        total_users_needed = 1500
        users_created = 0

        # Create test users first
        test_users = []
        hashed_password = make_password('Django123')  # Hash password once

        for username, firstname, lastname in TEST_USERS:
            if username not in generator.used_usernames:
                email = f'{username}@mg-web.no'
                test_users.append(
                    User(
                        username=username,
                        email=email,
                        password=hashed_password,
                        first_name=firstname,
                        last_name=lastname,
                        is_superuser=(ENV == Environment.DEV),
                        campus=random.choice(campus_list),
                    )
                )
                generator.used_usernames.add(username)
                generator.used_emails.add(email)

        if test_users:
            User.objects.bulk_create(test_users)
            users_created += len(test_users)
            yield users_created / total_users_needed * 100, f'Created {len(test_users)} test users'

        # Create remaining users in larger batches
        remaining_users = total_users_needed - users_created
        while remaining_users > 0:
            batch_size = min(UserGenerator.BATCH_SIZE, remaining_users)
            user_batch = generator.generate_users_batch(batch_size, campus_list)
            User.objects.bulk_create(user_batch)

            users_created += batch_size
            remaining_users -= batch_size
            yield users_created / total_users_needed * 100, f'Created {users_created} users'

    yield 100, f'Created {users_created} users total'
