from __future__ import annotations

from django.core.management.base import BaseCommand

from root import notifications


class Command(BaseCommand):
    help = 'Delete expired notification dedupe/budget state.'

    def handle(self, *args, **options):
        removed = notifications.sweep_notification_state()
        self.stdout.write(self.style.SUCCESS(f'Removed {removed} expired notification state rows.'))
