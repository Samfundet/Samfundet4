from __future__ import annotations

from random import randint
from collections.abc import Generator

from django.db import transaction  # type: ignore

from samfundet.models.role import UserOrgRole, UserGangRole, UserGangSectionRole
from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication


def get_applicant_users() -> list[User]:
    """
    Gets users with no roles, and which are not superusers or staff

    Returns: list of applicant users
    """
    # Get all users with roles (use separate queries and combine results)
    users_with_org_roles = set(UserOrgRole.objects.values_list('user_id', flat=True))
    users_with_gang_roles = set(UserGangRole.objects.values_list('user_id', flat=True))
    users_with_section_roles = set(UserGangSectionRole.objects.values_list('user_id', flat=True))

    # Combine all users with roles. These will be excluded.
    users_with_roles = users_with_org_roles | users_with_gang_roles | users_with_section_roles

    # Get all applicant users (created by applicant_users.py)
    # We can identify them by checking if they're not staff, not superuser, and don't have roles
    eligible_users = list(User.objects.filter(is_staff=False, is_superuser=False).exclude(id__in=users_with_roles))

    # Sort users by ID to ensure consistent order
    eligible_users.sort(key=lambda u: u.id)
    return eligible_users


def generate_application_text(position: RecruitmentPosition) -> str:
    """
    Generate application text based on the position properties

    Returns:
        Application text string
    """
    if position.tags:
        tags = position.tags.split(',')
        return f"I'm interested in the {position.name_en} position because of my experience with {tags[0]}"
    return "I'm interested in this position."


def create_application(position: RecruitmentPosition, user: User, recruitment_id: int, priority: int) -> RecruitmentApplication:
    """
    Create a RecruitmentApplication object

    Returns:
        A RecruitmentApplication object (not saved to database)
    """
    application_text = generate_application_text(position)

    return RecruitmentApplication(
        recruitment_position=position,
        recruitment_id=recruitment_id,
        user=user,
        application_text=application_text,
        applicant_priority=priority,
        recruiter_priority=0,
        recruiter_status=0,
    )


def seed() -> Generator[tuple[float, str], None, None]:  # noqa: C901
    """
    Seed recruitment applications ensuring each position has 3-9 applicants

    Yields:
        Tuples of (progress percentage, status message)
    """
    yield 0, 'recruitment_applications'
    RecruitmentApplication.objects.all().delete()
    yield 0, 'Deleted old applications'

    # Fetch all positions and sort them by ID for consistency
    positions = list(RecruitmentPosition.objects.select_related('recruitment', 'gang').all())
    if not positions:
        yield 100, 'No positions found, nothing to seed'
        return

    # Sort positions by ID for consistency
    positions.sort(key=lambda p: p.id)

    # Get eligible applicant users (already sorted by ID)
    applicant_users = get_applicant_users()
    if not applicant_users:
        yield 100, 'No eligible users found, nothing to seed'
        return

    yield 10, f'Found {len(applicant_users)} eligible users and {len(positions)} positions'

    # Track which users have applied to which recruitments and how many applications they've made
    user_recruitment_map = {}  # {user_id: {recruitment_id: priority_counter}}
    applications_to_create = []
    positions_processed = 0

    # Use transaction for better performance
    with transaction.atomic():
        # For each position, assign 3-9 applicants
        for position in positions:
            recruitment_id = position.recruitment.id

            # Determine number of applicants for this position (between 3 and 9)
            num_applicants = randint(3, min(9, len(applicant_users)))

            # Find eligible users for this position
            # Prioritize users with fewer applications to this recruitment
            eligible_for_position = []
            for user in applicant_users:
                # Initialize user's recruitment map if needed
                if user.id not in user_recruitment_map:
                    user_recruitment_map[user.id] = {}

                # Initialize recruitment counter if needed
                if recruitment_id not in user_recruitment_map[user.id]:
                    user_recruitment_map[user.id][recruitment_id] = 0

                # Add user to eligible list
                eligible_for_position.append((user, user_recruitment_map[user.id][recruitment_id]))

            # Sort by application count (users with fewer applications first)
            eligible_for_position.sort(key=lambda x: x[1])

            # Select first N users
            selected_users = [user for user, _ in eligible_for_position[:num_applicants]]

            # Create applications for selected users
            for user in selected_users:
                # Increment user's priority counter for this recruitment
                user_recruitment_map[user.id][recruitment_id] += 1

                # Create application with priority based on how many applications they've made to this recruitment
                application = create_application(
                    position=position,
                    user=user,
                    recruitment_id=recruitment_id,
                    priority=user_recruitment_map[user.id][recruitment_id],
                )

                applications_to_create.append(application)

            positions_processed += 1
            if positions_processed % 10 == 0:
                progress = 10 + (positions_processed / len(positions) * 70)
                yield progress, f'Processed {positions_processed}/{len(positions)} positions'

        # Create applications in batches for better performance
        if applications_to_create:
            # Split into batches if there are many applications
            batch_size = 500
            total_created = 0

            for i in range(0, len(applications_to_create), batch_size):
                batch = applications_to_create[i : i + batch_size]
                RecruitmentApplication.objects.bulk_create(batch)

                total_created += len(batch)
                progress = 80 + (total_created / len(applications_to_create) * 20)
                yield progress, f'Created {total_created} of {len(applications_to_create)} applications'

    # Verify that each position has the correct number of applicants
    position_applicant_counts = {}
    for position in positions:
        count = RecruitmentApplication.objects.filter(recruitment_position=position).count()
        position_applicant_counts[position.id] = count

    min_applicants = min(position_applicant_counts.values()) if position_applicant_counts else 0
    max_applicants = max(position_applicant_counts.values()) if position_applicant_counts else 0

    actual_created = RecruitmentApplication.objects.count()
    yield 100, f'Created {actual_created} recruitment applications. Each position has between {min_applicants} and {max_applicants} applicants.'
