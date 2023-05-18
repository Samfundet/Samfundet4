# TODO should probably import all models here instead of referring to
# things like samfundet.models.general

# This is required for registering user model in auth
from .general import (User, Profile, UserPreference, Gang)

from .event import (
    Event,
)

__all__ = ['User', 'Profile', 'UserPreference', 'Event', 'Gang']
