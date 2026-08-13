from __future__ import annotations

import pytest

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.response import Response

from django.urls import reverse
from django.urls.exceptions import NoReverseMatch

from root.utils import routes
from root.constants import WebFeatures

from samfundet.infopages.models import InformationPage


@pytest.fixture(autouse=True)
def _enable_information_feature(settings) -> None:
    settings.CP_ENABLED = {WebFeatures.INFORMATION}


def detail_url(slug: str) -> str:
    return reverse(routes.samfundet__information_pages_detail, kwargs={'slug_field': slug})


class TestPublicInformationPage:
    """The public endpoint is retrieve-only and anonymous. Listing belongs to the admin viewset."""

    def test_anyone_may_read_a_single_page(self, fixture_rest_client: APIClient, fixture_informationpage: InformationPage):
        response: Response = fixture_rest_client.get(path=detail_url(fixture_informationpage.slug_field))

        assert status.is_success(response.status_code)
        assert response.json()['slug_field'] == fixture_informationpage.slug_field

    def test_detail_accepts_any_casing(self, fixture_rest_client: APIClient, fixture_informationpage: InformationPage):
        slug = fixture_informationpage.slug_field

        response: Response = fixture_rest_client.get(path=detail_url(slug.upper()))

        assert status.is_success(response.status_code)
        assert response.json()['slug_field'] == slug

    def test_exposes_only_whitelisted_fields(self, fixture_rest_client: APIClient, fixture_informationpage: InformationPage):
        """Guards against a new model field silently becoming public."""
        data = fixture_rest_client.get(path=detail_url(fixture_informationpage.slug_field)).json()

        assert set(data) == {'slug_field', 'title_nb', 'title_en', 'text_nb', 'text_en'}

    def test_there_is_no_public_listing_route(self):
        assert reverse('samfundet:information-pages-detail', kwargs={'slug_field': 'x'})

        with pytest.raises(NoReverseMatch):
            reverse('samfundet:information-pages-list')

    def test_the_collection_url_is_not_served(self, fixture_rest_client: APIClient, fixture_informationpage: InformationPage):
        collection_url = detail_url('placeholder').removesuffix('placeholder/')

        response: Response = fixture_rest_client.get(path=collection_url)

        # HTTP 500 if the `reactapp` dir doesn't exist
        assert response.status_code in (status.HTTP_404_NOT_FOUND, status.HTTP_500_INTERNAL_SERVER_ERROR)
