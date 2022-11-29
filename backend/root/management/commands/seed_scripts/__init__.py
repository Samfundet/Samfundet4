import root.management.commands.seed_scripts.gangs as gangs
import root.management.commands.seed_scripts.venues as venues
import root.management.commands.seed_scripts.events as events
import root.management.commands.seed_scripts.menu as menu
import root.management.commands.seed_scripts.example as example

# Insert seed scripts here (in order of priority)
# Format is (name, seed_function).

# If a seed function is slow, it may optionally yield a percent value
# between 0-100 at given points to show a progress indicator in the terminal
# It can also yield a text description of the current state (see example.py)

SEED_SCRIPTS = [
    ("gang", gangs.seed),
    ("venue", venues.seed),
    ("event", events.seed),
    ("menu", menu.seed),

    # Example seed (not run unless targeted specifically)
    ("example", example.seed),
]
