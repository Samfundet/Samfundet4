
import root.management.commands.seed_scripts.events as events

# Insert seed scripts here (in order of priority)
# Format is (alias, seed_function).
SEED_SCRIPTS = [
    ("event", events.seed)
]


