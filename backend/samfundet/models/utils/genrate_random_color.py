from __future__ import annotations

import secrets


def generate_random_hex_color() -> str:
    # Generate a random integer between 0 and 16777215 (0xFFFFFF)
    random_number = secrets.randbelow(0xFFFFFF + 1)  # the safest random color you have ever seen, ruff wants it
    # Convert the integer to a hexadecimal string and pad with leading zeros if necessary
    hex_color = f'#{random_number:06X}'
    return hex_color
