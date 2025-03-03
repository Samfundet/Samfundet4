from __future__ import annotations

import random
import logging
from collections.abc import Generator
from typing import List, Tuple

from django.db import transaction

from samfundet.models.general import User, Campus
from root.utils.samfundet_random import words

# Create a logger for this module
logger = logging.getLogger(__name__)

# Number of applicant users to create
APPLICANT_COUNT = 900

# Common Norwegian first names for realistic test data
FIRST_NAMES = [
    'Emma',
    'Jakob',
    'Nora',
    'Filip',
    'Ella',
    'Oliver',
    'Maja',
    'William',
    'Sofie',
    'Liam',
    'Olivia',
    'Noah',
    'Leah',
    'Theodor',
    'Ingrid',
    'Aksel',
    'Sofia',
    'Emil',
    'Emilie',
    'Lucas',
    'Sara',
    'Mathias',
    'Anna',
    'Matheo',
    'Linnea',
    'Henrik',
    'Thea',
    'Johan',
    'Amalie',
    'Oscar',
    'Julie',
    'Isak',
    'Hanna',
    'Jonas',
    'Vilde',
    'Magnus',
    'Aurora',
    'Sebastian',
    'Ida',
    'Daniel',
    'Marie',
    'Elias',
    'Hedda',
    'Alexander',
    'Eva',
    'Benjamin',
    'Oda',
    'Kristian',
    'Mia',
    'Andreas',
]

# Common Norwegian last names for realistic test data
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
    'Jacobsen',
    'Lund',
    'Halvorsen',
    'Sørensen',
    'Jakobsen',
    'Moen',
    'Gundersen',
    'Iversen',
    'Strand',
    'Solberg',
    'Martinsen',
    'Paulsen',
    'Knutsen',
    'Eide',
    'Bakken',
    'Kristoffersen',
    'Mathisen',
    'Lie',
    'Amundsen',
    'Nguyen',
    'Ruud',
    'Holm',
    'Lunde',
    'Svendsen',
    'Myklebust',
    'Tangen',
    'Solheim',
    'Berge',
    'Nygård',
    'Dahl',
    'Christensen',
    'Fossum',
    'Bakke',
    'Christiansen',
]


def generate_applicant_username(first_name: str, last_name: str) -> str:
    """
    Generate a username for an applicant based on their name.

    Args:
        first_name: First name of the applicant
        last_name: Last name of the applicant

    Returns:
        A username for the applicant
    """
    # Use first 3-5 characters from first name and last name
    first_part = first_name.lower()[: random.randint(3, 5)]
    last_part = last_name.lower()[: random.randint(3, 5)]

    # Add a random number for uniqueness
    number = random.randint(1, 9999)

    return f'{first_part}{last_part}{number}'


def generate_applicant_data() -> Tuple[str, str, str]:
    """
    Generate random applicant data.

    Returns:
        Tuple of (username, first_name, last_name)
    """
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    username = generate_applicant_username(first_name, last_name)

    return username, first_name, last_name


def create_batch_of_applicants(count: int, campuses: List[Campus]) -> List[User]:
    """
    Create a batch of applicant users.

    Args:
        count: Number of applicants to create
        campuses: List of available campuses

    Returns:
        List of created User objects
    """
    # Pre-hash a password once for all users
    temp_user = User()
    temp_user.set_password('passord')  # nosec
    hashed_password = temp_user.password

    users_to_create = []
    unique_usernames = set()

    # Generate unique applicants
    while len(users_to_create) < count:
        username, first_name, last_name = generate_applicant_data()

        # Ensure username is unique
        if username in unique_usernames:
            continue

        unique_usernames.add(username)

        # Create user object (without saving to DB yet)
        user = User(
            username=username,
            email=f'{username}@epost.no',
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            is_superuser=False,
            is_staff=False,
            campus=random.choice(campuses),
        )
        users_to_create.append(user)

    return users_to_create


def seed() -> Generator[tuple[float, str], None, None]:
    """
    Create applicant users with no roles.

    Yields:
        Tuples of (progress percentage, status message)
    """
    # Get all campuses
    all_campuses = list(Campus.objects.all())
    if not all_campuses:
        yield 0, 'Error: No campuses found. Please run campus seed first.'
        return

    # Skip deleting existing users (typically handled by other seed scripts)
    yield 10, 'Starting to create applicant users'

    # Use transaction for better performance
    with transaction.atomic():
        # Create applicants in batches for better memory management
        batch_size = 200
        total_created = 0

        for _i in range(0, APPLICANT_COUNT, batch_size):
            # Calculate the current batch size (last batch might be smaller)
            current_batch_size = min(batch_size, APPLICANT_COUNT - total_created)

            # Create a batch of applicants
            users_batch = create_batch_of_applicants(current_batch_size, all_campuses)

            # Bulk create the batch
            User.objects.bulk_create(users_batch)

            # Update progress
            total_created += len(users_batch)
            progress = (total_created / APPLICANT_COUNT) * 90
            yield progress, f'Created {total_created} of {APPLICANT_COUNT} applicant users'

    yield 100, f'Created {total_created} applicant users successfully'
