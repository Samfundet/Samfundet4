from __future__ import annotations


def parse_float(value: str, default: float = 0.0) -> float:
    """Parse a float, returning the default when the value is malformed."""
    try:
        return float(value)
    except ValueError:
        return default


def parse_int(value: str, default: int = 0) -> int:
    """Parse an int, returning the default when the value is malformed."""
    try:
        return int(value)
    except ValueError:
        return default
