from __future__ import annotations
from typing import Union

# Oftentimes we don't care about if parameters are string or integer.
# Typically when composing url strings or filtering in Django ORM.
# This is a shorter notation in signatures etc.
StrInt = Union[str, int]

# Common insecure password used during development. Used for pytest etc...
DEV_PASSWORD = 'Django123'  # nosec: B105 # Allow password.
