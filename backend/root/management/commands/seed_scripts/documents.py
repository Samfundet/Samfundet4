import os
import random

from django.core.files import File
from django.db import transaction
from django.utils import timezone

from root.utils.samfundet_random import words
from samfundet.models.general import Saksdokument

COUNT = 100
DAY_RANGE = 365 * 5
CREATE_OFFSET = 30


def seed():

    cats = [
        Saksdokument.SaksdokumentCategory.FS_REFERAT,
        Saksdokument.SaksdokumentCategory.STYRET,
        Saksdokument.SaksdokumentCategory.RADET,
        Saksdokument.SaksdokumentCategory.ARSBERETNINGER,
    ]

    # Load file just once (much faster)
    data_path = os.path.join(os.path.dirname(__file__), 'seed_data')
    with open(os.path.join(data_path, 'seed.pdf'), mode='rb') as dummy_pdf:
        dummy_file = File(dummy_pdf, name='seed.pdf')

        # Delete old data
        Saksdokument.objects.all().delete()

        # Faster in one transaction
        with transaction.atomic():

            # Create documents
            for i in range(COUNT):
                name_no, name_en = words(2, include_english=True)
                pub_date = timezone.now() + timezone.timedelta(
                    days=random.randint(-DAY_RANGE, DAY_RANGE),
                    hours=random.randint(-12, 12),
                    minutes=random.randint(-30, 30),
                )
                create_date = pub_date - timezone.timedelta(
                    days=random.randint(-CREATE_OFFSET, 0),
                    hours=random.randint(-12, 12),
                    minutes=random.randint(-30, 30),
                )

                update_delta = timezone.timedelta(
                    days=random.randint(0, CREATE_OFFSET - 1),
                    hours=random.randint(-12, 12),
                    minutes=random.randint(-30, 30),
                )

                Saksdokument.objects.create(
                    title_nb=name_no,
                    title_en=name_en,
                    publication_date=pub_date,
                    created_at=create_date,
                    updated_at=(create_date - update_delta) if random.randint(0, 2) == 0 else None,
                    category=random.choice(cats),
                    file=dummy_file
                )
                yield int(i / COUNT * 100), 'Creating documents'

    yield 100, f'Created {COUNT} documents.'
