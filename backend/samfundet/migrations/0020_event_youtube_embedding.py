from django.db import migrations, models


def convert_embeds(apps, schema_editor):
    Event = apps.get_model('samfundet', 'Event')
    events = Event.objects.using(schema_editor.connection.alias)
    for event in events.only('pk', 'youtube_embed', 'youtube_link').iterator():
        changes = {'youtube_embed_enabled': bool(event.youtube_embed)}
        if isinstance(event.youtube_embed, str) and event.youtube_embed and not event.youtube_link:
            changes['youtube_link'] = event.youtube_embed
        events.filter(pk=event.pk).update(**changes)


def restore_embed_urls(apps, schema_editor):
    Event = apps.get_model('samfundet', 'Event')
    Event.objects.using(schema_editor.connection.alias).filter(youtube_embed_enabled=True).update(youtube_embed=models.F('youtube_link'))


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ('samfundet', '0019_remove_closedperiod_description_en_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='youtube_embed_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(convert_embeds, restore_embed_urls, atomic=True),
        migrations.RemoveField(model_name='event', name='youtube_embed'),
        migrations.RenameField(model_name='event', old_name='youtube_embed_enabled', new_name='youtube_embed'),
    ]
