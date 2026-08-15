from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('samfundet', '0010_user_date_of_birth'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
