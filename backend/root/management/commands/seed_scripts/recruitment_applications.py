from __future__ import annotations

from random import sample, randint, shuffle
from collections import defaultdict

from django.db import transaction  # type: ignore

from samfundet.models.role import UserOrgRole, UserGangRole, UserGangSectionRole
from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication


def get_applicant_users():
    """
    getts users with no roles, and which are not superusers or staff

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


def seed():  # noqa: C901
    yield 0, 'recruitment_applications'
    RecruitmentApplication.objects.all().delete()
    yield 0, 'Deleted old applications'

    # Fetch all positions at once, grouped by recruitment
    positions = list(RecruitmentPosition.objects.select_related('recruitment', 'gang').all())
    if not positions:
        yield 100, 'No positions found, nothing to seed'
        return

    # Group positions by recruitment for more realistic application behavior
    positions_by_recruitment = defaultdict(list)
    for position in positions:
        positions_by_recruitment[position.recruitment.id].append(position)

    applicant_users = get_applicant_users()

    if not applicant_users:
        yield 100, 'No eligible users found, nothing to seed'
        return

    yield 10, f'Found {len(applicant_users)} eligible users and {len(positions)} positions'

    # Prepare applications in bulk
    applications_to_create = []
    created_count = 0

    # Track applications per user for each recruitment
    user_applications_by_recruitment = defaultdict(lambda: defaultdict(list))

    # Track total applications per user across all recruitments
    total_applications_per_user = defaultdict(int)

    # Use transaction for better performance
    with transaction.atomic():
        recruitment_count = len(positions_by_recruitment)

        # First pass: ensure each user has applications for at least one recruitment
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

                    # Generate a unique set of priorities for this user's applications
                    priorities = list(range(num_applications))
                    shuffle(priorities)

                    # Create application objects
                    for i, position in enumerate(selected_positions):
                        application_text = (
                            f"I'm interested in the {position.name_en} position because of my experience with {position.tags.split(',')[0]}"
                            if position.tags
                            else "I'm interested in this position."
                        )

                        application = RecruitmentApplication(
                            recruitment_position=position,
                            recruitment_id=recruitment_id,
                            user=user,
                            application_text=application_text,
                            applicant_priority=priorities[i],
                            recruiter_priority=0,
                            recruiter_status=0,
                        )

                        # Store for bulk creation and priority checking
                        applications_to_create.append(application)
                        user_applications_by_recruitment[user.id][recruitment_id].append(application)
                        total_applications_per_user[user.id] += 1
                        created_count += 1

            # User progress update (every 20 users)
            if user_idx % 20 == 0:
                user_progress = user_idx / len(applicant_users)
                yield 10 + (user_progress * 40), f'Processed {user_idx}/{len(applicant_users)} users (initial pass)'

        # Second pass: add more applications for users who have fewer than 3
        for user_idx, user in enumerate(applicant_users):
            # If user doesn't have at least 3 applications, add more
            while total_applications_per_user[user.id] < 3:
                # Choose a random recruitment
                if positions_by_recruitment:
                    recruitment_id = sample(list(positions_by_recruitment.keys()), 1)[0]
                    recruitment_positions = positions_by_recruitment[recruitment_id]

                    # Only consider positions the user hasn't applied to yet
                    existing_position_ids = {app.recruitment_position_id for apps in user_applications_by_recruitment[user.id].values() for app in apps}
                    available_positions = [p for p in recruitment_positions if p.id not in existing_position_ids]

                    if not available_positions:
                        # If no positions left in this recruitment, try another one
                        continue

                    # Add one more application
                    position = sample(available_positions, 1)[0]

                    # Get the current highest priority for this user in this recruitment
                    current_apps = user_applications_by_recruitment[user.id][recruitment_id]
                    next_priority = len(current_apps)

                    application_text = (
                        f"I'm interested in the {position.name_en} position because of my experience with {position.tags.split(',')[0]}"
                        if position.tags
                        else "I'm interested in this position."
                    )

                    application = RecruitmentApplication(
                        recruitment_position=position,
                        recruitment_id=recruitment_id,
                        user=user,
                        application_text=application_text,
                        applicant_priority=next_priority,
                        recruiter_priority=0,
                        recruiter_status=0,
                    )

                    # Store for bulk creation and tracking
                    applications_to_create.append(application)
                    user_applications_by_recruitment[user.id][recruitment_id].append(application)
                    total_applications_per_user[user.id] += 1
                    created_count += 1
                else:
                    # No recruitments available
                    break

            # User progress update (every 20 users)
            if user_idx % 20 == 0:
                user_progress = user_idx / len(applicant_users)
                yield 50 + (user_progress * 20), f'Processed {user_idx}/{len(applicant_users)} users (second pass)'

        # Make sure priorities are consistent
        for recruitments in user_applications_by_recruitment.values():
            for recruitment_id, applications in recruitments.items():
                # Sort applications by priority
                applications.sort(key=lambda app: app.applicant_priority)

                # Ensure priorities are sequential (0, 1, 2...) without gaps
                for i, app in enumerate(applications):
                    app.applicant_priority = i

        # Bulk create all applications
        yield 70, f'Prepared {created_count} applications with organic priorities'

        # Count users by application count for stats
        app_count_stats = defaultdict(int)
        for count in total_applications_per_user.values():
            app_count_stats[count] += 1

        stats_str = ', '.join([f'{count} apps: {users} users' for count, users in sorted(app_count_stats.items())])
        yield 75, f'Application distribution: {stats_str}'

        if applications_to_create:
            # Split into batches if there are many applications
            batch_size = 500
            for i in range(0, len(applications_to_create), batch_size):
                batch = applications_to_create[i : i + batch_size]
                RecruitmentApplication.objects.bulk_create(batch)
                progress = 75 + ((i + len(batch)) / len(applications_to_create) * 25)
                yield progress, f'Created {i + len(batch)} of {len(applications_to_create)} applications'

    # Final stats
    users_with_3_to_5 = sum(1 for count in total_applications_per_user.values() if 3 <= count <= 5)
    total_users = len(total_applications_per_user)
    success_rate = (users_with_3_to_5 / total_users * 100) if total_users > 0 else 0

    yield 100, f'Created {created_count} recruitment_applications. {users_with_3_to_5}/{total_users} users ({success_rate:.1f}%) have 3-5 applications.'
