# TODO should probably import all models here instead of referring to
# things like samfundet.models.general

# This is required for registering user model in auth
from __future__ import annotations

from .event import (
    Event,
)
from .general import (
    Gang,
    User,
    Image,
    Profile,
    GangSection,
    Organization,
    UserPreference,
)

__all__ = [
    'User',
    'Gang',
    'GangSection',
    'Organization',
    'Event',
    'Image',
    'Profile',
    'UserPreference',
]
