from __future__ import annotations

from typing import Any
from concurrent.futures import ThreadPoolExecutor, as_completed

from django.core.management.base import BaseCommand

from samfundet.models.general import Image


class Command(BaseCommand):
    help = 'Generate size variants for images missing them. Useful after changing Image.VARIANTS.'

    def add_arguments(self, parser: Any) -> None:
        parser.add_argument('--force', action='store_true', help='Regenerate variants even if they already exist.')
        parser.add_argument('--workers', type=int, default=1, help='Number of images to process in parallel (default 1).')

    def handle(self, *args: Any, **options: Any) -> None:
        candidates = [image for image in Image.objects.all() if options['force'] or self._needs_variants(image)]
        total = len(candidates)
        processed = 0
        failed = 0
        with ThreadPoolExecutor(max_workers=options['workers']) as executor:
            futures = {executor.submit(self._regenerate, image): image for image in candidates}
            for future in as_completed(futures):
                try:
                    future.result()
                    processed += 1
                except (OSError, ValueError) as error:
                    failed += 1
                    image = futures[future]
                    self.stderr.write(f'Failed to process image {image.pk} ({image.image.name}): {error}')
                if (processed + failed) % 50 == 0:
                    # print progress every 50 images
                    self.stdout.write(f'{processed + failed}/{total}...')
        self.stdout.write(self.style.SUCCESS(f'Processed {processed} of {total} candidate images ({failed} failed).'))

    @staticmethod
    def _needs_variants(image: Image) -> bool:
        # Small originals are correct without variants
        if image.image.size <= Image.VARIANT_SIZE_THRESHOLD:
            return False
        return not all(getattr(image, f'image_{name}') for name in Image.VARIANTS)

    def _regenerate(self, image: Image) -> None:
        storage = Image._meta.get_field('image').storage
        for name in Image.VARIANTS:
            variant_file = getattr(image, f'image_{name}')
            if variant_file:
                storage.delete(variant_file.name)
        image.generate_variants()
        image.save()
