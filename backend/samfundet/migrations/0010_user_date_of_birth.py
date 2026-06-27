from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('samfundet', '0009_remove_userpreference_mirror_dimension'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True, verbose_name='date of birth'),
        ),
    ]
