from __future__ import annotations

from . import (
    menu,
    gangs,
    merch,
    samf3,
    users,
    billig,
    campus,
    events,
    images,
    venues,
    example,
    blogposts,
    documents,
    textitems,
    recruitment,
    organizations,
    information_pages,
    recruitment_position,
    recruitment_applications,
    recruitment_seperate_position,
    recruitment_interviewavailability,
)

# Insert seed scripts here (in order of priority)
# Format is (name, seed_function).

# If a seed function is slow, it may optionally yield a percent value
# between 0-100 at given points to show a progress indicator in the terminal
# It can also yield a text description of the current state (see example.py)

SEED_SCRIPTS = [
    ('campus', campus.seed),
    ('users', users.seed),
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
    ('recruitment', recruitment.seed),
    ('recruitment_position', recruitment_position.seed),
    ('recruitment_interviewavailability', recruitment_interviewavailability.seed),
    ('recruitment_seperate_position', recruitment_seperate_position.seed),
    ('recruitment_applications', recruitment_applications.seed),
    # Example seed (not run unless targeted specifically)
    ('example', example.seed),
]

# These are not run by default (only when seeded specifically)
OPTIONAL_SEED_SCRIPTS = [
    ('samf3', samf3.seed),
]
