
import types
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
        # Calculate size
        p = min(100, max(0, progress))
        bar = "█" * int(p/5) + " " * (20 - int(p/5))
        # Clear line
        print("\033[K", end="\r")
        # Write bar
        desc = f"- {suffix}" if suffix else ""
        print(f"\r{prefix or ''} |{bar}| {p:.0f}% {desc}", end="\r")

    def run_seed_script(self, target, index, count):
        # Run specific seed script
        prefix = f"{index+1}/{count} '{target[0]}'\t"
        generator = target[1]()

        # Generator types print their progress throughout
        if isinstance(generator, types.GeneratorType):
            progress = 0

            # Run script and print progress
            for progress in generator:
                if type(progress) is tuple:
                    self.print_progress(progress[0], prefix=prefix, suffix=progress[1])
                else:
                    self.print_progress(progress, prefix=prefix)

            # Final output 100%
            if type(progress) is tuple:
                if progress[0] < 100:
                    self.print_progress(100, prefix=prefix, suffix="OK")
            elif progress < 100:
                self.print_progress(100, prefix=prefix, suffix="OK")

            print()
        else:
            self.print_progress(100, prefix=prefix, suffix="OK")

    def handle(self, *args, **options):
        print(f"Running seed script {options['target'] or ''}...\n")

        # Avoid running seed in production
        if settings.ENV == Environment.PROD:
            print(f"Detected production environment! Cancelled seed script. You're welcome.")
            return

        # No target specified in command, run all seed scripts in order
        if options["target"] is None:
            print(" Did you know that you can seed specific things by passing a name to the seed command?")
            print(" It's quicker if you don't need to seed everything.", end="")
            print(" Try something like 'python3 manage.py seed event'.\n")

            scripts = [s for s in SEED_SCRIPTS if s[0] != "example"]
            for i, seed_target in enumerate(scripts):
                self.run_seed_script(seed_target, i, len(scripts))
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
