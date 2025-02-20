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

# Define user types with their associated roles and naming patterns
USER_TYPES = {
    'org_leader': {
        'roles': [STYRET],
        'name_pattern': '{org}_leder',
        'title_nb': 'Leder',
        'title_en': 'Leader',
        'level': 'org',
    },
    'org_recruitment': {
        'roles': [ORG_RECRUITMENT_MANAGER],
        'name_pattern': '{org}_opptak',
        'title_nb': 'Opptaksansvarlig',
        'title_en': 'Recruitment Manager',
        'level': 'org',
    },
    'gang_leader': {
        'roles': [GANG_LEADER, GANG_RECRUITMENT_MANAGER],
        'name_pattern': '{gang}_sjef',
        'title_nb': 'Gjengsjef',
        'title_en': 'Gang Leader',
        'level': 'gang',
    },
    'gang_vice_leader': {
        'roles': [VICE_GANG_LEADER, GANG_RECRUITMENT_INTERVIEWER],
        'name_pattern': '{gang}_nestleder',
        'title_nb': 'Nestleder',
        'title_en': 'Vice Leader',
        'level': 'gang',
    },
    'section_leader': {
        'roles': [SECTION_LEADER, SECTION_RECRUITMENT_MANAGER],
        'name_pattern': '{gang}_{section}_leder',
        'title_nb': 'Seksjonsleder',
        'title_en': 'Section Leader',
        'level': 'section',
    },
    'event_manager': {
        'roles': [EVENT_MANAGER, GANG_MEMBER],
        'name_pattern': '{gang}_arrangement',
        'title_nb': 'Arrangementsansvarlig',
        'title_en': 'Event Manager',
        'level': 'gang',
    },
    'venue_manager': {
        'roles': [VENUE_MANAGER, GANG_MEMBER],
        'name_pattern': '{gang}_venue',
        'title_nb': 'Lokaleansvarlig',
        'title_en': 'Venue Manager',
        'level': 'gang',
    },
    'redaksjonen': {
        'roles': [REDAKSJONEN, GANG_MEMBER],
        'name_pattern': '{gang}_redaksjonen',
        'title_nb': 'Redaksjonsmedlem',
        'title_en': 'Editorial Staff',
        'level': 'gang',
    },
    'raadet': {
        'roles': [RAADET],
        'name_pattern': 'raadet_{number}',
        'title_nb': 'Rådsmedlem',
        'title_en': 'Council Member',
        'level': 'org',
    },
}

# Define which user types should be created for each organization and gang
ORG_USER_TYPES = ['org_leader', 'org_recruitment', 'raadet']
GANG_USER_TYPES = ['gang_leader', 'gang_vice_leader', 'event_manager']
SECTION_USER_TYPES = ['section_leader']

# Special cases for specific gangs
SPECIAL_GANG_TYPES = {
    'Markedsføringsgjengen': ['redaksjonen'],  # MG gets redaksjonen
    'Klubbstyret': ['venue_manager'],  # KSG gets venue managers
    'Kulturutvalget': ['venue_manager'],  # KU gets venue managers
}


def generate_username(pattern: str, **kwargs) -> str:
    """Generate a username based on a pattern and parameters"""
    # Replace spaces and special characters with underscores
    username = pattern.format(**kwargs).lower()
    username = ''.join(c if c.isalnum() else '_' for c in username)
    # Add random number to ensure uniqueness
    random_number = random.randint(1, 999)
    return f'{username}_{random_number}'


def create_user_with_roles(
    *, user_type: str, org: Organization | None = None, gang: Gang | None = None, section: GangSection | None = None, number: int | None = None
) -> tuple[User, list[str]]:
    """Create a user of a specific type with their associated roles"""
    user_type_data = USER_TYPES[user_type]

    # Generate username based on the pattern
    username_params = {
        'org': org.name if org else '',
        'gang': gang.abbreviation if gang else '',
        'section': section.name_nb if section else '',
        'number': number if number else random.randint(1, 999),
    }
    username = generate_username(user_type_data['name_pattern'], **username_params)

    # Create the user
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

    # Assign roles based on the level
    assigned_roles = []
    for role_name in user_type_data['roles']:
        role = Role.objects.get(name=role_name)
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
    Create users with roles for each organization and gang.
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
    total_steps = (
        Organization.objects.count()  # Org users
        + Gang.objects.count()  # Gang users
        + GangSection.objects.count()  # Section users
    )
    current_step = 0

    # Create organization-level users
    for org in Organization.objects.all():
        for user_type in ORG_USER_TYPES:
            if user_type == 'raadet':
                # Create multiple council members
                for i in range(1, 6):  # 5 council members
                    user, roles = create_user_with_roles(user_type=user_type, org=org, number=i)
                    created_users += 1
            else:
                user, roles = create_user_with_roles(user_type=user_type, org=org)
                created_users += 1
        current_step += 1
        yield current_step / total_steps * 100, f'Created organization users for {org.name}'

    # Create gang-level users
    for gang in Gang.objects.all():
        # Standard gang roles
        for user_type in GANG_USER_TYPES:
            user, roles = create_user_with_roles(user_type=user_type, gang=gang)
            created_users += 1

        # Special roles for specific gangs
        if gang.name_nb in SPECIAL_GANG_TYPES:
            for user_type in SPECIAL_GANG_TYPES[gang.name_nb]:
                user, roles = create_user_with_roles(user_type=user_type, gang=gang)
                created_users += 1

        current_step += 1
        yield current_step / total_steps * 100, f'Created gang users for {gang.name_nb}'

    # Create section-level users
    for section in GangSection.objects.all():
        for user_type in SECTION_USER_TYPES:
            user, roles = create_user_with_roles(user_type=user_type, gang=section.gang, section=section)
            created_users += 1
        current_step += 1
        yield current_step / total_steps * 100, f'Created section users for {section.name_nb}'

    yield 100, f'Created {created_users} users with roles'
