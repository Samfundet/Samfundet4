from __future__ import annotations

from django.core.management.base import BaseCommand

from root import notifications


class Command(BaseCommand):
    help = 'Delete stale notification dedupe/budget state older than the retention window.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--max-age',
            type=int,
            default=None,
            help='Override NOTIFICATION_RETENTION_SECONDS (in seconds).',
        )

    def handle(self, *args, **options):
        removed = notifications.sweep_notification_state(max_age_seconds=options['max_age'])
        self.stdout.write(self.style.SUCCESS(f'Removed {removed} stale notification state rows.'))
