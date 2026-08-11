import django.db.models.functions.text
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('samfundet', '0012_image_image_large_image_image_medium_and_more'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='tag',
            constraint=models.UniqueConstraint(django.db.models.functions.text.Lower('name'), name='tag_name_case_insensitive_unique'),
        ),
    ]
