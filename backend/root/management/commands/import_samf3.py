from __future__ import annotations

from typing import Any

from django.db import connections, transaction
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError, CommandParser

from root.constants import Environment

from samfundet.samf3_import.dev import create_schema
from samfundet.samf3_import.base import ImportReport, Samf3Importer
from samfundet.samf3_import.importers import IMPORTERS


class Command(BaseCommand):
    help = (
        'Import Samf3 data into Samf4. Safe to run again: it updates rows it imported '
        'before, and skips rows edited in Samf4 since the last import. Allowed in production, '
        'except for the development flags.'
    )

    def add_arguments(self, parser: CommandParser) -> None:
        names = ', '.join(importer.name for importer in IMPORTERS)
        parser.add_argument(
            '--only',
            type=lambda value: [name.strip() for name in value.split(',') if name.strip()],
            default=None,
            help=f'Comma separated importers to use. Default: all. Available: {names}',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Run the import and print the report, then roll back everything.',
        )

        dev = parser.add_argument_group('development only, refused in production')
        dev_actions = dev.add_mutually_exclusive_group()
        dev_actions.add_argument(
            '--delete-imported',
            action='store_true',
            help='Delete the Samf4 rows imported from Samf3, then stop. Rows made in Samf4 are kept.',
        )
        dev_actions.add_argument(
            '--fresh',
            action='store_true',
            help='Like --delete-imported, then import again.',
        )
        dev_actions.add_argument(
            '--create-dev-schema',
            action='store_true',
            help='Create the Samf3 tables in the local samf3 database, then stop.',
        )

    def handle(self, *args: Any, **options: Any) -> None:  # noqa: C901
        if 'samf3' not in connections.databases:
            raise CommandError("No 'samf3' database is configured. Set the SAMF3_DB_* environment variables.")

        is_dev_action = options['delete_imported'] or options['fresh'] or options['create_dev_schema']
        if is_dev_action and settings.ENV == Environment.PROD:
            raise CommandError('--delete-imported, --fresh and --create-dev-schema are refused in production.')

        if options['create_dev_schema']:
            create_schema()
            self.stdout.write(self.style.SUCCESS('Created the Samf3 tables in the samf3 database.'))
            return

        dry_run = options['dry_run']
        if dry_run:
            self.stdout.write(self.style.WARNING('Dry run: nothing will be saved.'))

        # One transaction for the whole run, so a crash halfway leaves Samf4 as it was.
        with transaction.atomic():
            reports = self._run(
                importers=self._select_importers(options['only']),
                delete_first=options['delete_imported'] or options['fresh'],
                do_import=not options['delete_imported'],
            )
            if dry_run:
                transaction.set_rollback(True)

        if reports:
            self.stdout.write('')
            for report in reports:
                self.stdout.write(report.summary())
        self.stdout.write(self.style.SUCCESS('Dry run done, rolled back.' if dry_run else 'Done.'))

    def _run(self, *, importers: list[type[Samf3Importer]], delete_first: bool, do_import: bool) -> list[ImportReport]:
        if delete_first:
            self._delete_imported(importers)
        if not do_import:
            return []
        reports = []
        for importer in importers:
            self.stdout.write(f'Importing {importer.name}...')
            report = importer().run()
            reports.append(report)
            self._print_report(report)
        return reports

    def _select_importers(self, only: list[str] | None) -> list[type[Samf3Importer]]:
        if only is None:
            return IMPORTERS
        known = {importer.name for importer in IMPORTERS}
        unknown = set(only) - known
        if unknown:
            raise CommandError(f'Unknown importers: {", ".join(sorted(unknown))}. Available: {", ".join(sorted(known))}')
        # Keep the order from IMPORTERS, so dependencies still run first.
        return [importer for importer in IMPORTERS if importer.name in only]

    def _delete_imported(self, importers: list[type[Samf3Importer]]) -> None:
        # Reverse order, so rows are deleted before the rows they depend on.
        for importer in reversed(importers):
            deleted = importer().delete_imported()
            self.stdout.write(f'Deleted {deleted} imported rows for {importer.name}')

    def _print_report(self, report: ImportReport) -> None:
        self.stdout.write(f'  {report.summary()}')
        for skipped in report.skipped:
            self.stdout.write(self.style.WARNING(f'  skipped samf3_id={skipped.samf3_id}: {skipped.reason}'))
