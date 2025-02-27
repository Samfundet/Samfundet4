from __future__ import annotations

from random import sample, randint
from django.db import transaction

from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentApplication
from samfundet.models.role import UserOrgRole, UserGangRole, UserGangSectionRole

# Some example data to use for the new RecruitmentApplication instances
APPLICATION_DATA = {
    'application_text': 'This is the application text',
    'applicant_priority': 0,
    'recruiter_priority': 0,
    'recruiter_status': 0,
}


def seed():
    yield 0, 'recruitment_applications'
    RecruitmentApplication.objects.all().delete()
    yield 0, 'Deleted old applications'

    # Fetch all positions at once
    positions = list(RecruitmentPosition.objects.select_related('recruitment').all())
    if not positions:
        yield 100, 'No positions found, nothing to seed'
        return
        
    # Get all users with roles (use separate queries and combine results)
    users_with_org_roles = set(UserOrgRole.objects.values_list('user_id', flat=True))
    users_with_gang_roles = set(UserGangRole.objects.values_list('user_id', flat=True))
    users_with_section_roles = set(UserGangSectionRole.objects.values_list('user_id', flat=True))
    
    # Combine all users with roles
    users_with_roles = users_with_org_roles | users_with_gang_roles | users_with_section_roles
    
    # Get eligible users in a single query - use prefetch to make it faster
    eligible_users = list(User.objects.filter(
        is_staff=False, 
        is_superuser=False
    ).exclude(
        id__in=users_with_roles
    ))
    
    if not eligible_users:
        yield 100, 'No eligible users found, nothing to seed'
        return
        
    yield 10, f'Found {len(eligible_users)} eligible users and {len(positions)} positions'
    
    # Prepare applications in bulk
    applications_to_create = []
    created_count = 0
    
    # Use transaction for better performance
    with transaction.atomic():
        for position_index, position in enumerate(positions):
            # Determine how many applications to create for this position
            num_applications = min(randint(0, 5), len(eligible_users))
            if num_applications == 0:
                continue
                
            # Select random users for this position
            selected_users = sample(eligible_users, num_applications)
            
            # Create application objects
            for user in selected_users:
                application = RecruitmentApplication(
                    recruitment_position=position,
                    recruitment=position.recruitment,
                    user=user,
                    application_text=APPLICATION_DATA['application_text'],
                    applicant_priority=APPLICATION_DATA['applicant_priority'],
                    recruiter_priority=APPLICATION_DATA['recruiter_priority'],
                    recruiter_status=APPLICATION_DATA['recruiter_status']
                )
                applications_to_create.append(application)
                created_count += 1
                
            # Update progress periodically
            if position_index % 10 == 0 or position_index == len(positions) - 1:
                yield (position_index + 1) / len(positions) * 90, f'Prepared {created_count} applications'
        
        # Bulk create all applications at once
        if applications_to_create:
            # Split into batches if there are many applications
            batch_size = 500
            for i in range(0, len(applications_to_create), batch_size):
                batch = applications_to_create[i:i+batch_size]
                RecruitmentApplication.objects.bulk_create(batch)
                yield 90 + (i / len(applications_to_create) * 10), f'Created {i+len(batch)} of {len(applications_to_create)} applications'
    
    yield 100, f'Created {created_count} recruitment_applications'
