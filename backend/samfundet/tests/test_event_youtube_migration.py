from __future__ import annotations

import pytest

from django.db import connection
from django.db.migrations.executor import MigrationExecutor


@pytest.mark.django_db(transaction=True, databases=['default', 'billig'])
@pytest.mark.parametrize('already_boolean', [False, True])
def test_youtube_embed_migration_preserves_links_and_choices(fixture_event, *, already_boolean: bool):
    before = [('samfundet', '0019_remove_closedperiod_description_en_and_more')]
    after = [('samfundet', '0020_event_youtube_embedding')]
    executor = MigrationExecutor(connection)
    executor.migrate(before)
    created_ids = []
    try:
        old_event_model = executor.loader.project_state(before).apps.get_model('samfundet', 'Event')
        video = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        link = 'https://youtu.be/abcdefghijk'
        cases = [
            (None, None, False, None),
            ('', '', False, ''),
            (None, link, False, link),
            (video, None, True, video),
            (video, '', True, video),
            (video, link, True, link),
        ]
        expected = []
        for old_embed, old_link, enabled, expected_link in cases:
            event = old_event_model.objects.get(pk=fixture_event.pk)
            event.pk = None
            event.youtube_embed = old_embed
            event.youtube_link = expected_link if already_boolean else old_link
            event.save()
            created_ids.append(event.pk)
            expected.append((event.pk, enabled, expected_link))

        if already_boolean:
            # Reproduce a database that applied the earlier development migration.
            with connection.cursor() as cursor:
                cursor.execute("ALTER TABLE samfundet_event ALTER COLUMN youtube_embed TYPE boolean USING (youtube_embed IS NOT NULL AND youtube_embed <> '')")

        executor = MigrationExecutor(connection)
        executor.migrate(after)
        new_event_model = executor.loader.project_state(after).apps.get_model('samfundet', 'Event')
        for pk, enabled, expected_link in expected:
            event = new_event_model.objects.get(pk=pk)
            assert event.youtube_embed is enabled
            assert event.youtube_link == expected_link

        executor = MigrationExecutor(connection)
        executor.migrate(before)
        for pk, enabled, expected_link in expected:
            event = old_event_model.objects.get(pk=pk)
            assert event.youtube_embed == (expected_link if enabled else None)
    finally:
        executor = MigrationExecutor(connection)
        executor.migrate(after)
        event_model = executor.loader.project_state(after).apps.get_model('samfundet', 'Event')
        event_model.objects.filter(pk__in=created_ids).delete()
