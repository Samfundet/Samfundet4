from __future__ import annotations

import random
from dataclasses import dataclass
from collections.abc import Generator

from django.db import transaction  # type: ignore

from samfundet.models.role import Role, UserOrgRole, UserGangRole, UserGangSectionRole
from samfundet.models.general import Gang, User, Campus, GangSection, Organization

from .roles import (
    RAADET,
    STYRET,
    ORG_LEVEL,
    GANG_LEVEL,
    GANG_LEADER,
    GANG_MEMBER,
    REDAKSJONEN,
    EVENT_MANAGER,
    VENUE_MANAGER,
    SECTION_LEADER,
    VICE_GANG_LEADER,
    GANGSECTION_LEVEL,
    SECTION_INTERVIEWER,
    ORG_RECRUITMENT_MANAGER,
    GANG_RECRUITMENT_MANAGER,
    SECTION_RECRUITMENT_MANAGER,
)


@dataclass
class UserTypeData:
    """Data class for user type definitions."""

    roles: list[str]
    name_pattern: str
    title_nb: str
    title_en: str
    level: str
    specific_gang: str | None = None
    specific_section: str | None = None


# Define user types that are available for all organizations
# Roles across all organizations which handle recruitment, events, and venues
UNIVERSAL_USER_TYPES = {
    'org_recruitment': UserTypeData(
        roles=[ORG_RECRUITMENT_MANAGER],
        name_pattern='{org}_opptak',
        title_nb='Opptaksansvarlig',
        title_en='Recruitment Manager',
        level=ORG_LEVEL,
    ),
    'gang_recruitment': UserTypeData(
        roles=[GANG_RECRUITMENT_MANAGER],
        name_pattern='{org}_{gang}_opptak',
        title_nb='Opptaksansvarlig',
        title_en='Recruitment Manager',
        level=GANG_LEVEL,
    ),
    'section_recruitment': UserTypeData(
        roles=[SECTION_RECRUITMENT_MANAGER, SECTION_INTERVIEWER],
        name_pattern='{org}_{gang}_{section}_opptak',
        title_nb='Opptaksansvarlig',
        title_en='Recruitment-Manager',
        level=GANGSECTION_LEVEL,
    ),
    'section_recruitment_interviewer': UserTypeData(
        roles=[SECTION_INTERVIEWER, GANG_MEMBER],
        name_pattern='{org}_{gang}_{section}_interviewer',
        title_nb='Intervjuer',
        title_en='Interviewer',
        level=GANGSECTION_LEVEL,
    ),
    'event_manager': UserTypeData(
        roles=[EVENT_MANAGER],
        name_pattern='{org}_{gang}_event',
        title_nb='Arrangementsansvarlig',
        title_en='Event-Manager',
        level=GANG_LEVEL,
    ),
    'venue_manager': UserTypeData(
        roles=[VENUE_MANAGER],
        name_pattern='{org}_{gang}_venue',
        title_nb='Lokaleansvarlig',
        title_en='Venue-Manager',
        level=GANG_LEVEL,
    ),
    'gang_leader': UserTypeData(
        roles=[GANG_LEADER],
        name_pattern='{org}_{gang}_leader',
        title_nb='Gjengsjef',
        title_en='Gangleader',
        level=GANG_LEVEL,
    ),
    'vice_gang_leader': UserTypeData(
        roles=[VICE_GANG_LEADER],
        name_pattern='{org}_{gang}_vice_leader',
        title_nb='Nestleder',
        title_en='Vice-gangleader',
        level=GANG_LEVEL,
    ),
    'section_leader': UserTypeData(
        roles=[SECTION_LEADER],
        name_pattern='{org}_{gang}_{section}_section_leader',
        title_nb='Seksjonssjef',
        title_en='Sectionleader',
        level=GANGSECTION_LEVEL,
    ),
    'gang_member': UserTypeData(
        roles=[GANG_MEMBER],
        name_pattern='{org}_{gang}_intern',
        title_nb='intern',
        title_en='intern',
        level=GANG_LEVEL,
    ),
}

# Define user types that are specific to Samfundet organization
# These roles are only created for specific parts of Samfundet
SAMFUNDET_USER_TYPES = {
    'redaksjonen_org': UserTypeData(
        roles=[REDAKSJONEN + '_ORG'],  # Original REDAKSJONEN role (org level)
        name_pattern='mg_red_org_{number}',
        title_nb='Redaksjonsmedlem (Org)',
        title_en='Editorial Staff (Org)',
        level='org',
        specific_section='Redaksjonen',
    ),
    'redaksjonen_any': UserTypeData(
        roles=[REDAKSJONEN + '_ANY'],  # Level-agnostic version
        name_pattern='mg_red_any_{number}',
        title_nb='Redaksjonsmedlem (Any)',
        title_en='Editorial Staff (Any)',
        level='org',  # Initial assignment at org level, but can be reassigned anywhere
        specific_section='Redaksjonen',
    ),
    'redaksjonen_gang': UserTypeData(
        roles=[REDAKSJONEN + '_GANG'],  # Gang-specific version
        name_pattern='mg_red_gang_{number}',
        title_nb='Redaksjonsmedlem (Gang)',
        title_en='Editorial Staff (Gang)',
        level='gang',
        specific_section='Redaksjonen',
    ),
    'redaksjonen_section': UserTypeData(
        roles=[REDAKSJONEN + '_SECTION'],  # Section-specific version
        name_pattern='mg_red_section_{number}',
        title_nb='Redaksjonsmedlem (Section)',
        title_en='Editorial Staff (Section)',
        level='section',
        specific_section='Redaksjonen',
    ),
    'styret': UserTypeData(
        roles=[STYRET],
        name_pattern='styret_{number}',
        title_nb='Styremedlem',
        title_en='Board Member',
        level='org',
        specific_gang='Styret',  # Only for Samfundet's Styret
    ),
    'raadet': UserTypeData(
        roles=[RAADET],
        name_pattern='raadet_{number}',
        title_nb='Rådsmedlem',
        title_en='Council Member',
        level='org',
        specific_gang='Rådet',  # Only for Samfundet's Rådet
    ),
}


def generate_username(pattern: str, **kwargs) -> str:
    """
    Generate a unique username based on a pattern and parameters.

    Args:
        pattern: String pattern for username with placeholders
        **kwargs: Values to substitute into the pattern

    Returns:
        A formatted, sanitized username with added uniqueness
    """
    # Format the username pattern with our parameters
    username = pattern.format(**kwargs).lower()

    # Remove special characters and replace with underscores
    username = ''.join(c if c.isalnum() else '_' for c in username)

    # Remove consecutive underscores
    while '__' in username:
        username = username.replace('__', '_')

    # Remove leading/trailing underscores
    username = username.strip('_')

    # Add random number for uniqueness
    random_number = random.randint(1, 999)
    return f'{username}_{random_number}'


def prepare_username_params(
    org: Organization | None = None, gang: Gang | None = None, section: GangSection | None = None, number: int | None = None
) -> dict[str, str]:
    """
    Prepare parameters for username generation.

    Args:
        org: Organization the user belongs to
        gang: Gang the user belongs to
        section: Section the user belongs to
        number: Optional number for username generation

    Returns:
        Dictionary with formatted parameters for username generation
    """
    # Process gang identifier
    gang_identifier = ''
    if gang:
        gang_identifier = gang.abbreviation if gang.abbreviation else gang.name_nb

    # Create username parameters and ensure all values are strings
    return {
        'org': org.name.lower() if org else '',
        'gang': gang_identifier.lower() if gang_identifier else '',
        'section': section.name_nb.lower() if section else '',
        'number': str(number if number is not None else random.randint(1, 999)),
    }


def check_prerequisites() -> str | None:
    """
    Check if all prerequisites for seeding are met.

    Returns:
        Error message if prerequisites are not met, None otherwise
    """
    if Role.objects.count() == 0:
        return 'Error: No roles found. Please run roles seed first.'

    if Campus.objects.count() == 0:
        return 'Error: No campuses found. Please run campus seed first.'

    return None


def clean_existing_users() -> int:
    """
    Remove existing non-superusers while preserving the anonymous user.

    Returns:
        Number of users deleted
    """
    anonymous_user = User.get_anonymous()
    deleted_count = User.objects.filter(is_superuser=False).exclude(id=anonymous_user.id).delete()[0]
    return deleted_count


def create_user_from_type_data(type_data, username, first_name, last_name, all_campuses):
    """
    Create a User object with standardized fields based on type data.

    Args:
        type_data: UserTypeData object containing role information
        username: Generated username
        first_name: First name for the user
        last_name: Last name for the user
        all_campuses: List of available Campus objects

    Returns:
        User object ready for creation
    """
    return User(
        username=username,
        email=f'{username}@samfundet.no',
        password='!',  # Temporary unusable password
        first_name=first_name,
        last_name=last_name,
        is_superuser=False,
        campus=random.choice(all_campuses),
    )


def prepare_org_level_users(organizations, universal_user_types, all_campuses):
    """
    Prepare organization-level users for all organizations.

    Args:
        organizations: List of Organization objects
        universal_user_types: Dictionary of UserTypeData objects
        all_campuses: List of Campus objects

    Returns:
        Tuple of (users_to_create, org_roles_to_create)
    """
    users_to_create = []
    org_roles_to_create = []

    for org in organizations:
        for type_data in universal_user_types.values():
            if type_data.level == ORG_LEVEL:
                username_params = prepare_username_params(org=org)
                username = generate_username(type_data.name_pattern, **username_params)

                user = create_user_from_type_data(
                    type_data=type_data, username=username, first_name=type_data.title_nb, last_name=org.name, all_campuses=all_campuses
                )
                users_to_create.append(user)

                # Store for later role assignment
                org_roles_to_create.extend((username, role_name, org.id) for role_name in type_data.roles)

    return users_to_create, org_roles_to_create


def prepare_gang_level_users(organizations, universal_user_types, all_campuses):
    """
    Prepare gang-level users for all organizations.

    Args:
        organizations: List of Organization objects
        universal_user_types: Dictionary of UserTypeData objects
        all_campuses: List of Campus objects

    Returns:
        Tuple of (users_to_create, gang_roles_to_create)
    """
    users_to_create = []
    gang_roles_to_create = []

    for org in organizations:
        for gang in list(org.gangs.all()):
            for type_data in universal_user_types.values():
                if type_data.level == GANG_LEVEL:
                    username_params = prepare_username_params(org=org, gang=gang)
                    username = generate_username(type_data.name_pattern, **username_params)

                    user = create_user_from_type_data(
                        type_data=type_data, username=username, first_name=type_data.title_nb, last_name=gang.name_nb, all_campuses=all_campuses
                    )
                    users_to_create.append(user)

                    # Store for later role assignment
                    gang_roles_to_create.extend((username, role_name, gang.id) for role_name in type_data.roles)

    return users_to_create, gang_roles_to_create


def prepare_section_level_users(organizations, universal_user_types, gang_to_sections, all_campuses):  # noqa: C901
    """
    Prepare section-level users for all organizations.

    Args:
        organizations: List of Organization objects
        universal_user_types: Dictionary of UserTypeData objects
        gang_to_sections: Dictionary mapping gang IDs to lists of GangSection objects
        all_campuses: List of Campus objects

    Returns:
        Tuple of (users_to_create, section_roles_to_create)
    """
    users_to_create = []
    section_roles_to_create = []

    for org in organizations:
        for gang in list(org.gangs.all()):
            for section in gang_to_sections.get(gang.id, []):
                for type_data in universal_user_types.values():
                    if type_data.level == GANGSECTION_LEVEL:
                        username_params = prepare_username_params(org=org, gang=gang, section=section)
                        username = generate_username(type_data.name_pattern, **username_params)

                        user = create_user_from_type_data(
                            type_data=type_data,
                            username=username,
                            first_name=type_data.title_nb,
                            last_name=f'{gang.name_nb} - {section.name_nb}',
                            all_campuses=all_campuses,
                        )
                        users_to_create.append(user)

                        # Store for later role assignment
                        section_roles_to_create.extend((username, role_name, section.id) for role_name in type_data.roles)

    return users_to_create, section_roles_to_create


def prepare_all_universal_users(organizations, universal_user_types, gang_to_sections, all_campuses):
    """
    Prepare all universal users across all organizations, gangs, and sections.

    Args:
        organizations: List of Organization objects
        universal_user_types: Dictionary of UserTypeData objects
        gang_to_sections: Dictionary mapping gang IDs to lists of GangSection objects
        all_campuses: List of Campus objects

    Returns:
        Tuple of (users_to_create, org_roles_to_create, gang_roles_to_create, section_roles_to_create)
    """
    # Get org-level users and roles
    org_users, org_roles = prepare_org_level_users(organizations, universal_user_types, all_campuses)

    # Get gang-level users and roles
    gang_users, gang_roles = prepare_gang_level_users(organizations, universal_user_types, all_campuses)

    # Get section-level users and roles
    section_users, section_roles = prepare_section_level_users(organizations, universal_user_types, gang_to_sections, all_campuses)

    # Combine users from all levels
    all_users = org_users + gang_users + section_users

    return all_users, org_roles, gang_roles, section_roles


def prepare_samfundet_specific_users(
    samfundet_org: Organization, samfundet_user_types: dict, all_campuses: list[Campus]
) -> tuple[list[User], list[tuple[str, str, int]]]:
    """
    Prepare Samfundet-specific users with gang-specific roles like Styret and Rådet.

    Args:
        samfundet_org: The Samfundet organization object
        samfundet_user_types: Dictionary of UserTypeData objects for Samfundet-specific roles
        all_campuses: List of available Campus objects

    Returns:
        Tuple of (users_to_create, org_roles_to_create)
    """
    users_to_create = []
    org_roles_to_create: list[tuple[str, str, int]] = []

    # Handle roles for specific gangs (Styret, Rådet)
    for type_data in samfundet_user_types.values():
        if type_data.specific_gang:
            for i in range(1, 6):  # Create 5 members for each
                username_params = prepare_username_params(org=samfundet_org, number=i)
                username = generate_username(type_data.name_pattern, **username_params)

                # Create user
                user = User(
                    username=username,
                    email=f'{username}@samfundet.no',
                    password='!',  # Temporary unusable password
                    first_name=type_data.title_nb,
                    last_name=samfundet_org.name,
                    is_superuser=False,
                    campus=random.choice(all_campuses),
                )
                users_to_create.append(user)

                # Store for later role assignment
                org_roles_to_create.extend((username, role_name, samfundet_org.id) for role_name in type_data.roles)

    return users_to_create, org_roles_to_create


def prepare_redaksjonen_users(  # noqa: C901
    samfundet_org: Organization, samfundet_user_types: dict, gang_to_sections: dict[int, list[GangSection]], all_campuses: list[Campus]
) -> tuple[list[User], list[tuple[str, str, int]], list[tuple[str, str, int]], list[tuple[str, str, int]]]:
    """
    Prepare Redaksjonen-specific users with different level variant roles.

    Args:
        samfundet_org: The Samfundet organization object
        samfundet_user_types: Dictionary of UserTypeData objects for Samfundet-specific roles
        gang_to_sections: Dictionary mapping gang IDs to lists of GangSection objects
        all_campuses: List of available Campus objects

    Returns:
        Tuple of (users_to_create, org_roles_to_create, gang_roles_to_create, section_roles_to_create)
    """

    users_to_create: list[User] = []
    org_roles_to_create: list[tuple[str, str, int]] = []
    gang_roles_to_create: list[tuple[str, str, int]] = []
    section_roles_to_create: list[tuple[str, str, int]] = []

    try:
        # Find the marketing gang
        mg = next((g for g in samfundet_org.gangs.all() if g.name_nb == 'Markedsføringsgjengen'), None)
        if not mg:
            return users_to_create, org_roles_to_create, gang_roles_to_create, section_roles_to_create

        # Find the editorial section
        redaksjonen = next((s for s in gang_to_sections.get(mg.id, []) if s.name_nb == 'Redaksjonen'), None)
        if not redaksjonen:
            return users_to_create, org_roles_to_create, gang_roles_to_create, section_roles_to_create

        # Process all redaksjonen role variants
        for type_key, type_data in samfundet_user_types.items():
            if type_key.startswith('redaksjonen_') and type_data.specific_section:
                # Create users (2 per variant)
                for i in range(1, 3):  # Create 2 members for each variant
                    username_params = prepare_username_params(org=samfundet_org, gang=mg, section=redaksjonen, number=i)
                    username = generate_username(type_data.name_pattern, **username_params)

                    # Create user
                    user = User(
                        username=username,
                        email=f'{username}@samfundet.no',
                        password='!',  # Temporary unusable password
                        first_name=type_data.title_nb,
                        last_name=f'{mg.name_nb} - {redaksjonen.name_nb}',
                        is_superuser=False,
                        campus=random.choice(all_campuses),
                    )
                    users_to_create.append(user)

                    # Assign role based on its level
                    if type_data.level == ORG_LEVEL:
                        org_roles_to_create.extend((username, role_name, samfundet_org.id) for role_name in type_data.roles)
                    elif type_data.level == GANG_LEVEL:
                        gang_roles_to_create.extend((username, role_name, mg.id) for role_name in type_data.roles)
                    elif type_data.level == GANGSECTION_LEVEL:
                        section_roles_to_create.extend((username, role_name, redaksjonen.id) for role_name in type_data.roles)
    except Exception as e:
        print(f'Could not create Redaksjonen users: {str(e)}')

    return users_to_create, org_roles_to_create, gang_roles_to_create, section_roles_to_create


def seed() -> Generator[tuple[float, str], None, None]:  # noqa: C901
    """
    Create users with roles for all organizations and Samfundet-specific roles.

    This seed function creates two types of users:
    1. Universal users (recruitment, event, venue) for all organizations
    2. Samfundet-specific users (Redaksjonen, Styret, Rådet)

    Yields:
        Tuples of (progress percentage, status message)
    """
    # Check prerequisites
    prerequisite_error = check_prerequisites()
    if prerequisite_error:
        yield 0, prerequisite_error
        return

    # Preload all roles for efficient lookup
    roles = {role.name: role for role in Role.objects.all()}
    yield 0, f'Preloaded {len(roles)} roles'

    # Main transaction wrapper to speed up the entire process
    with transaction.atomic():
        # Clean existing users
        deleted_count = clean_existing_users()
        yield 10, f'Deleted {deleted_count} existing non-superusers'

        # Eagerly load all required data to minimize database hits
        all_campuses = list(Campus.objects.all())
        if not all_campuses:
            yield 100, 'No campuses found, nothing to seed'
            return

        # Prefetch all organizations with gangs
        organizations = list(Organization.objects.all().prefetch_related('gangs'))

        # Pre-fetch all GangSection objects and create a lookup by gang_id
        all_sections = list(GangSection.objects.select_related('gang').all())
        gang_to_sections: dict[int, list[GangSection]] = {}
        for section in all_sections:
            if section.gang_id not in gang_to_sections:
                gang_to_sections[section.gang_id] = []
            gang_to_sections[section.gang_id].append(section)

        if not organizations:
            yield 20, 'No organizations found, nothing to seed'
            return

        # Prepare all data for batch creation
        users_to_create: list[User] = []
        org_roles_to_create: list[tuple[str, str, int]] = []
        gang_roles_to_create: list[tuple[str, str, int]] = []
        section_roles_to_create: list[tuple[str, str, int]] = []

        yield 30, 'Preparing data for batch creation'

        # Prepare universal users for all organizations
        users_to_create, org_roles_to_create, gang_roles_to_create, section_roles_to_create = prepare_all_universal_users(
            organizations=organizations, universal_user_types=UNIVERSAL_USER_TYPES, gang_to_sections=gang_to_sections, all_campuses=all_campuses
        )

        yield 50, f'Preparing {len(users_to_create)} users'

        # Samfundet-specific roles
        samfundet_org = next((org for org in organizations if org.name == 'Samfundet'), None)
        if samfundet_org:
            # Create Styret and Rådet roles
            samfundet_users, samfundet_org_roles = prepare_samfundet_specific_users(
                samfundet_org=samfundet_org, samfundet_user_types=SAMFUNDET_USER_TYPES, all_campuses=all_campuses
            )

            users_to_create.extend(samfundet_users)
            org_roles_to_create.extend(samfundet_org_roles)

            # Handle Redaksjonen variants
            redaksjonen_users, redaksjonen_org_roles, redaksjonen_gang_roles, redaksjonen_section_roles = prepare_redaksjonen_users(
                samfundet_org=samfundet_org, samfundet_user_types=SAMFUNDET_USER_TYPES, gang_to_sections=gang_to_sections, all_campuses=all_campuses
            )

            users_to_create.extend(redaksjonen_users)
            org_roles_to_create.extend(redaksjonen_org_roles)
            gang_roles_to_create.extend(redaksjonen_gang_roles)
            section_roles_to_create.extend(redaksjonen_section_roles)

        yield 60, 'Bulk creating users'

        # Pre-compute a single hashed password to use for all users
        # This avoids expensive password hashing for each user
        temp_user = User()
        temp_user.set_password('test123')  # nosec
        hashed_password = temp_user.password

        # Set the same hashed password for all users before bulk creation
        for user in users_to_create:
            user.password = hashed_password

        # Bulk create all users at once with the pre-hashed password
        User.objects.bulk_create(users_to_create)

        # Get created users for role assignment
        usernames = [user.username for user in users_to_create]
        created_users = list(User.objects.filter(username__in=usernames))

        # Create username to user mapping for role assignment
        username_to_user = {user.username: user for user in created_users}

        yield 70, 'Users created with hashed passwords'

        yield 80, 'Creating role assignments'

        # Instead of processing one by one, use list comprehensions to build role lists more efficiently
        # Prepare and create org roles in smaller batches to avoid memory issues
        batch_size = 500
        total_org_roles_created = 0
        total_gang_roles_created = 0
        total_section_roles_created = 0

        # Process roles in batches to avoid memory pressure
        for i in range(0, len(org_roles_to_create), batch_size):
            batch = org_roles_to_create[i : i + batch_size]
            final_org_roles = [
                UserOrgRole(user=username_to_user.get(username), role=roles.get(role_name), obj_id=org_id)
                for username, role_name, org_id in batch
                if username_to_user.get(username) and roles.get(role_name)
            ]

            if final_org_roles:
                UserOrgRole.objects.bulk_create(final_org_roles)
                total_org_roles_created += len(final_org_roles)

            if i % 1000 == 0 and i > 0:
                yield 80 + (i / len(org_roles_to_create) * 5), f'Created {total_org_roles_created} org roles so far'

        yield 85, f'Created {total_org_roles_created} organization roles'

        # Process gang roles in batches
        for i in range(0, len(gang_roles_to_create), batch_size):
            batch = gang_roles_to_create[i : i + batch_size]
            final_gang_roles = [
                UserGangRole(user=username_to_user.get(username), role=roles.get(role_name), obj_id=gang_id)
                for username, role_name, gang_id in batch
                if username_to_user.get(username) and roles.get(role_name)
            ]

            if final_gang_roles:
                UserGangRole.objects.bulk_create(final_gang_roles)
                total_gang_roles_created += len(final_gang_roles)

            if i % 1000 == 0 and i > 0:
                yield 85 + (i / len(gang_roles_to_create) * 2.5), f'Created {total_gang_roles_created} gang roles so far'

        yield 87.5, f'Created {total_gang_roles_created} gang roles'

        # Process section roles in batches
        for i in range(0, len(section_roles_to_create), batch_size):
            batch = section_roles_to_create[i : i + batch_size]
            final_section_roles = [
                UserGangSectionRole(user=username_to_user.get(username), role=roles.get(role_name), obj_id=section_id)
                for username, role_name, section_id in batch
                if username_to_user.get(username) and roles.get(role_name)
            ]

            if final_section_roles:
                UserGangSectionRole.objects.bulk_create(final_section_roles)
                total_section_roles_created += len(final_section_roles)

            if i % 1000 == 0 and i > 0:
                yield 87.5 + (i / len(section_roles_to_create) * 2.5), f'Created {total_section_roles_created} section roles so far'

        yield 90, f'Created all role assignments: {total_org_roles_created + total_gang_roles_created + total_section_roles_created} total roles'

    # End of transaction
    total_users = len(created_users)
    total_roles = total_org_roles_created + total_gang_roles_created + total_section_roles_created

    yield 100, f'Created {total_users} users with {total_roles} role assignments'
