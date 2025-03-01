from __future__ import annotations

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from root.utils import permissions as perm

from samfundet.models.role import Role
from samfundet.models.general import Gang, GangSection, Organization

# from samfundet.models.recruitment import Recruitment

GANG_LEADER = 'gang_leader'
VICE_GANG_LEADER = 'vice_gang_leader'
SECTION_LEADER = 'section_leader'
GANG_MEMBER = 'gang_member'
ORG_RECRUITMENT_MANAGER = 'org_recruitment_manager'
GANG_RECRUITMENT_MANAGER = 'gang_recruitment_manager'
SECTION_RECRUITMENT_MANAGER = 'section_recruitment_manager'
SECTION_RECRUITMENT_INTERVIEWER = 'gang_recruitment_interviewer'
REDAKSJONEN = 'redaksjonen'
STYRET = 'styret'
RAADET = 'raadet'
EVENT_MANAGER = 'event_manager'
VENUE_MANAGER = 'venue_manager'
# Define the base roles that will be used across all gangs
BASE_GANG_ROLES = {
    GANG_LEADER: {
        'permissions': [
            perm.SAMFUNDET_VIEW_GANG,
            perm.SAMFUNDET_CHANGE_GANG,
            perm.SAMFUNDET_VIEW_GANGSECTION,
            perm.SAMFUNDET_CHANGE_GANGSECTION,
            perm.SAMFUNDET_ADD_GANGSECTION,
            perm.SAMFUNDET_DELETE_GANGSECTION,
            perm.SAMFUNDET_VIEW_USER,
            # org
            perm.SAMFUNDET_VIEW_USERORGROLE,
            perm.SAMFUNDET_ADD_USERORGROLE,
            perm.SAMFUNDET_CHANGE_USERORGROLE,
            perm.SAMFUNDET_DELETE_USERORGROLE,
            # gang
            perm.SAMFUNDET_VIEW_USERGANGROLE,
            perm.SAMFUNDET_ADD_USERGANGROLE,
            perm.SAMFUNDET_CHANGE_USERGANGROLE,
            perm.SAMFUNDET_DELETE_USERGANGROLE,
            # section
            perm.SAMFUNDET_VIEW_USERGANGSECTIONROLE,
            perm.SAMFUNDET_ADD_USERGANGSECTIONROLE,
            perm.SAMFUNDET_CHANGE_USERGANGSECTIONROLE,
            perm.SAMFUNDET_DELETE_USERGANGSECTIONROLE,
            # role
            perm.SAMFUNDET_VIEW_ROLE,
        ]
    },
    VICE_GANG_LEADER: {
        'permissions': [
            perm.SAMFUNDET_VIEW_GANG,
            perm.SAMFUNDET_VIEW_GANGSECTION,
            perm.SAMFUNDET_CHANGE_GANGSECTION,
            perm.SAMFUNDET_ADD_GANGSECTION,
            perm.SAMFUNDET_DELETE_GANGSECTION,
            perm.SAMFUNDET_VIEW_USER,
            perm.SAMFUNDET_VIEW_USERORGROLE,
            perm.SAMFUNDET_VIEW_USERGANGROLE,
            perm.SAMFUNDET_VIEW_USERGANGSECTIONROLE,
            # role
            perm.SAMFUNDET_VIEW_ROLE,
        ]
    },
    SECTION_LEADER: {
        'permissions': [
            perm.SAMFUNDET_VIEW_GANGSECTION,
            perm.SAMFUNDET_CHANGE_GANGSECTION,
            perm.SAMFUNDET_VIEW_USER,
            perm.SAMFUNDET_VIEW_USERGANGSECTIONROLE,
            perm.SAMFUNDET_ADD_USERGANGSECTIONROLE,
            perm.SAMFUNDET_CHANGE_USERGANGSECTIONROLE,
            perm.SAMFUNDET_DELETE_USERGANGSECTIONROLE,
        ]
    },
    GANG_MEMBER: {
        'permissions': [
            perm.SAMFUNDET_VIEW_GANG,
            perm.SAMFUNDET_VIEW_GANGSECTION,
        ]
    },
}

# Special roles for recruitment
RECRUITMENT_ROLES = {
    ORG_RECRUITMENT_MANAGER: {
        'permissions': [
            # recruitment
            perm.SAMFUNDET_VIEW_RECRUITMENT,
            perm.SAMFUNDET_ADD_RECRUITMENT,
            perm.SAMFUNDET_CHANGE_RECRUITMENT,
            # occupied timeslot
            perm.SAMFUNDET_VIEW_OCCUPIEDTIMESLOT,
            perm.SAMFUNDET_ADD_OCCUPIEDTIMESLOT,
            perm.SAMFUNDET_CHANGE_OCCUPIEDTIMESLOT,
            perm.SAMFUNDET_DELETE_OCCUPIEDTIMESLOT,
            # view permissions
            perm.SAMFUNDET_VIEW_RECRUITMENTPOSITION,
            perm.SAMFUNDET_VIEW_INTERVIEW,
            perm.SAMFUNDET_VIEW_RECRUITMENTAPPLICATION,
            perm.SAMFUNDET_VIEW_RECRUITMENTCAMPUSSTAT,
            perm.SAMFUNDET_VIEW_RECRUITMENTDATESTAT,
            perm.SAMFUNDET_VIEW_RECRUITMENTGANGSTAT,
            perm.SAMFUNDET_VIEW_RECRUITMENTINTERVIEWAVAILABILITY,
            perm.SAMFUNDET_VIEW_RECRUITMENTPOSITIONSHAREDINTERVIEWGROUP,
            perm.SAMFUNDET_VIEW_RECRUITMENTSEPARATEPOSITION,
            perm.SAMFUNDET_VIEW_RECRUITMENTSTATISTICS,
            perm.SAMFUNDET_VIEW_RECRUITMENTTIMESTAT,
        ]
    },
    GANG_RECRUITMENT_MANAGER: {
        'permissions': [
            # view permissions
            perm.SAMFUNDET_VIEW_RECRUITMENT,
            perm.SAMFUNDET_VIEW_RECRUITMENTPOSITION,
            perm.SAMFUNDET_VIEW_INTERVIEW,
            perm.SAMFUNDET_VIEW_RECRUITMENTAPPLICATION,
            perm.SAMFUNDET_VIEW_RECRUITMENTCAMPUSSTAT,
            perm.SAMFUNDET_VIEW_RECRUITMENTDATESTAT,
            perm.SAMFUNDET_VIEW_RECRUITMENTGANGSTAT,
            perm.SAMFUNDET_VIEW_RECRUITMENTINTERVIEWAVAILABILITY,
            perm.SAMFUNDET_VIEW_RECRUITMENTPOSITIONSHAREDINTERVIEWGROUP,
            perm.SAMFUNDET_VIEW_RECRUITMENTSEPARATEPOSITION,
            perm.SAMFUNDET_VIEW_RECRUITMENTSTATISTICS,
            perm.SAMFUNDET_VIEW_RECRUITMENTTIMESTAT,
            # interview room
            perm.SAMFUNDET_ADD_INTERVIEWROOM,
            perm.SAMFUNDET_DELETE_INTERVIEWROOM,
            perm.SAMFUNDET_CHANGE_INTERVIEWROOM,
            perm.SAMFUNDET_VIEW_INTERVIEWROOM,
        ]
    },
    SECTION_RECRUITMENT_MANAGER: {
        'permissions': [
            perm.SAMFUNDET_VIEW_RECRUITMENT,
            # position
            perm.SAMFUNDET_VIEW_RECRUITMENTPOSITION,
            perm.SAMFUNDET_ADD_RECRUITMENTPOSITION,
            perm.SAMFUNDET_CHANGE_RECRUITMENTPOSITION,
            perm.SAMFUNDET_DELETE_RECRUITMENTPOSITION,
            # interview
            perm.SAMFUNDET_VIEW_INTERVIEW,
            perm.SAMFUNDET_ADD_INTERVIEW,
            perm.SAMFUNDET_CHANGE_INTERVIEW,
            # application
            perm.SAMFUNDET_VIEW_RECRUITMENTAPPLICATION,
            perm.SAMFUNDET_ADD_RECRUITMENTAPPLICATION,
            perm.SAMFUNDET_CHANGE_RECRUITMENTAPPLICATION,
            # availability
            perm.SAMFUNDET_VIEW_RECRUITMENTINTERVIEWAVAILABILITY,
            # shared invterviews
            perm.SAMFUNDET_ADD_RECRUITMENTINTERVIEWAVAILABILITY,
            perm.SAMFUNDET_VIEW_RECRUITMENTPOSITIONSHAREDINTERVIEWGROUP,
            perm.SAMFUNDET_ADD_RECRUITMENTPOSITIONSHAREDINTERVIEWGROUP,
            perm.SAMFUNDET_CHANGE_RECRUITMENTPOSITIONSHAREDINTERVIEWGROUP,
            perm.SAMFUNDET_DELETE_RECRUITMENTPOSITIONSHAREDINTERVIEWGROUP,
            # separate position
            perm.SAMFUNDET_VIEW_RECRUITMENTSEPARATEPOSITION,
            perm.SAMFUNDET_ADD_RECRUITMENTSEPARATEPOSITION,
            perm.SAMFUNDET_CHANGE_RECRUITMENTSEPARATEPOSITION,
            perm.SAMFUNDET_DELETE_RECRUITMENTSEPARATEPOSITION,
            # stats
            perm.SAMFUNDET_VIEW_RECRUITMENTCAMPUSSTAT,
            perm.SAMFUNDET_VIEW_RECRUITMENTDATESTAT,
            perm.SAMFUNDET_VIEW_RECRUITMENTTIMESTAT,
            # interview room
            perm.SAMFUNDET_ADD_INTERVIEWROOM,
            perm.SAMFUNDET_DELETE_INTERVIEWROOM,
            perm.SAMFUNDET_CHANGE_INTERVIEWROOM,
            perm.SAMFUNDET_VIEW_INTERVIEWROOM,
        ]
    },
    SECTION_RECRUITMENT_INTERVIEWER: {
        'permissions': [
            perm.SAMFUNDET_VIEW_INTERVIEW,
            perm.SAMFUNDET_CHANGE_INTERVIEW,
            perm.SAMFUNDET_VIEW_RECRUITMENTINTERVIEWAVAILABILITY,
            perm.SAMFUNDET_CHANGE_RECRUITMENTINTERVIEWAVAILABILITY,
            perm.SAMFUNDET_ADD_RECRUITMENTINTERVIEWAVAILABILITY,
            perm.SAMFUNDET_DELETE_RECRUITMENTINTERVIEWAVAILABILITY,
            perm.SAMFUNDET_VIEW_INTERVIEWROOM,
        ]
    },
}

# Special roles for specific gangs
SPECIAL_ROLES = {
    REDAKSJONEN: {
        #      'gang': 'Markedsføringsgjengen',
        #       'section': 'Redaksjonen',
        'permissions': [
            # blogg
            perm.SAMFUNDET_VIEW_BLOGPOST,
            perm.SAMFUNDET_ADD_BLOGPOST,
            perm.SAMFUNDET_CHANGE_BLOGPOST,
            perm.SAMFUNDET_DELETE_BLOGPOST,
            # infobox
            perm.SAMFUNDET_VIEW_INFOBOX,
            perm.SAMFUNDET_ADD_INFOBOX,
            perm.SAMFUNDET_CHANGE_INFOBOX,
            perm.SAMFUNDET_DELETE_INFOBOX,
            # information page
            perm.SAMFUNDET_ADD_INFORMATIONPAGE,
            perm.SAMFUNDET_CHANGE_INFORMATIONPAGE,
            perm.SAMFUNDET_VIEW_INFORMATIONPAGE,
            perm.SAMFUNDET_DELETE_INFORMATIONPAGE,
            # event
            perm.SAMFUNDET_ADD_EVENT,
            perm.SAMFUNDET_CHANGE_EVENT,
            perm.SAMFUNDET_VIEW_EVENT,
            perm.SAMFUNDET_DELETE_EVENT,
            # event custom ticket
            perm.SAMFUNDET_ADD_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_CHANGE_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_VIEW_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_DELETE_EVENTCUSTOMTICKET,
            # event group
            perm.SAMFUNDET_ADD_EVENTGROUP,
            perm.SAMFUNDET_CHANGE_EVENTGROUP,
            perm.SAMFUNDET_VIEW_EVENTGROUP,
            perm.SAMFUNDET_DELETE_EVENTGROUP,
            # event registration
            perm.SAMFUNDET_ADD_EVENTREGISTRATION,
            perm.SAMFUNDET_CHANGE_EVENTREGISTRATION,
            perm.SAMFUNDET_VIEW_EVENTREGISTRATION,
            perm.SAMFUNDET_DELETE_EVENTREGISTRATION,
            # closed-period
            perm.SAMFUNDET_ADD_CLOSEDPERIOD,
            perm.SAMFUNDET_CHANGE_CLOSEDPERIOD,
            perm.SAMFUNDET_VIEW_CLOSEDPERIOD,
            perm.SAMFUNDET_DELETE_CLOSEDPERIOD,
            # image
            perm.SAMFUNDET_ADD_IMAGE,
            perm.SAMFUNDET_CHANGE_IMAGE,
            perm.SAMFUNDET_VIEW_IMAGE,
            perm.SAMFUNDET_DELETE_IMAGE,
            # tag
            perm.SAMFUNDET_ADD_TAG,
            perm.SAMFUNDET_CHANGE_TAG,
            perm.SAMFUNDET_VIEW_TAG,
            # gang
            perm.SAMFUNDET_VIEW_GANG,
            perm.SAMFUNDET_ADD_GANG,
            perm.SAMFUNDET_DELETE_GANG,
            perm.SAMFUNDET_CHANGE_GANG,
        ],
    },
    STYRET: {
        'permissions': [
            # blogg
            perm.SAMFUNDET_VIEW_BLOGPOST,
            perm.SAMFUNDET_ADD_BLOGPOST,
            perm.SAMFUNDET_CHANGE_BLOGPOST,
            perm.SAMFUNDET_DELETE_BLOGPOST,
            # infobox
            perm.SAMFUNDET_VIEW_INFOBOX,
            perm.SAMFUNDET_ADD_INFOBOX,
            perm.SAMFUNDET_CHANGE_INFOBOX,
            perm.SAMFUNDET_DELETE_INFOBOX,
            # information page
            perm.SAMFUNDET_ADD_INFORMATIONPAGE,
            perm.SAMFUNDET_CHANGE_INFORMATIONPAGE,
            perm.SAMFUNDET_VIEW_INFORMATIONPAGE,
            perm.SAMFUNDET_DELETE_INFORMATIONPAGE,
            # event
            perm.SAMFUNDET_ADD_EVENT,
            perm.SAMFUNDET_CHANGE_EVENT,
            perm.SAMFUNDET_VIEW_EVENT,
            perm.SAMFUNDET_DELETE_EVENT,
            # event custom ticket
            perm.SAMFUNDET_ADD_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_CHANGE_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_VIEW_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_DELETE_EVENTCUSTOMTICKET,
            # event group
            perm.SAMFUNDET_ADD_EVENTGROUP,
            perm.SAMFUNDET_CHANGE_EVENTGROUP,
            perm.SAMFUNDET_VIEW_EVENTGROUP,
            perm.SAMFUNDET_DELETE_EVENTGROUP,
            # event registration
            perm.SAMFUNDET_ADD_EVENTREGISTRATION,
            perm.SAMFUNDET_CHANGE_EVENTREGISTRATION,
            perm.SAMFUNDET_VIEW_EVENTREGISTRATION,
            perm.SAMFUNDET_DELETE_EVENTREGISTRATION,
            # image
            perm.SAMFUNDET_ADD_IMAGE,
            perm.SAMFUNDET_CHANGE_IMAGE,
            perm.SAMFUNDET_VIEW_IMAGE,
            perm.SAMFUNDET_DELETE_IMAGE,
            # tag
            perm.SAMFUNDET_ADD_TAG,
            perm.SAMFUNDET_CHANGE_TAG,
            perm.SAMFUNDET_VIEW_TAG,
            # saksdokument
            perm.SAMFUNDET_ADD_SAKSDOKUMENT,
            perm.SAMFUNDET_CHANGE_SAKSDOKUMENT,
            perm.SAMFUNDET_DELETE_SAKSDOKUMENT,
            perm.SAMFUNDET_VIEW_SAKSDOKUMENT,
        ],
    },
    RAADET: {
        'permissions': [
            # blogg
            perm.SAMFUNDET_VIEW_BLOGPOST,
            perm.SAMFUNDET_ADD_BLOGPOST,
            perm.SAMFUNDET_CHANGE_BLOGPOST,
            perm.SAMFUNDET_DELETE_BLOGPOST,
            # information page
            perm.SAMFUNDET_ADD_INFORMATIONPAGE,
            perm.SAMFUNDET_CHANGE_INFORMATIONPAGE,
            perm.SAMFUNDET_VIEW_INFORMATIONPAGE,
            perm.SAMFUNDET_DELETE_INFORMATIONPAGE,
            # saksdokument
            perm.SAMFUNDET_ADD_SAKSDOKUMENT,
            perm.SAMFUNDET_CHANGE_SAKSDOKUMENT,
            perm.SAMFUNDET_DELETE_SAKSDOKUMENT,
            perm.SAMFUNDET_VIEW_SAKSDOKUMENT,
        ],
    },
    EVENT_MANAGER: {
        'permissions': [
            # event
            perm.SAMFUNDET_ADD_EVENT,
            perm.SAMFUNDET_CHANGE_EVENT,
            perm.SAMFUNDET_VIEW_EVENT,
            perm.SAMFUNDET_DELETE_EVENT,
            # event custom ticket
            perm.SAMFUNDET_ADD_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_CHANGE_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_VIEW_EVENTCUSTOMTICKET,
            perm.SAMFUNDET_DELETE_EVENTCUSTOMTICKET,
            # event group
            perm.SAMFUNDET_ADD_EVENTGROUP,
            perm.SAMFUNDET_CHANGE_EVENTGROUP,
            perm.SAMFUNDET_VIEW_EVENTGROUP,
            perm.SAMFUNDET_DELETE_EVENTGROUP,
            # event registration
            perm.SAMFUNDET_ADD_EVENTREGISTRATION,
            perm.SAMFUNDET_CHANGE_EVENTREGISTRATION,
            perm.SAMFUNDET_VIEW_EVENTREGISTRATION,
            perm.SAMFUNDET_DELETE_EVENTREGISTRATION,
            # image
            perm.SAMFUNDET_ADD_IMAGE,
            perm.SAMFUNDET_CHANGE_IMAGE,
            perm.SAMFUNDET_VIEW_IMAGE,
            perm.SAMFUNDET_DELETE_IMAGE,
            # tag
            perm.SAMFUNDET_ADD_TAG,
            perm.SAMFUNDET_CHANGE_TAG,
            perm.SAMFUNDET_VIEW_TAG,
        ],
    },
    VENUE_MANAGER: {
        'permissions': [
            # menu
            perm.SAMFUNDET_ADD_MENU,
            perm.SAMFUNDET_CHANGE_MENU,
            perm.SAMFUNDET_DELETE_MENU,
            perm.SAMFUNDET_VIEW_MENU,
            # menu item
            perm.SAMFUNDET_ADD_MENUITEM,
            perm.SAMFUNDET_CHANGE_MENUITEM,
            perm.SAMFUNDET_DELETE_MENUITEM,
            perm.SAMFUNDET_VIEW_MENUITEM,
            # table
            perm.SAMFUNDET_ADD_TABLE,
            perm.SAMFUNDET_CHANGE_TABLE,
            perm.SAMFUNDET_DELETE_TABLE,
            perm.SAMFUNDET_VIEW_TABLE,
            # reservation
            perm.SAMFUNDET_ADD_RESERVATION,
            perm.SAMFUNDET_CHANGE_RESERVATION,
            perm.SAMFUNDET_VIEW_RESERVATION,
            perm.SAMFUNDET_DELETE_RESERVATION,
        ],
    },
}


def create_role(*, name: str, permissions: list[str], content_type=None) -> Role:
    """Helper function to create a role with given permissions."""
    role, _ = Role.objects.get_or_create(name=name, content_type=content_type)

    # Get permission objects and add them to the role
    permission_objects = Permission.objects.filter(codename__in=[p.split('.')[-1] for p in permissions])
    role.permissions.set(permission_objects)

    return role


def create_base_gang_roles(gang_content_type, org_content_type, section_content_type):
    """
    Create the base gang roles and recruitment roles.

    This helper function creates:
    1. Standard roles applied at gang level (GANG_LEADER, VICE_GANG_LEADER, etc.)
    2. Recruitment-specific roles at the appropriate levels

    Args:
        gang_content_type: ContentType for Gang model
        org_content_type: ContentType for Organization model
        section_content_type: ContentType for GangSection model

    Returns:
        int: Number of created roles
    """
    created_count = 0

    # Create base gang roles
    for role_name, role_data in BASE_GANG_ROLES.items():
        create_role(name=role_name, permissions=role_data['permissions'], content_type=gang_content_type)
        created_count += 1

    # Create recruitment roles at appropriate levels
    for role_name, role_data in RECRUITMENT_ROLES.items():
        content_type = None  # Default to None to catch unassigned cases

        if role_name == ORG_RECRUITMENT_MANAGER:
            content_type = org_content_type
        elif role_name == GANG_RECRUITMENT_MANAGER:
            content_type = gang_content_type
        elif role_name in [SECTION_RECRUITMENT_MANAGER, SECTION_RECRUITMENT_INTERVIEWER]:
            content_type = section_content_type

        if content_type is None:
            raise ValueError(f'Missing content type for role: {role_name}')

        create_role(name=role_name, permissions=role_data['permissions'], content_type=content_type)
        created_count += 1

    return created_count


def create_special_roles(org_content_type, gang_content_type, section_content_type):
    """
    Create special roles for specific organizational needs.

    This helper function creates:
    1. Special variants of REDAKSJONEN role for different levels
    2. Other special roles like STYRET, RAADET, etc. at org level

    Args:
        org_content_type: ContentType for Organization model
        gang_content_type: ContentType for Gang model
        section_content_type: ContentType for GangSection model

    Returns:
        int: Number of created roles
    """
    created_count = 0

    for role_name, role_data in SPECIAL_ROLES.items():
        # Create specific organization-level version for REDAKSJONEN
        if role_name == REDAKSJONEN:
            # Create the original REDAKSJONEN role at org level
            create_role(name=role_name + '_ORG', permissions=role_data['permissions'], content_type=org_content_type)

            # Create a flexible, level-agnostic version with null content_type
            create_role(name=role_name + '_ANY', permissions=role_data['permissions'], content_type=None)

            # Create a gang-specific version
            create_role(name=role_name + '_GANG', permissions=role_data['permissions'], content_type=gang_content_type)

            # Create a section-specific version
            create_role(name=role_name + '_SECTION', permissions=role_data['permissions'], content_type=section_content_type)

            # Count the 4 variants we created
            created_count += 4
        else:
            # Keep other special roles at org level as before
            create_role(name=role_name, permissions=role_data['permissions'], content_type=org_content_type)
            created_count += 1

    return created_count


def seed():
    """
    Main seeding function for roles.

    This function creates all roles in the system:
    1. Base Gang Roles - Fundamental permissions for different gang roles
    2. Recruitment Roles - Various levels of recruitment management
    3. Special Roles - Organization-specific functional roles

    The roles are created with appropriate content_types to determine at which
    level (organization, gang, or section) they can be assigned.

    Yields:
        Tuples of (progress_percentage, status_message)
    """
    total_steps = len(BASE_GANG_ROLES) + len(RECRUITMENT_ROLES) + len(SPECIAL_ROLES)
    current_step = 0

    yield 0, 'Starting role creation'

    # First, clear existing roles
    Role.objects.all().delete()
    yield (current_step / total_steps) * 100, 'Cleared existing roles'

    # Get content types for different levels
    org_content_type = ContentType.objects.get_for_model(Organization)
    gang_content_type = ContentType.objects.get_for_model(Gang)
    section_content_type = ContentType.objects.get_for_model(GangSection)

    # Create base gang roles - at Gang level
    yield 20, 'Creating base gang roles and recruitment roles'
    base_roles_count = create_base_gang_roles(
        gang_content_type=gang_content_type,
        org_content_type=org_content_type,
        section_content_type=section_content_type,
    )
    current_step += base_roles_count
    yield (current_step / total_steps) * 100, f'Created {base_roles_count} base gang roles and recruitment roles'

    # Special roles - with variants for different levels
    yield 70, 'Creating special roles'
    special_roles_count = create_special_roles(
        org_content_type=org_content_type,
        gang_content_type=gang_content_type,
        section_content_type=section_content_type,
    )
    current_step += special_roles_count
    yield (current_step / total_steps) * 100, f'Created {special_roles_count} special roles'

    total_roles = Role.objects.count()
    yield 100, f'Created {total_roles} roles successfully'
