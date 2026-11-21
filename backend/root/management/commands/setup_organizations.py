from __future__ import annotations

from typing import Any

from django.db import transaction
from django.core.management.base import BaseCommand, CommandParser

from samfundet.organization.setup import SetupReport, setup_organizations


class Command(BaseCommand):
    help = (
        'Create or update organizations, gang types, gangs and sections to match '
        'samfundet/organization/structure.py. Safe to run again, and allowed in production. '
        'Never deletes anything.'
    )

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument('--dry-run', action='store_true', help='Print what would change, then roll back everything.')

    def handle(self, *args: Any, **options: Any) -> None:
        dry_run = options['dry_run']
        if dry_run:
            self.stdout.write(self.style.WARNING('Dry run: nothing will be saved.'))

        with transaction.atomic():
            report = setup_organizations()
            transaction.set_rollback(dry_run)

        self._print_report(report)

    def _print_report(self, report: SetupReport) -> None:
        for label in report.created:
            self.stdout.write(f'Created {label}')
        for label in report.updated:
            self.stdout.write(f'Updated {label}')
        for label in report.not_in_list:
            self.stdout.write(self.style.WARNING(f'Not in structure.py, left alone: {label}'))

        counts = f'{len(report.created)} created, {len(report.updated)} updated, {report.unchanged} unchanged'
        self.stdout.write(self.style.SUCCESS(f'{counts}, {len(report.not_in_list)} not in the list.'))
