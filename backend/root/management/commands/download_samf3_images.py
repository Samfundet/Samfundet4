from __future__ import annotations

import csv
import os
import urllib
from urllib.request import urlopen

from django.conf import settings
from django.core.management.base import BaseCommand

from root.constants import Environment

BASE_IMAGE_PATH = 'https://www.samfundet.no/upload/images/image_files'


# Samf3 uses /class/partition/id urls for images
# We can convert these in this way: 12345 => /000/012/345
def convert_id_to_samf3_partition(img_id: str) -> str:
    pad_len = 9 - len(img_id)
    padded = '0' * pad_len + img_id
    return f'{padded[0:3]}/{padded[3:6]}/{padded[6:9]}'


def image_samf3_url(row) -> str:
    id_path = convert_id_to_samf3_partition(row['id'])
    safe_name = urllib.parse.quote(row['image_file_file_name'])
    return f'{BASE_IMAGE_PATH}/{id_path}/large/{safe_name}?'


def image_to_fname(image_dict) -> str:
    name = image_dict['image_file_file_name']
    img_id = image_dict['id']
    return f'{img_id}_{name}'


# Parse image
# Paths in samf3 are '/upload/:class/:attachment/:id_partition/:style/:filename'
def download_image(image_dict, save_path) -> bool:
    try:
        img_url = image_samf3_url(image_dict)
        with urlopen(img_url) as uo:
            if not uo.status == 200:
                return False
            with open(save_path, 'wb') as new_img:
                new_img.write(uo.read())
                new_img.flush()
        return True
    except Exception as e:
        print(f"Failed for {image_dict['id']}, error: {e}")
        return False


class Command(BaseCommand):
    help = 'Download samf3 images to seed folder before seeding.'

    def handle(self, *args, **options):
        print('Running samf3 download images script...')

        # Avoid running seed in production.
        if settings.ENV == Environment.PROD:
            print("Detected production environment! Cancelled script. You're welcome.")
            return

        root_path = os.path.join(os.path.dirname(__file__), 'seed_scripts')
        root_path = os.path.join(root_path, 'seed_samf3')
        image_csv_path = os.path.join(root_path, 'samf3_images.csv')
        event_csv_path = os.path.join(root_path, 'samf3_events.csv')
        save_root_path = os.path.join(root_path, 'images')
        os.makedirs(save_root_path, exist_ok=True)

        # Check if file exists
        if not os.path.exists(image_csv_path) or not os.path.exists(image_csv_path):
            print("Samf3 CSVs couldn't be found. Get them and place it in the /seed_samf3/ folder!")
            exit(-1)

        print('Parsing CSV...')
        downloaded = 0
        images_to_download = []
        with open(event_csv_path, 'r') as event_csv:
            with open(image_csv_path, 'r') as image_csv:
                events = list(csv.DictReader(event_csv))
                images = list(csv.DictReader(image_csv))

                for event in events:
                    images_to_download.append(event['image_id'])

                print(f'Now downloading {len(images_to_download)} images.')

                for i, image in enumerate(reversed(images)):
                    if image['id'] in images_to_download:
                        save_path = os.path.join(save_root_path, image_to_fname(image))
                        if os.path.exists(save_path) or download_image(image, save_path):
                            downloaded += 1
                    if i % 10 == 0:
                        print(f' {downloaded}/{len(images_to_download)}')

        # Done
        print('\nDownload complete.')
