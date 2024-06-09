from __future__ import annotations

import os

from django.core.files.images import ImageFile

from samfundet.models.general import Organization

ORGANIZATIONS = [ 'Samfundet', 'ISFiT', 'UKA']


def seed():
    yield 0, 'organizations'
    for org in Organization.objects.all():
        org.delete()
    image_folder = os.path.join(os.path.dirname(__file__), 'seed_organization')
    seed_images = os.listdir(image_folder)
    image_files = {}
    for name in seed_images:
        f = open(os.path.join(image_folder, name), mode='rb')  # noqa: SIM115
        for org in ORGANIZATIONS:
            if org.lower() in name:
                image_files[org] = f
                break
    for index, org in enumerate(ORGANIZATIONS):
        logo = ImageFile(image_files[org], name=f'logo_{org}.png')
        Organization.objects.get_or_create(name=org, logo=logo)
        yield index / len(ORGANIZATIONS), 'organizations'
    yield 100, f'Created {len(Organization.objects.all())} organizations'
