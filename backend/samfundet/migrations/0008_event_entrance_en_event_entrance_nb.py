# Generated by Django 5.1.1 on 2024-10-25 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('samfundet', '0007_alter_infobox_color_alter_infobox_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='entrance_en',
            field=models.CharField(blank=True, max_length=140, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='entrance_nb',
            field=models.CharField(blank=True, max_length=140, null=True),
        ),
    ]