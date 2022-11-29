import math
import types
from typing import Union, Tuple
from django.core.management.base import BaseCommand
from django.conf import settings
from root.constants import Environment

# Import list of all seed scripts
from root.management.commands.seed_scripts import SEED_SCRIPTS


class Command(BaseCommand):
    help = 'Seed database for testing and development.'

    def add_arguments(self, parser):
        parser.add_argument('target', type=str, nargs='?', default=None)

    def print_progress(self, progress, prefix=None, suffix=None):
        bar_len = 20
        # Calculate size of bar and padding
        percent = min(1, max(0, progress / 100.0))
        filled = "█" * math.floor(percent * bar_len)
        padding = " " * math.ceil((1 - percent) * bar_len)
        bar = filled + padding
        # Clear line (special character)
        print("\033[K", end="\r")
        # Print loading bar and prefix/suffix
        desc = f"- {suffix}" if suffix else ""
        print(f"\r{prefix or ''} |{bar}| {100 * percent:.0f}% {desc}", end="\r")

    def run_seed_script(self, target, index, count):
        # Run specific seed script
        prefix = f"{index + 1}/{count} '{target[0]}'\t"
        generator = target[1]()

        # Generator types print their progress throughout
        if isinstance(generator, types.GeneratorType):

            # Run script and print progress
            step: Union[int, Tuple[int, str]] = 0
            for step in generator:
                if type(step) is tuple:
                    progress, suffix = step
                    self.print_progress(progress, prefix=prefix, suffix=suffix)
                elif type(step) in [int, float]:
                    self.print_progress(step, prefix=prefix)
                else:
                    raise Exception(f"Seed script {target[0]} yielded wrong type '{type(step)}', "
                                    "expected number type or tuple of (number, str)")

            # Final output 100%
            if type(step) is tuple:
                if step[0] < 100:
                    self.print_progress(100, prefix=prefix, suffix="OK")
            elif step < 100:
                self.print_progress(100, prefix=prefix, suffix="OK")

            print()
        else:
            self.print_progress(100, prefix=prefix, suffix="OK")

    def handle(self, *args, **options):
        print(f"Running seed script {options['target'] or ''}...\n")

        # Avoid running seed in production
        if settings.ENV == Environment.PROD:
            print("Detected production environment! Cancelled seed script. You're welcome.")
            return

        # No target specified in command, run all seed scripts in order
        if options["target"] is None:
            print(" Did you know that you can seed specific things by passing a name to the seed command?")
            print(" It's quicker if you don't need to seed everything.", end="")
            print(" Try something like 'python3 manage.py seed event'.\n")

            seed_targets = [seed_target for seed_target in SEED_SCRIPTS if seed_target[0] != "example"]
            for i, seed_target in enumerate(seed_targets):
                self.run_seed_script(seed_target, i, len(seed_targets))
        else:
            # Find the specific seed script based on target name
            keys = [seed_target[0] for seed_target in SEED_SCRIPTS]
            if options["target"] in keys:
                # Run the seed script
                target = SEED_SCRIPTS[keys.index(options['target'])]
                self.run_seed_script(target, 0, 1)
            else:
                # Script not found
                print(f"\nUnknown target '{options['target']}'.")
                print(f" - Available seed scripts: {', '.join(keys)}")
                print("\nIf you added a new seed script, remember to register it in /seed_scripts/__init__.py!")
                return

        # Done
        print('\nSeeding complete.')
