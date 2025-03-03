from __future__ import annotations

from random import sample, randint
from collections import defaultdict
from collections.abc import Callable, Generator
from typing import Any

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
    return eligible_users


def group_positions_by_recruitment(positions: list[RecruitmentPosition]) -> dict[int, list[RecruitmentPosition]]:
    """
    Group positions by their recruitment ID for more realistic application behavior

    Returns:
        Dictionary mapping recruitment IDs to lists of positions
    """
    positions_by_recruitment = defaultdict(list)
    for position in positions:
        positions_by_recruitment[position.recruitment.id].append(position)
    return positions_by_recruitment


def generate_application_text(position: RecruitmentPosition) -> str:
    """
    Generate application text based on the position properties

    Returns:
        Application text string
    """
    if position.tags:
        return f"I'm interested in the {position.name_en} position because of my experience with {position.tags.split(',')[0]}"
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
        applicant_priority=priority,  # Priority starts from 1, not 0
        recruiter_priority=0,
        recruiter_status=0,
    )


def ensure_initial_applications(  # noqa: C901
    applicant_users: list[User], positions_by_recruitment: dict[int, list[RecruitmentPosition]], yield_func: Callable[[float, str], Any]
) -> tuple[list[RecruitmentApplication], dict[int, dict[int, list[RecruitmentApplication]]], dict[int, int]]:
    """
    First pass: ensure each user has applications for at least one recruitment

    Returns:
        Tuple of (applications_to_create, user_applications_by_recruitment, total_applications_per_user)
    """
    applications_to_create: list[RecruitmentApplication] = []
    # Track applications per user for each recruitment
    user_applications_by_recruitment: defaultdict[int, defaultdict[int, list[RecruitmentApplication]]] = defaultdict(lambda: defaultdict(list))
    # Track total applications per user across all recruitments
    total_applications_per_user: defaultdict[int, int] = defaultdict(int)
    created_count = 0

    for user_idx, user in enumerate(applicant_users):
        # Choose a random recruitment for this user
        if positions_by_recruitment:
            recruitment_id = sample(list(positions_by_recruitment.keys()), 1)[0]
            recruitment_positions = positions_by_recruitment[recruitment_id]

            # Ensure user gets 3-5 positions for this recruitment
            # (or all positions if fewer are available)
            num_applications = min(randint(3, 5), len(recruitment_positions))

            if num_applications > 0:
                # Select random positions for this user
                selected_positions = sample(recruitment_positions, num_applications)

                # Create application objects with sequential priority (1, 2, 3...)
                for i, position in enumerate(selected_positions):
                    application = create_application(
                        position=position,
                        user=user,
                        recruitment_id=recruitment_id,
                        priority=i + 1,  # Start from 1, not 0
                    )

                    # Store for bulk creation and priority checking
                    applications_to_create.append(application)
                    user_applications_by_recruitment[user.id][recruitment_id].append(application)
                    total_applications_per_user[user.id] += 1
                    created_count += 1

        # User progress update (every 20 users)
        if user_idx % 20 == 0:
            user_progress = user_idx / len(applicant_users)
            yield_func(10 + (user_progress * 40), f'Processed {user_idx}/{len(applicant_users)} users (initial pass)')

    return applications_to_create, dict(user_applications_by_recruitment), dict(total_applications_per_user)


def get_available_positions(
    user_id: int,
    recruitment_id: int,
    positions: list[RecruitmentPosition],
    user_applications_by_recruitment: dict[int, dict[int, list[RecruitmentApplication]]],
) -> list[RecruitmentPosition]:
    """
    Get positions that a user hasn't applied to yet in a specific recruitment

    Returns:
        List of available positions
    """
    # Get all position IDs this user has already applied to (across all recruitments)
    existing_position_ids = {app.recruitment_position_id for apps in user_applications_by_recruitment[user_id].values() for app in apps}

    # Filter out positions the user has already applied to
    return [p for p in positions if p.id not in existing_position_ids]


def ensure_minimum_applications(  # noqa: C901
    applicant_users: list[User],
    positions_by_recruitment: dict[int, list[RecruitmentPosition]],
    user_applications_by_recruitment: dict[int, dict[int, list[RecruitmentApplication]]],
    total_applications_per_user: dict[int, int],
    applications_to_create: list[RecruitmentApplication],
    yield_func: Callable[[float, str], Any],
) -> tuple[list[RecruitmentApplication], dict[int, int]]:
    """
    Second pass: add more applications for users who have fewer than 3

    Returns:
        Updated applications_to_create and total_applications_per_user
    """
    for user_idx, user in enumerate(applicant_users):
        # If user doesn't have at least 3 applications, add more
        while total_applications_per_user[user.id] < 3:
            # Choose a random recruitment
            if positions_by_recruitment:
                recruitment_id = sample(list(positions_by_recruitment.keys()), 1)[0]
                recruitment_positions = positions_by_recruitment[recruitment_id]

                # Only consider positions the user hasn't applied to yet
                available_positions = get_available_positions(
                    user_id=user.id,
                    recruitment_id=recruitment_id,
                    positions=recruitment_positions,
                    user_applications_by_recruitment=user_applications_by_recruitment,
                )

                if not available_positions:
                    # If no positions left in this recruitment, try another one
                    continue

                # Add one more application
                position = sample(available_positions, 1)[0]

                # Get the next priority number for this user in this recruitment
                # We want to continue the sequence (1, 2, 3...)
                current_apps = user_applications_by_recruitment[user.id][recruitment_id]
                next_priority = len(current_apps) + 1  # Start from 1

                application = create_application(position=position, user=user, recruitment_id=recruitment_id, priority=next_priority)

                # Store for bulk creation and tracking
                applications_to_create.append(application)
                user_applications_by_recruitment[user.id][recruitment_id].append(application)
                total_applications_per_user[user.id] += 1
            else:
                # No recruitments available
                break

        # User progress update (every 20 users)
        if user_idx % 20 == 0:
            user_progress = user_idx / len(applicant_users)
            # Changed: Use the yield_func callback instead of yielding directly
            yield_func(50 + (user_progress * 20), f'Processed {user_idx}/{len(applicant_users)} users (second pass)')

    return applications_to_create, total_applications_per_user


def get_application_distribution(total_applications_per_user: dict[int, int]) -> str:
    """
    Generate a statistics string showing application distribution

    Returns:
        Formatted statistics string
    """
    app_count_stats: defaultdict[int, int] = defaultdict(int)
    for count in total_applications_per_user.values():
        app_count_stats[count] += 1

    return ', '.join([f'{count} apps: {users} users' for count, users in sorted(app_count_stats.items())])


def create_applications_in_batches(applications_to_create: list[RecruitmentApplication], yield_func: Generator) -> Generator[tuple[float, str], None, None]:
    """Create applications in batches for better performance"""
    if not applications_to_create:
        return

    # Split into batches if there are many applications
    batch_size = 500
    for i in range(0, len(applications_to_create), batch_size):
        batch = applications_to_create[i : i + batch_size]
        RecruitmentApplication.objects.bulk_create(batch)

        progress = 75 + ((i + len(batch)) / len(applications_to_create) * 25)
        next(yield_func)  # Call the generator to yield progress
        yield progress, f'Created {i + len(batch)} of {len(applications_to_create)} applications'


def calculate_success_stats(total_applications_per_user: dict[int, int]) -> tuple[int, int, float]:
    """
    Calculate statistics for the seeding process

    Returns:
        Tuple of (users_with_3_to_5, total_users, success_rate)
    """
    users_with_3_to_5 = sum(1 for count in total_applications_per_user.values() if 3 <= count <= 5)
    total_users = len(total_applications_per_user)
    success_rate = (users_with_3_to_5 / total_users * 100) if total_users > 0 else 0

    return users_with_3_to_5, total_users, success_rate


def seed() -> Generator[tuple[float, str], None, None]:
    """
    Seed recruitment applications

    Yields:
        Tuples of (progress percentage, status message)
    """
    yield 0, 'recruitment_applications'
    RecruitmentApplication.objects.all().delete()
    yield 0, 'Deleted old applications'

    # Fetch all positions at once
    positions = list(RecruitmentPosition.objects.select_related('recruitment', 'gang').all())
    if not positions:
        yield 100, 'No positions found, nothing to seed'
        return

    # Group positions by recruitment for more realistic application behavior
    positions_by_recruitment = group_positions_by_recruitment(positions)

    # Get eligible applicant users
    applicant_users = get_applicant_users()
    if not applicant_users:
        yield 100, 'No eligible users found, nothing to seed'
        return

    yield 10, f'Found {len(applicant_users)} eligible users and {len(positions)} positions'

    # Use transaction for better performance
    with transaction.atomic():
        # Create a generator to yield progress
        def progress_generator():
            while True:
                yield

        yield_func = progress_generator()

        # First pass: ensure each user has applications for at least one recruitment
        applications_to_create, user_applications_by_recruitment, total_applications_per_user = ensure_initial_applications(
            applicant_users=applicant_users, positions_by_recruitment=positions_by_recruitment, yield_func=yield_func
        )

        # Second pass: add more applications for users who have fewer than 3
        applications_to_create, total_applications_per_user = ensure_minimum_applications(
            applicant_users=applicant_users,
            positions_by_recruitment=positions_by_recruitment,
            user_applications_by_recruitment=user_applications_by_recruitment,
            total_applications_per_user=total_applications_per_user,
            applications_to_create=applications_to_create,
            yield_func=yield_func,
        )

        # Display application distribution stats
        stats_str = get_application_distribution(total_applications_per_user)
        yield 75, f'Application distribution: {stats_str}'

        # Create applications in batches
        create_applications_in_batches(applications_to_create=applications_to_create, yield_func=yield_func)

    # Calculate and display final statistics
    users_with_3_to_5, total_users, success_rate = calculate_success_stats(total_applications_per_user)

    created_count = len(applications_to_create)
    yield (
        100,
        f'Created {created_count} recruitment_applications. {users_with_3_to_5}/{total_users} users ({success_rate:.1f}%) have 3-5 applications. All priorities are sequential (1, 2, 3...).',
    )
