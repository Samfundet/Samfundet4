# Generated by Django 4.1.3 on 2022-11-30 00:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('samfundet', '0021_menuitem_food_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='table',
            name='venue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='samfundet.venue'),
        ),
        migrations.AlterField(
            model_name='table',
            name='name_en',
            field=models.CharField(blank=True, max_length=64, null=True, unique=True, verbose_name='Navn (engelsk)'),
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=64, null=True)),
                ('text', models.TextField(blank=True, null=True)),
                ('when', models.DateTimeField(blank=True, null=True)),
                ('duration', models.CharField(blank=True, choices=[('ONE_HOUR', 'One Hour'), ('TWO_HOURS', 'Two Hours')], default='TWO_HOURS', max_length=64, null=True)),
                ('from_dt', models.DateTimeField(blank=True, null=True)),
                ('to_dt', models.DateTimeField(blank=True, null=True)),
                ('tables', models.ManyToManyField(blank=True, to='samfundet.table')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Booking',
                'verbose_name_plural': 'Bookings',
            },
        ),
    ]
