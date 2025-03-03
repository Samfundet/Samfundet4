from __future__ import annotations

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
    Seed recruitment applications with deterministic behavior

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

    # Organize positions by recruitment
    positions_by_recruitment: dict[int, list[RecruitmentPosition]] = {}
    for position in positions:
        recruitment_id = position.recruitment.id
        if recruitment_id not in positions_by_recruitment:
            positions_by_recruitment[recruitment_id] = []
        positions_by_recruitment[recruitment_id].append(position)

    # Sort recruitment IDs for consistency
    recruitment_ids = sorted(positions_by_recruitment.keys())

    # Get eligible applicant users (already sorted by ID)
    applicant_users = get_applicant_users()
    if not applicant_users:
        yield 100, 'No eligible users found, nothing to seed'
        return

    yield 10, f'Found {len(applicant_users)} eligible users and {len(positions)} positions'

    applications_to_create = []
    users_processed = 0


    # Use transaction for better performance
    with transaction.atomic():
        # Distribute users evenly across recruitments
        for i, user in enumerate(applicant_users):
            # Determine which recruitment this user applies to (cycle through them)
            recruitment_index = i % len(recruitment_ids)
            recruitment_id = recruitment_ids[recruitment_index]

            # Get positions for this recruitment
            recruitment_positions = positions_by_recruitment[recruitment_id]

            # Each user applies to exactly 3 positions (or fewer if not enough positions)
            num_applications = min(3, len(recruitment_positions))

            # Choose positions deterministically based on user ID
            for j in range(num_applications):
                # Select position based on user ID (cycle through positions)
                position_index = (i + j) % len(recruitment_positions)
                position = recruitment_positions[position_index]

                # Create application with sequential priority (1, 2, 3)
                application = create_application(
                    position=position,
                    user=user,
                    recruitment_id=recruitment_id,
                    priority=j + 1,
                )

                applications_to_create.append(application)

            users_processed += 1
            if users_processed % 20 == 0:
                progress = 10 + (users_processed / len(applicant_users) * 70)
                yield progress, f'Processed {users_processed}/{len(applicant_users)} users'

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

    actual_created = RecruitmentApplication.objects.count()
    yield 100, f'Created {actual_created} recruitment applications. Every user has exactly 3 applications (or fewer if not enough positions).'
