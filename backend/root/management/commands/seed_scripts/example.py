from __future__ import annotations
import time


def seed():
    count = 100
    for i in range(count):
        time.sleep(3 / count)
        yield int(i / count * 100), f'Did something cool in iteration {i}'
    yield 100, 'Done! How cool is that?'
