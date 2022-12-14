# Generated by Django 4.1.3 on 2022-11-25 20:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('samfundet', '0011_alter_profile_user_alter_userpreference_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gang',
            name='abbreviation',
            field=models.CharField(blank=True, max_length=64, unique=True, verbose_name='Forkortelse'),
        ),
        migrations.AlterField(
            model_name='gang',
            name='group_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='samfundet.gangtype', verbose_name='Gruppetype'),
        ),
        migrations.AlterField(
            model_name='gang',
            name='name',
            field=models.CharField(blank=True, max_length=64, unique=True, verbose_name='Navn'),
        ),
        migrations.AlterField(
            model_name='gangtype',
            name='title',
            field=models.CharField(blank=True, max_length=64, verbose_name='Gruppetype'),
        ),
        migrations.AlterField(
            model_name='informationpage',
            name='name_en',
            field=models.CharField(blank=True, max_length=64, verbose_name='Navn Engelsk'),
        ),
        migrations.AlterField(
            model_name='informationpage',
            name='name_no',
            field=models.CharField(blank=True, max_length=64, unique=True, verbose_name='Navn Norsk'),
        ),
        migrations.AlterField(
            model_name='informationpage',
            name='text_en',
            field=models.TextField(blank=True, verbose_name='Tekst Engelsk'),
        ),
        migrations.AlterField(
            model_name='informationpage',
            name='text_no',
            field=models.TextField(blank=True, verbose_name='Tekst Norsk'),
        ),
        migrations.AlterField(
            model_name='informationpage',
            name='title_en',
            field=models.CharField(blank=True, max_length=64, verbose_name='Tittel Engelsk'),
        ),
        migrations.AlterField(
            model_name='informationpage',
            name='title_no',
            field=models.CharField(blank=True, max_length=64, verbose_name='Tittel Norsk'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='nickname',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='user',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userpreference',
            name='theme',
            field=models.CharField(blank=True, choices=[('theme-light', 'Light'), ('theme-dark', 'Dark')], default='theme-light', max_length=30),
        ),
        migrations.AlterField(
            model_name='userpreference',
            name='user',
            field=models.OneToOneField(blank=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
