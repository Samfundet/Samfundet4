# Generated by Django 5.1.1 on 2024-09-24 17:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("samfundet", "0003_remove_gang_event_admin_group_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="campus",
            name="total_students",
            field=models.PositiveIntegerField(
                default=1, verbose_name="Total students enrolled"
            ),
        ),
        migrations.AddField(
            model_name="recruitmentcampusstat",
            name="applicant_percentage",
            field=models.PositiveIntegerField(
                blank=True,
                default=0,
                null=True,
                verbose_name="Percentages of enrolled students applied for campus",
            ),
        ),
        migrations.AddField(
            model_name="recruitmentgangstat",
            name="average_priority",
            field=models.FloatField(
                blank=True, null=True, verbose_name="Average priority"
            ),
        ),
        migrations.AddField(
            model_name="recruitmentgangstat",
            name="total_accepted",
            field=models.PositiveIntegerField(
                blank=True, null=True, verbose_name="Total accepted"
            ),
        ),
        migrations.AddField(
            model_name="recruitmentgangstat",
            name="total_rejected",
            field=models.PositiveIntegerField(
                blank=True, null=True, verbose_name="Total called and rejected"
            ),
        ),
        migrations.AddField(
            model_name="recruitmentstatistics",
            name="average_applications_per_applicant",
            field=models.FloatField(
                blank=True, null=True, verbose_name="Gang diversity"
            ),
        ),
        migrations.AddField(
            model_name="recruitmentstatistics",
            name="average_gangs_applied_to_per_applicant",
            field=models.FloatField(
                blank=True, null=True, verbose_name="Gang diversity"
            ),
        ),
        migrations.AddField(
            model_name="recruitmentstatistics",
            name="total_accepted",
            field=models.PositiveIntegerField(
                blank=True, null=True, verbose_name="Total accepted applicants"
            ),
        ),
        migrations.AddField(
            model_name="recruitmentstatistics",
            name="total_withdrawn",
            field=models.PositiveIntegerField(
                blank=True, null=True, verbose_name="Total Withdrawn applications"
            ),
        ),
    ]