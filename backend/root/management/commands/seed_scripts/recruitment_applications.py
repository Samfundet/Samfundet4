from __future__ import annotations

from random import choice, randint
from datetime import timedelta

from django.utils import timezone

from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication, RecruitmentStatusChoices, RecruitmentPriorityChoices

# Sample application texts for more realistic data
APPLICATION_TEXTS = [
    'I am very interested in this position and would love to contribute to Samfundet.',
    'I have relevant experience and am excited about this opportunity.',
    'This position aligns perfectly with my interests and skills.',
    'I would be honored to join the team and contribute my expertise.',
    'I am passionate about this role and eager to learn and grow.',
]


def ensure_valid_recruitment_dates(position):
    """Updates recruitment dates to ensure applications can be created."""
    recruitment = position.recruitment
    now = timezone.now()

    # Only update if the deadline has passed
    if recruitment.actual_application_deadline <= now:
        recruitment.visible_from = now - timedelta(days=1)
        recruitment.shown_application_deadline = now + timedelta(days=29)
        recruitment.actual_application_deadline = now + timedelta(days=30)
        recruitment.reprioritization_deadline_for_applicant = now + timedelta(days=35)
        recruitment.reprioritization_deadline_for_groups = now + timedelta(days=40)
        recruitment.save()

    return recruitment


def get_priority_for_user(user, recruitment):
    """Determines the next available priority for a user's applications."""
    existing_count = RecruitmentApplication.objects.filter(user=user, recruitment=recruitment, withdrawn=False).count()
    return existing_count + 1


def seed():  # noqa: C901
    """
    Seeds recruitment applications with realistic data while respecting application
    constraints and deadlines.
    """
    yield 0, 'recruitment_applications'

    # Clear existing applications
    RecruitmentApplication.objects.all().delete()
    yield 10, 'Deleted old applications'

    positions = RecruitmentPosition.objects.all()
    users = list(User.objects.all())  # Convert to list to avoid multiple DB hits
    created_count = 0

    for position_index, position in enumerate(positions):
        # Ensure recruitment dates are valid
        recruitment = ensure_valid_recruitment_dates(position)

        # Create between 0 and 5 applications for each position
        num_applications = randint(0, 5)

        for _ in range(num_applications):
            # Select a random user who hasn't exceeded application limit
            user = choice(users)

            # Check if user has reached max applications (if limit exists)
            if recruitment.max_applications:
                existing_apps = RecruitmentApplication.objects.filter(user=user, recruitment=recruitment, withdrawn=False).count()
                if existing_apps >= recruitment.max_applications:
                    continue

            # Check if user already applied for this position
            if RecruitmentApplication.objects.filter(user=user, recruitment_position=position, withdrawn=False).exists():
                continue

            # Create application data
            application_data = {
                'recruitment_position': position,
                'recruitment': recruitment,
                'user': user,
                'application_text': choice(APPLICATION_TEXTS),
                'applicant_priority': get_priority_for_user(user, recruitment),
                'recruiter_priority': choice(list(RecruitmentPriorityChoices)).value,
                'recruiter_status': choice(list(RecruitmentStatusChoices)).value,
                'withdrawn': False,
            }

            try:
                application = RecruitmentApplication.objects.create(**application_data)
                created_count += 1

                # Update applicant state after creation
                application.update_applicant_state()

            except Exception as e:
                yield (position_index + 1) / len(positions), f'Error creating application: {str(e)}'
                continue

        progress = ((position_index + 1) / len(positions)) * 100
        yield progress, f'Processing position {position_index + 1} of {len(positions)}'

    yield 100, f'Successfully created {created_count} recruitment applications'
