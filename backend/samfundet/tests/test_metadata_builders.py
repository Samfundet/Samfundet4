from __future__ import annotations

import pytest

from samfundet.models import Gang, Event
from samfundet.infopages.models import InformationPage
from samfundet.routing.metadata import Metadata, MetadataItem, build_metadata_html
from samfundet.view.event_views import event_metadata
from samfundet.infopages.metadata import information_page_metadata, information_page_list_metadata
from samfundet.infopages.services import create_information_page


@pytest.fixture(autouse=True)
def _site_url(settings) -> None:
    settings.SITE_URL = 'https://samfundet.no'


def create_page(gang: Gang, *, slug: str, title: str | None, text: str | None = None) -> InformationPage:
    return create_information_page(
        slug_field=slug,
        gang=gang,
        section=None,
        visible=True,
        content={'title_nb': title, 'title_en': None, 'text_nb': text, 'text_en': None},
        user=None,
    )


class TestInformationPageMetadata:
    def test_title_comes_from_the_current_revision(self, fixture_gang: Gang) -> None:
        page = create_page(fixture_gang, slug='om-oss', title='Om oss')

        assert information_page_metadata(page).title == 'Om oss - Samfundet'

    def test_title_falls_back_to_the_slug(self, fixture_gang: Gang) -> None:
        page = create_page(fixture_gang, slug='uten-tittel', title=None)

        assert information_page_metadata(page).title == 'uten-tittel - Samfundet'

    def test_description_is_flattened_markdown(self, fixture_gang: Gang) -> None:
        page = create_page(fixture_gang, slug='om-oss', title='Om oss', text='Velkommen til **Samfundet**.')

        assert information_page_metadata(page).description == 'Velkommen til Samfundet.'

    def test_description_is_none_when_there_is_no_text(self, fixture_gang: Gang) -> None:
        page = create_page(fixture_gang, slug='tom', title='Tom', text=None)

        assert information_page_metadata(page).description is None

    def test_canonical_url_is_absolute(self, fixture_gang: Gang) -> None:
        page = create_page(fixture_gang, slug='om-oss', title='Om oss')

        assert information_page_metadata(page).canonical_url == 'https://samfundet.no/information/om-oss/'

    def test_list_metadata_is_static(self) -> None:
        metadata = information_page_list_metadata()

        assert metadata.title == 'Informasjon - Samfundet'
        assert metadata.canonical_url == 'https://samfundet.no/information/'


class TestEventMetadata:
    def test_maps_title_and_description(self, fixture_event: Event) -> None:
        metadata = event_metadata(fixture_event)

        assert metadata.title == 'Test Event - Samfundet'
        assert metadata.description == 'description'
        assert MetadataItem('name', 'og:custom', 'Lorem ipsum') in metadata.items


class TestBuildMetadataHtml:
    def test_is_free_of_side_effects(self) -> None:
        metadata = Metadata(title='Tittel', description='Beskrivelse', canonical_url='https://samfundet.no/')

        first = build_metadata_html(metadata)
        second = build_metadata_html(metadata)

        assert first == second
        assert metadata.items == []
