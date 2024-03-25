from __future__ import annotations


def ellipsize(string: str, *, length: int) -> str:
    """Shortens a string to a given length and adds ellipsis if the string is longer than the given length."""
    return string[0:length] + '...' if len(string) > length else string
