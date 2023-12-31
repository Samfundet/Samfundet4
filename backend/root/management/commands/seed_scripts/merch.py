import random
from root.utils.samfundet_random import words

from samfundet.models.general import Merch, MerchVariation, Image

COUNT = 10

IMAGES = Image.objects.all()

specifications: list = ['S', 'M', 'L', 'XL', 'Jumbo size']


def seed():
    Merch.objects.all().delete()
    yield 0, 'Deleted old Merchs'

    for i in range(COUNT):
        # Event name and time
        name_nb, name_en = words(1, include_english=True)
        description_nb, description_en = words(10, include_english=True)
        # Create info page
        merch = Merch.objects.create(
            name_nb=name_nb,
            name_en=name_en,
            description_nb=description_nb,
            description_en=description_en,
            base_price=random.randint(0, 300),
            image=random.choice(IMAGES),
        )

        variation_number = random.choices(specifications, k=random.randint(1, len(specifications)))

        for variation in variation_number:
            MerchVariation.objects.create(specification=variation, merch=merch, stock=random.randint(0, 15))
        yield int(i / COUNT * 100), 'Creating merch'

    # Done!
    yield 100, f'Created {Merch.objects.all().count()} merch'
