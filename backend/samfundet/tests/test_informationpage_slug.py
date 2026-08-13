from __future__ import annotations

import pytest

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.response import Response

from django.urls import reverse
from django.core.exceptions import ValidationError

from root.utils import routes
from root.constants import WebFeatures

from samfundet.models import Gang, User
from samfundet.infopages.models import InformationPage


@pytest.fixture(autouse=True)
def _enable_information_feature(settings) -> None:
    settings.CP_ENABLED = {WebFeatures.INFORMATION}


class TestSlugIsLowercased:
    def test_saving_lowercases_the_slug(self, fixture_gang: Gang):
        page = InformationPage.objects.create(slug_field='MiXeD-CaSe', gang=fixture_gang)

        assert page.slug_field == 'mixed-case'
        assert InformationPage.objects.filter(slug_field='mixed-case').exists()

    def test_lookup_ignores_casing(self, fixture_informationpage: InformationPage):
        slug = fixture_informationpage.slug_field
        assert slug.upper() != slug, 'fixture slug must have letters, or this test proves nothing'

        assert InformationPage.objects.get(slug_field=slug.upper()).slug_field == slug
        assert InformationPage.objects.get(slug_field=slug.swapcase()).slug_field == slug
        assert InformationPage.objects.filter(slug_field__in=[slug.upper()]).count() == 1

    def test_slug_differing_only_by_case_is_rejected_as_duplicate(self, fixture_gang: Gang):
        InformationPage.objects.create(slug_field='taken', gang=fixture_gang)

        with pytest.raises(ValidationError):
            InformationPage.objects.create(slug_field='TAKEN', gang=fixture_gang)


class TestSlugCasingThroughApi:
    def test_created_page_is_stored_and_returned_lowercase(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_gang: Gang,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        response: Response = fixture_rest_client.post(
            path=reverse(routes.samfundet__admin_information_pages_list),
            data={
                'slug_field': 'SHOUTING-SLUG',
                'title_nb': 'Ny',
                'title_en': '',
                'text_nb': '',
                'text_en': '',
                'visible': True,
                'gang_id': fixture_gang.id,
            },
        )

        assert status.is_success(response.status_code), response.json()
        assert response.json()['slug_field'] == 'shouting-slug'
        assert InformationPage.objects.get(slug_field='shouting-slug').slug_field == 'shouting-slug'

    def test_detail_route_accepts_any_casing(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        slug = fixture_informationpage.slug_field
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        url = reverse(routes.samfundet__admin_information_pages_detail, kwargs={'slug_field': slug.upper()})

        response: Response = fixture_rest_client.get(path=url)

        assert status.is_success(response.status_code)
        assert response.json()['slug_field'] == slug

    def test_duplicate_slug_in_other_casing_is_rejected(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        response: Response = fixture_rest_client.post(
            path=reverse(routes.samfundet__admin_information_pages_list),
            data={'slug_field': fixture_informationpage.slug_field.swapcase(), 'title_nb': 'Ny', 'gang_id': fixture_gang.id},
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'slug_field' in response.json()
        assert InformationPage.objects.count() == 1
