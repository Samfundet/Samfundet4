# TODO should probably import all models here instead of referring to
# things like samfundet.models.general

# This is required for registering user model in auth
from .general import (
    User,
    Profile,
    UserPreference,
)

__all__ = ['User', 'Profile', 'UserPreference']
