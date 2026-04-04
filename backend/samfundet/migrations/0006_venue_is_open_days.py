# Generated manually for is_open_* fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('samfundet', '0005_medlemsinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='venue',
            name='is_open_monday',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='venue',
            name='is_open_tuesday',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='venue',
            name='is_open_wednesday',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='venue',
            name='is_open_thursday',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='venue',
            name='is_open_friday',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='venue',
            name='is_open_saturday',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='venue',
            name='is_open_sunday',
            field=models.BooleanField(default=True),
        ),
    ]
