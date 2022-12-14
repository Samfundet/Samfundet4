# Generated by Django 4.1.3 on 2022-12-05 14:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('samfundet', '0025_saksdokument'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gang',
            name='name',
        ),
        migrations.RemoveField(
            model_name='gangtype',
            name='title',
        ),
        migrations.AddField(
            model_name='gang',
            name='info_page',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='samfundet.informationpage', verbose_name='Infoside'),
        ),
        migrations.AddField(
            model_name='gang',
            name='logo',
            field=models.ImageField(blank=True, null=True, upload_to='ganglogos/', verbose_name='Logo'),
        ),
        migrations.AddField(
            model_name='gang',
            name='name_en',
            field=models.CharField(default='lol', max_length=64, unique=True, verbose_name='Navn Engelsk'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='gang',
            name='name_no',
            field=models.CharField(default='lol', max_length=64, unique=True, verbose_name='Navn Norsk'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='gangtype',
            name='title_en',
            field=models.CharField(default='lol', max_length=64, verbose_name='Gruppetype Engelsk'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='gangtype',
            name='title_no',
            field=models.CharField(default='lol', max_length=64, verbose_name='Gruppetype Norsk'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='gang',
            name='abbreviation',
            field=models.CharField(default='lol', max_length=64, unique=True, verbose_name='Forkortelse'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='gang',
            name='webpage',
            field=models.URLField(blank=True, null=True, verbose_name='Nettside'),
        ),
    ]
