
from root.management.commands.seed_scripts import SEED_SCRIPTS
from django.core.management.base import BaseCommand
from django.conf import settings
from root.constants import Environment


class Command(BaseCommand):
    help = 'Seed database for testing and development.'

    def add_arguments(self, parser):
        parser.add_argument('target', type=str, nargs='?', default=None)

    def handle(self, *args, **options):
        print(f"Running seed script for target '{options['target']}'...")

        # Production dodge
        if settings.ENV == Environment.PROD:
            print(f"Detected production environment! Cancelled seed script. You're welcome.")
            return

        # No target, run all seed scripts in order
        if options["target"] is None:
            for seed_target in SEED_SCRIPTS:
                print(f"- Seeding '{seed_target[0]}'")
                seed_target[1]()
        else:
            # Find seed script target
            keys = [seed_target[0] for seed_target in SEED_SCRIPTS]
            if options["target"] not in keys:
                print(f"Unknown seed target '{options['target']}'.")
                print(f" - Available seed scripts: {', '.join(keys)}")
            else:
                # Run specific seed script
                print(f"- Seeding '{options['target']}'")
                index = keys.index(options["target"])
                SEED_SCRIPTS[index][1]()

        print('Done.')
