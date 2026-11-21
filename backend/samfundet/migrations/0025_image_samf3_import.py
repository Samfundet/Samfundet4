from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('samfundet', '0024_closedperiod_samf3_import'),
    ]

    operations = [
        migrations.CreateModel(
            name='Samf3Image',
            fields=[
                ('id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255, null=True)),
                ('image_file_file_name', models.CharField(max_length=255, null=True)),
            ],
            options={
                'db_table': 'images',
                'managed': False,
            },
        ),
        migrations.AddField(
            model_name='image',
            name='imported_at',
            field=models.DateTimeField(blank=True, editable=False, null=True, verbose_name='Importert fra Samf3'),
        ),
        migrations.AddField(
            model_name='image',
            name='samf3_id',
            field=models.PositiveBigIntegerField(blank=True, editable=False, help_text='ID of the Samf3 row this was imported from. Empty for content made in Samf4.', null=True, unique=True, verbose_name='Samf3 ID'),
        ),
    ]
