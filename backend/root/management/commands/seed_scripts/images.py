import os
import random

from django.core.files.images import ImageFile
from django.db.models.deletion import ProtectedError

from root.utils.samfundet_random import words
from samfundet.models import Image, Tag

# Number of images
COUNT = 30


def seed():
    image_folder = os.path.join(os.path.dirname(__file__), 'seed_images')
    seed_images = os.listdir(image_folder)

    try:
        Image.objects.all().delete()
    except ProtectedError:
        print('Warning: failed to delete old images\n')

    Tag.objects.all().delete()
    yield 0, 'Deleted old images and tags'

    for i in range(int(COUNT / 2)):
        Tag.objects.create(name=words(1))

    for i in range(COUNT):
        r_image_name = random.choice(seed_images)
        with open(os.path.join(image_folder, r_image_name), mode='rb') as image_file:
            random_image = ImageFile(image_file, name=r_image_name)
            title = words(random.randint(1, 2))
            image = Image.objects.create(title=title, image=random_image)
            image.tags.set(random.choices(Tag.objects.all().values_list(flat=True, ), k=random.randint(1, 4)))
            yield int(i / COUNT * 100), 'Creating images'

    # Done!
    yield 100, f'Created {Image.objects.all().count()} images'
