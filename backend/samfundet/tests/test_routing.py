from __future__ import annotations

import pytest

from django.test import Client

from root.constants import WebFeatures

from samfundet.models import Gang, Event
from samfundet.infopages.models import InformationPage
from samfundet.infopages.services import create_information_page

# Mirrors the shape of the built index.html closely enough for the metadata injection.
INDEX_HTML = '<!doctype html><html><head><title>Samfundet</title></head><body><div id="root"></div></body></html>'


@pytest.fixture(autouse=True)
def _configure_settings(settings) -> None:
    settings.CP_ENABLED = {WebFeatures.INFORMATION}
    settings.SITE_URL = 'https://samfundet.no'


@pytest.fixture(autouse=True)
def _stub_frontend_html(monkeypatch) -> None:
    """There is no built frontend in the test environment, so serve a fixed index.html."""
    monkeypatch.setattr('samfundet.routing.views.get_frontend_html', lambda: INDEX_HTML)


def create_page(gang: Gang, *, slug: str, title: str | None, text: str | None = None, visible: bool = True) -> InformationPage:
    return create_information_page(
        slug_field=slug,
        gang=gang,
        section=None,
        visible=visible,
        content={'title_nb': title, 'title_en': None, 'text_nb': text, 'text_en': None},
        user=None,
    )


class TestInformationPageMetadata:
    def test_visible_page_injects_title_description_and_canonical(self, fixture_django_client: Client, fixture_gang: Gang) -> None:
        create_page(fixture_gang, slug='om-oss', title='Om oss', text='Velkommen til **Samfundet**.')

        response = fixture_django_client.get('/information/om-oss/')
        body = response.content.decode()

        assert response.status_code == 200
        assert '<title>Om oss - Samfundet</title>' in body
        assert 'name="description"' in body
        assert 'content="Velkommen til Samfundet."' in body
        assert '<link rel="canonical" href="https://samfundet.no/information/om-oss/">' in body

    def test_description_is_omitted_when_the_revision_has_no_text(self, fixture_django_client: Client, fixture_gang: Gang) -> None:
        create_page(fixture_gang, slug='tom', title='Tom')

        response = fixture_django_client.get('/information/tom/')
        body = response.content.decode()

        assert response.status_code == 200
        assert '<title>Tom - Samfundet</title>' in body
        assert 'name="description"' not in body

    def test_title_and_description_are_html_escaped(self, fixture_django_client: Client, fixture_gang: Gang) -> None:
        create_page(fixture_gang, slug='farlig', title='A & B <script>', text='<b>hi</b> & "quotes"')

        response = fixture_django_client.get('/information/farlig/')
        body = response.content.decode()

        assert '<script>' not in body
        assert '&lt;script&gt;' in body
        assert '&amp;' in body

    def test_lookup_is_case_insensitive(self, fixture_django_client: Client, fixture_gang: Gang) -> None:
        create_page(fixture_gang, slug='om-oss', title='Om oss')

        response = fixture_django_client.get('/information/OM-OSS/')

        assert response.status_code == 200

    def test_unknown_slug_returns_404(self, fixture_django_client: Client) -> None:
        response = fixture_django_client.get('/information/does-not-exist/')

        assert response.status_code == 404

    def test_hidden_page_returns_404_without_leaking_content(self, fixture_django_client: Client, fixture_gang: Gang) -> None:
        create_page(fixture_gang, slug='skjult', title='Skjult', text='hemmelig innhold', visible=False)

        response = fixture_django_client.get('/information/skjult/')

        assert response.status_code == 404
        assert 'hemmelig innhold' not in response.content.decode()


class TestInformationPageListMetadata:
    def test_list_page_gets_a_static_title_and_canonical(self, fixture_django_client: Client) -> None:
        response = fixture_django_client.get('/information/')
        body = response.content.decode()

        assert response.status_code == 200
        assert '<title>Informasjon - Samfundet</title>' in body
        assert '<link rel="canonical" href="https://samfundet.no/information/">' in body


class TestStaticServing:
    """Routes without a metadata override, and unknown routes, must be served as the untouched index.html."""

    def test_known_route_is_served_unchanged(self, fixture_django_client: Client) -> None:
        response = fixture_django_client.get('/about/')

        assert response.status_code == 200
        assert response.content.decode() == INDEX_HTML

    def test_unknown_route_is_served_unchanged_with_404(self, fixture_django_client: Client) -> None:
        response = fixture_django_client.get('/this-route-does-not-exist/')

        assert response.status_code == 404
        assert response.content.decode() == INDEX_HTML


class TestEventMetadata:
    def test_event_page_injects_title_and_custom_item(self, fixture_django_client: Client, fixture_event: Event) -> None:
        response = fixture_django_client.get(f'/events/{fixture_event.id}/')
        body = response.content.decode()

        assert response.status_code == 200
        assert '<title>Test Event - Samfundet</title>' in body
        assert 'og:custom' in body

    def test_unknown_event_returns_404_without_metadata(self, fixture_django_client: Client) -> None:
        response = fixture_django_client.get('/events/999999/')

        assert response.status_code == 404
        assert response.content.decode() == INDEX_HTML
