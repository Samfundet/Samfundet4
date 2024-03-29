# Generated by Django 5.0.2 on 2024-02-21 20:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("samfundet", "0009_alter_recruitmentadmission_applicant_priority"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserFeedbackModel",
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
                ("text", models.TextField()),
                ("path", models.CharField(blank=True, max_length=255)),
                ("date", models.DateTimeField(auto_now_add=True)),
                ("user_agent", models.TextField(blank=True)),
                ("screen_resolution", models.CharField(blank=True, max_length=13)),
                ("contact_email", models.EmailField(max_length=254, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"verbose_name": "UserFeedback",},
        ),
    ]
