# TODO should probably import all models here instead of referring to
# things like samfundet.models.general

# This is required for registering user model in auth
from __future__ import annotations

# Models living in a domain subpackage must still be imported here. Django discovers models by
# importing '<app>.models', so anything it cannot reach from this module is invisible to it.
# Such a module must refer back to samfundet.models by string label only ('samfundet.Gang'), since
# importing it at runtime would cause circular import.
from samfundet.infopages.models import InformationPage, InformationPageRevision

from .event import (
    Event,
)
from .general import (
    Gang,
    User,
    Image,
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
    'UserPreference',
    'InformationPage',
    'InformationPageRevision',
]
