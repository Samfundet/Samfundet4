# Generated by Django 5.0.2 on 2024-09-02 20:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("samfundet", "0006_event_doors_time"),
    ]

    operations = [
        migrations.CreateModel(
            name="RecruitmentGangStat",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "application_count",
                    models.PositiveIntegerField(verbose_name="Count"),
                ),
                ("applicant_count", models.PositiveIntegerField(verbose_name="Count")),
                (
                    "gang",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="date_stats",
                        to="samfundet.gang",
                    ),
                ),
                (
                    "recruitment_stats",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="gang_stats",
                        to="samfundet.recruitmentstatistics",
                    ),
                ),
            ],
        ),
    ]