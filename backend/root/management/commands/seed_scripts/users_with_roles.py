from __future__ import annotations

import random
from typing import Any

from samfundet.models.role import Role, UserOrgRole, UserGangRole, UserGangSectionRole
from samfundet.models.general import Gang, User, Campus, GangSection, Organization

from .roles import (
    RAADET,
    STYRET,
    GANG_LEADER,
    GANG_MEMBER,
    REDAKSJONEN,
    EVENT_MANAGER,
    VENUE_MANAGER,
    SECTION_LEADER,
    VICE_GANG_LEADER,
    ORG_RECRUITMENT_MANAGER,
    GANG_RECRUITMENT_MANAGER,
    SECTION_RECRUITMENT_MANAGER,
    GANG_RECRUITMENT_INTERVIEWER,
)

# Define user types that are available for all organizations
# These roles handle recruitment, events, and venues across all organizations
UNIVERSAL_USER_TYPES = {
    'org_recruitment': {
        'roles': [ORG_RECRUITMENT_MANAGER],
        'name_pattern': '{org}_opptak',
        'title_nb': 'Opptaksansvarlig',
        'title_en': 'Recruitment Manager',
        'level': 'org',
    },
    'gang_recruitment': {
        'roles': [GANG_RECRUITMENT_MANAGER, GANG_RECRUITMENT_INTERVIEWER],
        'name_pattern': '{org}_{gang}_opptak',  # Include org for uniqueness
        'title_nb': 'Opptaksansvarlig',
        'title_en': 'Recruitment Manager',
        'level': 'gang',
    },
    'section_recruitment': {
        'roles': [SECTION_RECRUITMENT_MANAGER],
        'name_pattern': '{org}_{gang}_{section}_opptak',  # Full hierarchy in name
        'title_nb': 'Opptaksansvarlig',
        'title_en': 'Recruitment Manager',
        'level': 'section',
    },
    'event_manager': {
        'roles': [EVENT_MANAGER],
        'name_pattern': '{org}_{gang}_event',
        'title_nb': 'Arrangementsansvarlig',
        'title_en': 'Event Manager',
        'level': 'gang',
    },
    'venue_manager': {
        'roles': [VENUE_MANAGER],
        'name_pattern': '{org}_{gang}_venue',
        'title_nb': 'Lokaleansvarlig',
        'title_en': 'Venue Manager',
        'level': 'gang',
    },
    'gang_leader': {
        'roles': [GANG_LEADER],
        'name_pattern': '{org}_{gang}_leader',
        'title_nb': 'Gjengsjef',
        'title_en': 'Gang leader',
        'level': 'gang',
    },
    'vice_gang_leader': {
        'roles': [VICE_GANG_LEADER],
        'name_pattern': '{org}_{gang}_vice_leader',
        'title_nb': 'Nestleder',
        'title_en': 'Vice gang leader',
        'level': 'gang',
    },
    'section_leader': {
        'roles': [SECTION_LEADER],
        'name_pattern': '{org}_{gang}_{section}_section_leader',
        'title_nb': 'Seksjonssjef',
        'title_en': 'Section leader',
        'level': 'section',
    },
    'gang_recruitment_interviewer': {
        'roles': [GANG_RECRUITMENT_INTERVIEWER, GANG_MEMBER],
        'name_pattern': '{org}_{gang}_interviewer',
        'title_nb': 'Intervjuer',
        'title_en': 'Interviewer',
        'level': 'gang',
    },
    'gang_member': {
        'roles': [GANG_MEMBER],
        'name_pattern': '{org}_{gang}_intern',
        'title_nb': 'intern',
        'title_en': 'intern',
        'level': 'gang',
    },
}

# Define user types that are specific to Samfundet organization
# These roles are only created for specific parts of Samfundet
SAMFUNDET_USER_TYPES = {
    'redaksjonen': {
        'roles': [REDAKSJONEN],
        'name_pattern': 'mg_red_{number}',
        'title_nb': 'Redaksjonsmedlem',
        'title_en': 'Editorial Staff',
        'level': 'section',
        'specific_section': 'Redaksjonen',  # Only for MG's Redaksjonen section
    },
    'styret': {
        'roles': [STYRET],
        'name_pattern': 'styret_{number}',
        'title_nb': 'Styremedlem',
        'title_en': 'Board Member',
        'level': 'org',
        'specific_gang': 'Styret',  # Only for Samfundet's Styret
    },
    'raadet': {
        'roles': [RAADET],
        'name_pattern': 'raadet_{number}',
        'title_nb': 'Rådsmedlem',
        'title_en': 'Council Member',
        'level': 'org',
        'specific_gang': 'Rådet',  # Only for Samfundet's Rådet
    },
}


def generate_username(pattern: str, **kwargs) -> str:
    """
    Generate a unique username based on a pattern and parameters.

    The function expects pre-formatted string values in kwargs,
    and simply combines them into a username with proper formatting.
    """
    # Format the username pattern with our parameters
    username = pattern.format(**kwargs).lower()
    # Remove special characters and replace with underscores
    username = ''.join(c if c.isalnum() else '_' for c in username)
    # Add random number for uniqueness
    random_number = random.randint(1, 999)
    return f'{username}_{random_number}'


def create_user_with_roles(
    *, user_type_data: dict, org: Organization | None = None, gang: Gang | None = None, section: GangSection | None = None, number: int | None = None
) -> tuple[User, list[str]]:
    """
    Create a user of a specific type with their associated roles.

    Args:
        user_type_data: Dictionary containing role definitions and naming patterns
        org: Organization the user belongs to
        gang: Gang the user belongs to (if applicable)
        section: Section the user belongs to (if applicable)
        number: Optional number for generating unique usernames

    Returns:
        Tuple of (created user, list of assigned role names)
    """
    # Pre-process gang identifier before creating username parameters
    gang_identifier = ''
    if gang:
        gang_identifier = gang.abbreviation if gang.abbreviation else gang.name_nb

    # Create username parameters with already-processed strings
    username_params = {
        'org': org.name.lower() if org else '',
        'gang': gang_identifier.lower() if gang_identifier else '',
        'section': section.name_nb.lower() if section else '',
        'number': number if number else random.randint(1, 999),
    }

    # Generate unique username
    username = generate_username(user_type_data['name_pattern'], **username_params)

    # Create the user with appropriate name and campus
    campus = random.choice(list(Campus.objects.all()))
    user = User.objects.create_user(
        username=username,
        email=f'{username}@samfundet.no',
        password='test123',  # nosec
        first_name=user_type_data['title_nb'],
        last_name=gang.name_nb if gang else (org.name if org else ''),
        is_superuser=False,
        campus=campus,
    )

    # Assign roles based on the user's level in the organization
    assigned_roles = []
    for role_name in user_type_data['roles']:
        role = Role.objects.get(name=role_name)

        # Create appropriate role assignment based on level
        if user_type_data['level'] == 'section' and section:
            UserGangSectionRole.objects.create(user=user, role=role, obj=section)
        elif user_type_data['level'] == 'gang' and gang:
            UserGangRole.objects.create(user=user, role=role, obj=gang)
        elif user_type_data['level'] == 'org' and org:
            UserOrgRole.objects.create(user=user, role=role, obj=org)

        assigned_roles.append(role_name)

    return user, assigned_roles


def seed() -> Any:
    """
    Create users with roles for all organizations and Samfundet-specific roles.

    This seed function creates two types of users:
    1. Universal users (recruitment, event, venue) for all organizations
    2. Samfundet-specific users (Redaksjonen, Styret, Rådet)
    """
    # Verify prerequisites
    if Role.objects.count() == 0:
        yield 0, 'Error: No roles found. Please run roles seed first.'
        return

    if Campus.objects.count() == 0:
        yield 0, 'Error: No campuses found. Please run campus seed first.'
        return

    # Delete existing non-superusers (keeping anonymous user)
    anonymous_user = User.get_anonymous()
    User.objects.filter(is_superuser=False).exclude(id=anonymous_user.id).delete()
    yield 0, 'Deleted existing non-superusers'

    created_users = 0
    total_orgs = Organization.objects.count()
    current_step = 0

    # Create users for each organization
    for org in Organization.objects.all():
        # Create universal roles for this organization
        # First, organization level roles
        for user_type, type_data in UNIVERSAL_USER_TYPES.items():
            if type_data['level'] == 'org':
                user, roles = create_user_with_roles(user_type_data=type_data, org=org)
                created_users += 1

        # Then create gang level roles for each gang
        for gang in Gang.objects.filter(organization=org):
            # Create gang-level universal roles
            for user_type, type_data in UNIVERSAL_USER_TYPES.items():
                if type_data['level'] == 'gang':
                    user, roles = create_user_with_roles(user_type_data=type_data, org=org, gang=gang)
                    created_users += 1

            # Finally, create section level roles for each section
            for section in GangSection.objects.filter(gang=gang):
                for user_type, type_data in UNIVERSAL_USER_TYPES.items():
                    if type_data['level'] == 'section':
                        user, roles = create_user_with_roles(user_type_data=type_data, org=org, gang=gang, section=section)
                        created_users += 1

        # If this is Samfundet, create Samfundet-specific roles
        if org.name == 'Samfundet':
            for user_type, type_data in SAMFUNDET_USER_TYPES.items():
                if 'specific_gang' in type_data:
                    # Create multiple users for Styret and Rådet
                    for i in range(1, 6):  # Create 5 members
                        user, roles = create_user_with_roles(user_type_data=type_data, org=org, number=i)
                        created_users += 1
                elif 'specific_section' in type_data:
                    # Create Redaksjonen users for the Redaksjonen section
                    try:
                        mg = Gang.objects.get(name_nb='Markedsføringsgjengen')
                        redaksjonen = GangSection.objects.get(name_nb='Redaksjonen', gang=mg)
                        for i in range(1, 4):  # Create 3 members
                            user, roles = create_user_with_roles(user_type_data=type_data, org=org, gang=mg, section=redaksjonen, number=i)
                            created_users += 1
                    except (Gang.DoesNotExist, GangSection.DoesNotExist) as e:
                        yield current_step / total_orgs * 100, f'Warning: {str(e)}'

        current_step += 1
        yield current_step / total_orgs * 100, f'Created users for {org.name}'

    yield 100, f'Created {created_users} users with roles'
