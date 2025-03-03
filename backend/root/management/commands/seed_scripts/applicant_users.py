from __future__ import annotations

import itertools
from collections.abc import Generator

from django.db import transaction  # type: ignore

from samfundet.models.general import User, Campus

# Number of applicant users to create
APPLICANT_COUNT = 900

DEFAULT_PASSWORD = 'passord'  # noqa: S105

APPLICANT_EMAIL_DOMAIN = 'applicant.com'

# Common Norwegian first names for realistic seed data
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

# Common Norwegian last names for realistic seed data
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


def get_name_parts(first_name: str, last_name: str) -> tuple[str, str]:
    """
    Get consistent name parts for username creation.

    Returns:
        Tuple of (first_part, last_part) for username construction
    """
    first_part = first_name.lower()[:3]
    last_part = last_name.lower()[:3]
    return first_part, last_part


def generate_applicant_username(first_name: str, last_name: str, counter: int = 0) -> str:
    """
    Generate a predictable username for an applicant based on name.
    Add counter only if needed for uniqueness.

    Returns:
        A consistent, predictable username for the applicant
    """
    first_part, last_part = get_name_parts(first_name, last_name)
    if counter == 0:
        return f'{first_part}{last_part}'
    return f'{first_part}{last_part}{counter}'


def get_predictable_name_combination(index: int) -> tuple[str, str]:
    """
    Get a predictable combination of first and last name based on index.


    Returns:
        Tuple of (first_name, last_name)
    """
    # Calculate how many combinations we can make
    total_combinations = len(FIRST_NAMES) * len(LAST_NAMES)

    # If index exceeds total combinations, we'll cycle through them again
    index = index % total_combinations

    # Calculate which first name and last name to use
    first_name_index = index // len(LAST_NAMES)
    last_name_index = index % len(LAST_NAMES)

    return FIRST_NAMES[first_name_index], LAST_NAMES[last_name_index]


def create_user_object(username: str, first_name: str, last_name: str, hashed_password: str, campus: Campus) -> User:
    """
    Create a User object (without saving to DB).

    Returns:
        Configured User object
    """
    return User(
        username=username,
        email=f'{username}@{APPLICANT_EMAIL_DOMAIN}',
        password=hashed_password,
        first_name=first_name,
        last_name=last_name,
        is_superuser=False,
        is_staff=False,
        campus=campus,
    )


def get_hashed_password(password: str) -> str:
    """
    Generate a hashed password using Django's password hashing.

    Returns:
        Hashed password string
    """
    temp_user = User()
    temp_user.set_password(password)
    return temp_user.password


def create_batch_of_applicants(count: int, campuses: list[Campus], start_index: int, existing_usernames: set[str]) -> list[User]:
    """
    Create a batch of applicant users with predictable name combinations.

    Returns:
        List of created User objects
    """
    # Pre-hash a password once for all users
    hashed_password = get_hashed_password(DEFAULT_PASSWORD)

    # Ensure we have at least one campus
    if not campuses:
        raise ValueError('No campuses available')

    # Use a cycle of campuses for deterministic assignment
    campus_cycle = itertools.cycle(campuses)

    users_to_create: list[User] = []

    # Generate applicants with deterministic name combinations
    for i in range(count):
        name_index = start_index + i
        first_name, last_name = get_predictable_name_combination(name_index)

        # Try to create a username, adding counter if needed for uniqueness
        base_username = generate_applicant_username(first_name, last_name)
        username = base_username
        counter = 1

        # If username exists, add counter and increment until unique
        while username in existing_usernames:
            username = generate_applicant_username(first_name, last_name, counter)
            counter += 1

        # Add new username to existing set
        existing_usernames.add(username)

        # Get next campus in cycle
        campus = next(campus_cycle)

        # Create user object (without saving to DB yet)
        user = create_user_object(username, first_name, last_name, hashed_password, campus)
        users_to_create.append(user)

    return users_to_create


def calculate_progress(total_created: int, target_count: int) -> float:
    """
    Calculate progress percentage.

    Returns:
        Progress percentage (0-100)
    """
    return (total_created / target_count) * 90


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

    # Skip deleting existing users
    yield 10, 'Starting to create applicant users'

    # Get existing usernames to avoid duplicates
    existing_usernames = set(User.objects.values_list('username', flat=True))

    # Use transaction for better performance
    with transaction.atomic():
        # Create applicants in batches for better memory management
        batch_size = 200
        total_created = 0
        name_index = 0  # Start index for name combinations

        for _i in range(0, APPLICANT_COUNT, batch_size):
            # Calculate the current batch size (last batch might be smaller)
            current_batch_size = min(batch_size, APPLICANT_COUNT - total_created)

            # Create a batch of applicants with predictable combinations
            users_batch = create_batch_of_applicants(current_batch_size, all_campuses, name_index, existing_usernames)

            # Bulk create the batch
            User.objects.bulk_create(users_batch)

            # Update progress and name index
            total_created += len(users_batch)
            name_index += len(users_batch)  # Update index for next batch
            progress = calculate_progress(total_created, APPLICANT_COUNT)
            yield progress, f'Created {total_created} of {APPLICANT_COUNT} applicant users'

    yield 100, f'Created {total_created} applicant users successfully'
