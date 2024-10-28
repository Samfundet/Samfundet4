from __future__ import annotations

from random import sample, randint
from collections import defaultdict

from django.db import transaction

from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication


def seed():
    yield 0, 'recruitment_interviewers'

    # Bulk clear all interviewer relationships in one query
    RecruitmentPosition.interviewers.through.objects.all().delete()
    yield 10, 'Cleared old interviewers'

    # Get all applications data first, using defaultdict to automatically handle grouping
    applications_data = defaultdict(set)
    for pos_id, user_id in RecruitmentApplication.objects.values_list('recruitment_position_id', 'user_id'):
        applications_data[pos_id].add(user_id)

    # Get all positions
    positions = list(RecruitmentPosition.objects.all())

    # Get all eligible interviewers once (excluding applicants)
    eligible_interviewers = list(User.objects.exclude(first_name__startswith='APLCT').values_list('id', flat=True))

    if len(eligible_interviewers) < 3:
        yield 100, 'Not enough eligible interviewers'
        return

    # Prepare bulk creation data
    through_model = RecruitmentPosition.interviewers.through
    bulk_create_data = []
    created_count = 0
    positions_processed = 0

    # Process positions in batches for better memory management
    BATCH_SIZE = 100
    total_positions = len(positions)

    with transaction.atomic():
        for batch_start in range(0, total_positions, BATCH_SIZE):
            batch_end = min(batch_start + BATCH_SIZE, total_positions)
            position_batch = positions[batch_start:batch_end]

            for position in position_batch:
                # Get applicant IDs for this position
                applicant_ids = applications_data.get(position.id, set())

                # Filter eligible interviewers for this position
                available_interviewers = [interviewer_id for interviewer_id in eligible_interviewers if interviewer_id not in applicant_ids]

                if len(available_interviewers) < 3:
                    continue

                # Select random interviewers
                num_interviewers = randint(3, min(6, len(available_interviewers)))
                selected_interviewer_ids = sample(available_interviewers, num_interviewers)

                # Prepare bulk creation data
                for interviewer_id in selected_interviewer_ids:
                    bulk_create_data.append(through_model(recruitmentposition_id=position.id, user_id=interviewer_id))
                created_count += num_interviewers
                positions_processed += 1

            # Bulk create interviewer assignments for this batch
            if bulk_create_data:
                through_model.objects.bulk_create(bulk_create_data)
                bulk_create_data = []  # Clear for next batch

            progress = min(100, (batch_end / total_positions) * 90 + 10)
            yield progress, f'Processed {batch_end}/{total_positions} positions'

    yield 100, f'Assigned {created_count} interviewers to {positions_processed} out of {total_positions} positions'
