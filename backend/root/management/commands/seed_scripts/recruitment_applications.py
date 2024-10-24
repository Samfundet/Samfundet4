from __future__ import annotations

from random import choice, sample, randint

from django.db import transaction
from django.contrib.auth.hashers import make_password

from samfundet.models.general import User, Campus
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication

# Example data for applications
APPLICATION_DATA = {
    'application_text': 'This is the application text written by the applicant.',
    'applicant_priority': 0,
    'recruiter_priority': 0,
    'recruiter_status': 0,
}


class ApplicantGenerator:
    FIRST_NAMES = ['Ole', 'Lars', 'Anders', 'Magnus', 'Erik', 'Jonas', 'Henrik', 'Emma', 'Nora', 'Ida', 'Sara', 'Maria', 'Anna', 'Ingrid']
    LAST_NAMES = ['Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen']
    EMAIL_DOMAINS = ['soker.no', 'applicant.com', 'applying.no']

    def __init__(self):
        self.used_usernames = set(User.objects.filter(username__startswith='APLCT-').values_list('username', flat=True))
        self.used_emails = set(User.objects.filter(username__startswith='APLCT-').values_list('email', flat=True))
        # Pre-hash the default password
        self.hashed_password = make_password('Django123')

    def _normalize_string(self, text: str) -> str:
        chars_map = {'æ': 'ae', 'ø': 'o', 'å': 'a', 'Æ': 'ae', 'Ø': 'o', 'Å': 'a'}
        for old, new in chars_map.items():
            text = text.replace(old, new)
        return text.lower()

    def generate_user_data(self, firstname: str, lastname: str) -> tuple[str, str]:
        firstname_norm = self._normalize_string(firstname)
        lastname_norm = self._normalize_string(lastname)

        base_username = f'APLCT-{firstname_norm[:3]}{lastname_norm[:3]}'
        username = base_username
        counter = 1

        while username in self.used_usernames:
            username = f'{base_username}{counter}'
            counter += 1

        email = f'{username}@{choice(self.EMAIL_DOMAINS)}'
        while email in self.used_emails:
            email = f'{username}{counter}@{choice(self.EMAIL_DOMAINS)}'
            counter += 1

        self.used_usernames.add(username)
        self.used_emails.add(email)
        return username, email

    def generate_users_batch(self, count: int, campus_list: list[Campus]) -> list[User]:
        users = []
        for _ in range(count):
            firstname = choice(self.FIRST_NAMES)
            lastname = choice(self.LAST_NAMES)
            username, email = self.generate_user_data(firstname, lastname)

            user = User(
                username=username,
                email=email,
                password=self.hashed_password,  # Use pre-hashed password
                first_name=f'APLCT-{firstname}',
                last_name=lastname,
                is_superuser=False,
                campus=choice(campus_list),
            )
            users.append(user)
        return users


def distribute_applications(
    user_ids: list[int],
    positions: list[RecruitmentPosition],
) -> list[dict]:
    """
    Distribute applications among users ensuring each user applies to multiple positions.
    Returns a list of application data dictionaries.
    """
    applications = []
    positions_by_recruitment = {}

    # Group positions by recruitment
    for position in positions:
        if position.recruitment_id not in positions_by_recruitment:
            positions_by_recruitment[position.recruitment_id] = []
        positions_by_recruitment[position.recruitment_id].append(position)

    # For each user, select 2-5 positions from each recruitment period they're interested in
    for user_id in user_ids:
        # Randomly select 1-3 recruitment periods for this user
        num_recruitments = randint(1, min(3, len(positions_by_recruitment)))
        selected_recruitments = sample(list(positions_by_recruitment.keys()), num_recruitments)

        for recruitment_id in selected_recruitments:
            recruitment_positions = positions_by_recruitment[recruitment_id]
            # Apply for 2-5 positions in this recruitment period
            num_positions = randint(2, min(5, len(recruitment_positions)))
            selected_positions = sample(recruitment_positions, num_positions)

            # Create applications for selected positions
            for position in selected_positions:
                application_data = APPLICATION_DATA.copy()
                application_data.update(
                    {
                        'recruitment_position_id': position.id,
                        'recruitment_id': recruitment_id,
                        'user_id': user_id,
                        'applicant_priority': randint(1, num_positions),  # Set a random priority
                    }
                )
                applications.append(application_data)

    return applications


def seed():
    yield 0, 'recruitment_applications'

    # Clean up existing data
    RecruitmentApplication.objects.all().delete()
    yield 10, 'Deleted old applications'

    User.objects.filter(username__startswith='APLCT-').delete()
    yield 20, 'Deleted old applicant users'

    # Create new applicant users
    applicant_generator = ApplicantGenerator()
    campus_list = list(Campus.objects.all())
    total_applicants = 1200
    batch_size = 100

    # Create users in batches and save them
    with transaction.atomic():
        for i in range(0, total_applicants, batch_size):
            current_batch = min(batch_size, total_applicants - i)
            user_batch = applicant_generator.generate_users_batch(current_batch, campus_list)
            User.objects.bulk_create(user_batch)
            yield 20 + (i + current_batch) / total_applicants * 30, f'Created {i + current_batch} applicant users'

    # Get all positions and applicant user IDs
    positions = list(RecruitmentPosition.objects.all().select_related('recruitment'))
    applicant_user_ids = list(User.objects.filter(username__startswith='APLCT-').values_list('id', flat=True))

    # Create applications data
    all_applications = distribute_applications(applicant_user_ids, positions)
    applications_created = 0
    batch_size = 100

    # Create applications in batches
    for i in range(0, len(all_applications), batch_size):
        batch = all_applications[i : i + batch_size]
        RecruitmentApplication.objects.bulk_create([RecruitmentApplication(**data) for data in batch])
        applications_created += len(batch)

        if i % 1000 == 0:  # Report progress every 1000 applications
            progress = 50 + (i / len(all_applications) * 50)
            yield min(progress, 100), f'Created {applications_created} applications'

    # Calculate some statistics for the final message
    total_users = len(applicant_user_ids)
    avg_applications = applications_created / total_users

    yield (
        100,
        (
            f'Created {applications_created} recruitment applications '
            f'for {total_users} applicant users '
            f'(average {avg_applications:.1f} applications per user)'
        ),
    )
