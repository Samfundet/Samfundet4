# Generated by Django 5.1.1 on 2024-12-22 01:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("samfundet", "0011_recruitmentposition_file_description_en_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="recruitmentstatistics",
            name="total_rejected",
            field=models.PositiveIntegerField(
                blank=True, null=True, verbose_name="Total rejected applicants"
            ),
        ),
    ]