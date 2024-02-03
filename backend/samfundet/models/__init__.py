# TODO should probably import all models here instead of referring to
# things like samfundet.models.general

# This is required for registering user model in auth
from __future__ import annotations
from .general import (
    User,
    Gang,
    Image,
    Profile,
    UserPreference,
)

from .event import (
    Event,
)

__all__ = [
    'User',
    'Gang',
    'Event',
    'Image',
    'Profile',
    'UserPreference',
]
