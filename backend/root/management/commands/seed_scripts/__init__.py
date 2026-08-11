from __future__ import annotations

from . import (
    mdb,
    menu,
    gangs,
    merch,
    roles,
    samf3,
    billig,
    campus,
    events,
    images,
    venues,
    example,
    blogposts,
    documents,
    textitems,
    superusers,
    recruitment,
    organizations,
    applicant_users,
    users_with_roles,
    information_pages,
    recruitment_position,
    recruitment_applications,
    recruitment_occupied_time,
    recruitment_separate_position,
    recruitment_interviewavailability,
    recruitment_position_interviewers,
    recruitment_sharedinterviewgroups,
)

# Insert seed scripts here (in order of priority)
# Format is (name, seed_function).

# If a seed function is slow, it may optionally yield a percent value
# between 0-100 at given points to show a progress indicator in the terminal
# It can also yield a text description of the current state (see example.py)

SEED_SCRIPTS = [
    ('mdb', mdb.seed),
    ('campus', campus.seed),
    ('users', superusers.seed),
    ('images', images.seed),
    ('organization', organizations.seed),
    ('gang', gangs.seed),
    ('venue', venues.seed),
    ('event', events.seed),
    ('billig', billig.seed),
    ('menu', menu.seed),
    ('documents', documents.seed),
    ('information_page', information_pages.seed),
    ('textitems', textitems.seed),
    ('blogposts', blogposts.seed),
    ('merch', merch.seed),
    ('roles', roles.seed),
    ('users_with_roles', users_with_roles.seed),
    ('applicant_users', applicant_users.seed),
    ('recruitment', recruitment.seed),
    ('recruitment_position', recruitment_position.seed),
    ('recruitment_position_shared_interview', recruitment_sharedinterviewgroups.seed),
    ('recruitment_interviewavailability', recruitment_interviewavailability.seed),
    ('recruitment_separate_position', recruitment_separate_position.seed),
    ('recruitment_applications', recruitment_applications.seed),
    ('recruitment_position_interviewers', recruitment_position_interviewers.seed),
    ('recruitment_occupied_time', recruitment_occupied_time.seed),
    # Example seed (not run unless targeted specifically)
    ('example', example.seed),
]

# These are not run by default (only when seeded specifically)
OPTIONAL_SEED_SCRIPTS = [
    ('samf3', samf3.seed),
]
