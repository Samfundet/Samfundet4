from __future__ import annotations

from samfundet.samf3_import.base import Samf3Importer

# All importers, in the order they run. Put an importer after the ones it depends on,
# e.g. events after images once those exist.
IMPORTERS: list[type[Samf3Importer]] = []
