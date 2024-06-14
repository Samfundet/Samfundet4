from __future__ import annotations

import random


def generate_random_hex_color() -> str:
    # Generate a random integer between 0 and 16777215 (0xFFFFFF)
    random_number = random.randint(0, 0xFFFFFF)
    # Convert the integer to a hexadecimal string and pad with leading zeros if necessary
    hex_color = f'#{random_number:06X}'
    return hex_color
