# TODO should probably import all models here instead of referring to
# things like samfundet.models.general

# This is required for registering user model in auth
from __future__ import annotations

# Models living in a domain subpackage must still be imported here. Django discovers models by
# importing '<app>.models', so anything it cannot reach from this module is invisible to it.
# Such a module must refer back to samfundet.models by string label only ('samfundet.Gang'), since
# importing it at runtime would cause circular import.
from samfundet.infopages.models import InformationPage, InformationPageRevision
from samfundet.organization.models import Gang, GangType, GangSection, Organization

from .event import (
    Event,
)
from .general import (
    User,
    Image,
    UserPreference,
)

__all__ = [
    'User',
    'Gang',
    'GangType',
    'GangSection',
    'Organization',
    'Event',
    'Image',
    'UserPreference',
    'InformationPage',
    'InformationPageRevision',
]
