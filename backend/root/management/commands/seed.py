from __future__ import annotations

import math
import time
import types

from django.conf import settings
from django.core.management.base import BaseCommand

from root.constants import Environment

# Import list of all seed scripts.
from root.management.commands.seed_scripts import SEED_SCRIPTS, OPTIONAL_SEED_SCRIPTS

BAR = '█'
BAR_LENGTH = 20


def print_progress(
    *,
    progress: int,
    prefix: str = '',
    suffix: str = '',
    start_time: float = None,
):
    # Calculate size of bar and padding.
    percent = min(1, max(0, progress / 100.0))
    filled = BAR * math.floor(percent * BAR_LENGTH)
    padding = ' ' * math.ceil((1 - percent) * BAR_LENGTH)
    bar = filled + padding

    if start_time:
        suffix += f' ({time.time() - start_time:.2f}s)'
    # Clear line (special character).
    print('\033[K', end='\r')
    # Print loading bar and prefix/suffix.
    desc = f'- {suffix}' if suffix else ''
    print(f'\r{prefix} |{bar}| {100 * percent:.0f}% {desc}', end='\r')


def run_seed_script(*, target: tuple, index: int, count: int):
    # Run specific seed script.
    prefix = f'{index + 1}/{count}'
    generator = target[1]()
    start_time = time.time()

    # Generator types print their progress throughout.
    if isinstance(generator, types.GeneratorType):

        # Run script and print progress
        step: int | tuple[int, str] = 0
        for step in generator:
            if isinstance(step, tuple):
                progress, suffix = step
                print_progress(progress=progress, prefix=prefix, suffix=suffix, start_time=start_time)
            elif type(step) in [int, float]:
                print_progress(progress=step, prefix=prefix, start_time=start_time)
            else:
                raise Exception(f"Seed script {target[0]} yielded wrong type '{type(step)}', "
                                'expected number type or tuple of (number, str)')

        # Final output 100%.
        if isinstance(step, tuple):
            if step[0] < 100:
                print_progress(progress=100, prefix=prefix, suffix='OK', start_time=start_time)
        elif step < 100:
            print_progress(progress=100, prefix=prefix, suffix='OK', start_time=start_time)

        print()
    else:
        print_progress(progress=100, prefix=prefix, suffix='OK', start_time=start_time)


class Command(BaseCommand):
    help = 'Seed database for testing and development.'

    def add_arguments(self, parser):
        parser.add_argument('target', type=str, nargs='?', default=None)

    def handle(self, *args, **options):
        print(f"Running seed script {options['target'] or ''}...\n")

        # Avoid running seed in production.
        if settings.ENV == Environment.PROD:
            print("Detected production environment! Cancelled seed script. You're welcome.")
            return

        # No target specified in command, run all seed scripts in order.
        if options['target'] is None:
            print(' Did you know that you can seed specific things by passing a name to the seed command?')
            print(" It's quicker if you don't need to seed everything.", end='')
            print(" Try something like 'python3 manage.py seed event'.\n")

            seed_targets = [seed_target for seed_target in SEED_SCRIPTS if seed_target[0] != 'example']
            for i, seed_target in enumerate(seed_targets):
                run_seed_script(
                    target=seed_target,
                    index=i,
                    count=len(seed_targets),
                )
        else:
            # Find the specific seed script based on target name.
            all_scripts = SEED_SCRIPTS + OPTIONAL_SEED_SCRIPTS
            keys = [seed_target[0] for seed_target in all_scripts]

            # Allow endings with and without 's', e.g. events and event
            target = options['target']
            if target not in keys:
                if target.endswith('s'):
                    target = target[0:-1]
                else:
                    target = target + 's'

            # Check if target matches
            if target in keys:
                # Run the seed script.
                target = all_scripts[keys.index(target)]
                run_seed_script(
                    target=target,
                    index=0,
                    count=1,
                )
            else:
                # Script not found.
                print(f"\nUnknown target '{options['target']}'.")
                script_list = '\n - '.join(keys)
                print(f'Available seed scripts: \n - {script_list}')
                print('\nIf you added a new seed script, remember to register it in /seed_scripts/__init__.py!')
                return

        # Done
        print('\nSeeding complete.')
