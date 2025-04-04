# Generated by Django 5.1.1 on 2025-01-19 20:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("samfundet", "0012_recruitmentstatistics_total_rejected"),
    ]

    operations = [
        migrations.AddField(
            model_name="gangtype",
            name="organization",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="gangtypes",
                to="samfundet.organization",
                verbose_name="Organisasjon",
            ),
        ),
    ]
