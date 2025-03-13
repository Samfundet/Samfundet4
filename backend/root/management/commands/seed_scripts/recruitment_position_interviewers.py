from __future__ import annotations

from random import sample, randint
from collections import defaultdict

from samfundet.models.role import Role, UserGangSectionRole
from samfundet.models.general import Gang, User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication

from .roles import SECTION_INTERVIEWER


def get_interviewers_by_gang():
    """
    Get all users with the section_interviewer role grouped by gang.

    Returns:
        Dictionary mapping gang_ids to sets of interviewer user_ids
    """
    interviewers_by_gang = defaultdict(set)

    # Find the interviewer role (case-insensitive search)
    section_interviewer_role = Role.objects.filter(name__iexact=SECTION_INTERVIEWER).first()

    if not section_interviewer_role:
        return interviewers_by_gang  # Return empty dict if role doesn't exist

    # Find all UserGangSectionRole entries with this role
    interviewer_roles = UserGangSectionRole.objects.filter(role=section_interviewer_role).select_related('user', 'obj', 'obj__gang')

    # Map users to their gangs through their obj (section) relationship
    for role in interviewer_roles:
        # Get the section from the role's obj field
        section = role.obj

        # Get the gang from the section
        if section and section.gang:
            gang_id = section.gang.id
            interviewers_by_gang[gang_id].add(role.user_id)

    return interviewers_by_gang


def seed():  # noqa: C901
    yield 0, 'recruitment_position_interviewers'

    # Clear any existing interviewers
    for position in RecruitmentPosition.objects.all():
        position.interviewers.clear()
    yield 10, 'Cleared old interviewers'

    # Get all positions, grouped by gang
    positions = list(RecruitmentPosition.objects.select_related('gang').all())
    positions_by_gang = defaultdict(list)
    for position in positions:
        if position.gang:
            positions_by_gang[position.gang.id].append(position)

    # Get all applicant IDs by position
    applicants_by_position = {}
    for app in RecruitmentApplication.objects.values('recruitment_position_id', 'user_id'):
        pos_id = app['recruitment_position_id']
        if pos_id not in applicants_by_position:
            applicants_by_position[pos_id] = set()
        applicants_by_position[pos_id].add(app['user_id'])

    # Get interviewers using the role-based approach with proper section lookup
    interviewers_by_gang = get_interviewers_by_gang()

    # If no interviewers found via roles, use the fallback username approach
    if not any(interviewers_by_gang.values()):
        # Fallback: Map usernames containing 'interviewer' to gangs
        interviewer_users = User.objects.filter(username__icontains='interviewer')

        # Create lookup for gang abbreviations and names
        gang_abbr_to_id = {}
        for gang in Gang.objects.all():
            if gang.abbreviation:
                gang_abbr_to_id[gang.abbreviation.lower()] = gang.id
            if gang.name_nb:
                gang_abbr_to_id[gang.name_nb.lower()] = gang.id

        # Associate interviewers with gangs based on username pattern
        for user in interviewer_users:
            parts = user.username.split('_')
            if len(parts) >= 3:
                gang_identifier = parts[1].lower()
                gang_id = gang_abbr_to_id.get(gang_identifier)

                if gang_id:
                    interviewers_by_gang[gang_id].add(user.id)
                else:
                    # Try to find a gang with this name
                    matching_gangs = Gang.objects.filter(name_nb__icontains=gang_identifier)
                    if matching_gangs.exists():
                        gang_id = matching_gangs.first().id
                        interviewers_by_gang[gang_id].add(user.id)

    created_count = 0
    processed_count = 0
    total_positions = len(positions)

    if not total_positions:
        yield 100, 'No positions found to assign interviewers'
        return

    # Iterate through gangs
    for gang_id, gang_positions in positions_by_gang.items():
        # Get interviewers for this gang (safely)
        gang_interviewers = list(interviewers_by_gang.get(gang_id, set()))

        if not gang_interviewers:
            # Skip this gang if there are no qualified interviewers
            progress = min(90, (processed_count / total_positions) * 100)
            yield progress, f'Skipping gang {gang_id} - no interviewers available'
            processed_count += len(gang_positions)
            continue

        # Assign interviewers to each position for this gang
        for position in gang_positions:
            # Get the users who have applied for this position
            position_applicants = applicants_by_position.get(position.id, set())

            # Exclude applicants from eligible interviewers
            eligible_interviewers = [user_id for user_id in gang_interviewers if user_id not in position_applicants]

            if len(eligible_interviewers) < 2:
                # Skip if there aren't enough eligible interviewers
                progress = min(90, (processed_count / total_positions) * 100)
                yield progress, f'Skipping position {position.id} - insufficient eligible interviewers'
                processed_count += 1
                continue

            # Select 2-5 random interviewers (or all if fewer are available)
            num_interviewers = min(randint(2, 5), len(eligible_interviewers))
            selected_interviewer_ids = sample(eligible_interviewers, num_interviewers)

            # Assign interviewers to the position
            position.interviewers.set(User.objects.filter(id__in=selected_interviewer_ids))
            created_count += num_interviewers
            processed_count += 1

            progress = min(90, (processed_count / total_positions) * 100)
            if processed_count % 10 == 0 or processed_count == total_positions:
                yield progress, f'Assigned interviewers to {processed_count}/{total_positions} positions'

    yield 100, f'Assigned {created_count} interviewers to {processed_count} recruitment positions'
