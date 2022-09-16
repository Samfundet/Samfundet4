from __future__ import annotations

import json
from dataclasses import dataclass

from dataclasses_json import dataclass_json

from django.core import management
from django.core.management.base import BaseCommand

# pylint: disable=positional-arguments


def to_camel_case(snake_str: str):
    components = snake_str.split('_')
    # We capitalize the first letter of each component except the first one
    # with the 'title' method and join them together.
    return components[0] + ''.join(x.title() for x in components[1:])


class Colorize:
    # pylint: disable=all
    GREEN = '\033[92m'
    RED = '\033[91m'
    _ENDC = '\033[0m'

    @staticmethod
    def __call__(string, *modifiers) -> str:
        return ''.join(modifiers) + string + colorize._ENDC


colorize = Colorize()


@dataclass_json
@dataclass
class Url:
    url: str
    module: str
    name: str
    decorators: str


def parse_name(name: str) -> str:
    """
    Parse django url name to frontend route format.
    'scope:some-name' -> 'scope__some_name'
    """
    scoped_snake_name = name.replace(':', '__').replace('-', '_')
    return scoped_snake_name


def parse_url(url: str) -> str:
    """Parse django url to frontend route format."""

    # from: '/some/path/<int:org_id>/'
    sub_paths = url.split('/')
    # to: ['', 'some', 'path', '<int:org_id>', '']

    for i, sub_path in enumerate(sub_paths, 0):
        # Keep new equal to old if no parsing is needed.
        new_sub_path = sub_path

        try:
            colon_index = sub_path.index(':')
            # Assuming sub_path param has no prefix of form 'something<int:org_id>'.
            # crocl_index = sub_path.index('<')
            new_sub_path = to_camel_case(sub_path[colon_index:-1])  # ':orgId'

        except ValueError:
            # ':' was not found.
            # sub_path = '<org_id>' or 'path'
            if sub_path.startswith('<'):
                # Found param, sub_path = '<org_id>'
                new_sub_path = ':' + to_camel_case(sub_path[1:-1])  # ':orgId'

        # Replace old sub_path with new_sub_path.
        sub_paths[i] = new_sub_path

    # from: ['', 'some', 'path', ':orgId', '']
    new_url = '/'.join(sub_paths)
    # to: '/some/path/:orgId/'

    return new_url


class Command(BaseCommand):
    """Generate frontend routes"""

    def handle(self, *args, **options):
        # Get all urls as json.
        urls_json: str = management.call_command('show_urls', format_style='json')

        # Load urls to dict.
        urls_dict: dict = json.loads(urls_json)

        # Parse urls into objects.
        urls: list[Url] = [Url.from_dict(url) for url in urls_dict]

        # Create space from output after call_command('show_urls').
        print('\n' * 40)

        # Parse all urls to frontend routes.
        for url in urls:

            # Parse url to frontend route.
            url.name = parse_name(url.name)  # 'feide:new_tjeneste' -> 'feide__new_tjeneste'
            url.url = parse_url(url.url)

            # Print in javascript mode for easy copy.
            red_name = colorize(url.name or 'unknown', Colorize.RED)
            green_url = colorize(f"'{url.url}'", Colorize.GREEN)
            print(f"{red_name}: {green_url},")
