from typing import Union

# Oftentimes we don't care about if parameters are string or integer.
# Typically when composing url strings or filtering in Django ORM.
# This is a shorter notation in signatures etc.
StrInt = Union[str, int]
