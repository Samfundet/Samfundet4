from __future__ import annotations

import os
import random

from django.db import transaction
from django.core.files.images import ImageFile
from django.db.models.deletion import ProtectedError

from root.utils.samfundet_random import words

from samfundet.models.general import Tag, Image

# Number of images
COUNT = 30


def do_seed():
    # Preload images first (faster than doing in seed loop)
    image_folder = os.path.join(os.path.dirname(__file__), 'seed_images')
    seed_images = os.listdir(image_folder)
    image_files = []
    for name in seed_images:
        f = open(os.path.join(image_folder, name), mode='rb')
        image_files.append(f)

    try:
        Image.objects.all().delete()
    except ProtectedError:
        print('Warning: failed to delete old images\n')

    Tag.objects.all().delete()
    yield 0, 'Deleted old images and tags'

    for i in range(int(COUNT / 2)):
        Tag.objects.create(name=words(1))

    for i in range(COUNT):
        image_file = random.choice(image_files)
        random_image = ImageFile(image_file, name=f'img_{i}')
        title = words(random.randint(1, 2))
        image = Image.objects.create(title=title, image=random_image)
        image.tags.set(
            random.choices(
                Tag.objects.all().values_list(
                    flat=True,
                ),
                k=random.randint(1, 4),
            )
        )
        yield int(i / COUNT * 100), 'Creating images'

    # Remember to close files!
    for image_file in image_files:
        image_file.close()

    # Done!
    yield 100, f'Created {Image.objects.all().count()} images'


def seed():
    # Run in transaction for speed
    with transaction.atomic():
        for progress, msg in do_seed():
            yield progress, msg
