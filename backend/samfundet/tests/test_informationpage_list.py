from __future__ import annotations

import pytest
from guardian.shortcuts import assign_perm

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.response import Response

from django.urls import reverse

from root.utils import routes
from root.constants import WebFeatures
from root.utils.permissions import SAMFUNDET_VIEW_INFORMATIONPAGE

from samfundet.models import Gang, User, GangSection, Organization
from samfundet.infopages.models import InformationPage
from samfundet.infopages.services import create_information_page, update_information_page


@pytest.fixture(autouse=True)
def _enable_information_feature(settings) -> None:
    settings.CP_ENABLED = {WebFeatures.INFORMATION}


def make_pages(gang: Gang, count: int, section: GangSection | None = None) -> None:
    for i in range(count):
        create_information_page(
            slug_field=f'page-{i}',
            gang=None if section else gang,
            section=section,
            visible=True,
            content={'title_nb': f'Side {i}', 'title_en': None, 'text_nb': None, 'text_en': None},
            user=None,
        )


class TestOrganizationOnInformationPage:
    def test_list_includes_the_organization_of_the_owning_gang(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_organization: Organization,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        response: Response = fixture_rest_client.get(path=reverse(routes.samfundet__admin_information_pages_list))
        data = response.json()

        assert status.is_success(response.status_code)
        assert data[0]['organization']['id'] == fixture_organization.id
        assert data[0]['organization']['name'] == fixture_organization.name

    def test_organization_is_null_when_the_gang_has_none(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        fixture_gang.organization = None
        fixture_gang.save()
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        data = fixture_rest_client.get(path=reverse(routes.samfundet__admin_information_pages_list)).json()

        assert data[0]['organization'] is None

    def test_organization_is_read_only(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_organization2: Organization,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        """The owner is set through the gang, so a client cannot repoint the organization directly."""
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        url = reverse(routes.samfundet__admin_information_pages_detail, kwargs={'slug_field': fixture_informationpage.slug_field})

        response: Response = fixture_rest_client.put(
            path=url,
            data={
                'slug_field': fixture_informationpage.slug_field,
                'title_nb': 'Norsk tittel',
                'title_en': 'Engelsk',
                'text_nb': '',
                'text_en': '',
                'visible': True,
                'gang_id': fixture_gang.id,
                'organization': fixture_organization2.id,
            },
        )

        assert status.is_success(response.status_code), response.json()
        fixture_gang.refresh_from_db()
        assert fixture_gang.organization_id != fixture_organization2.id


class TestAdminPayloadShape:
    """Listings drop the page bodies since they can be large, but the detail route must keep them."""

    BODY_FIELDS = ('text_nb', 'text_en')

    def test_listing_omits_the_bodies(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        data = fixture_rest_client.get(path=reverse(routes.samfundet__admin_information_pages_list)).json()

        assert data, 'need at least one page for this to prove anything'
        for field in self.BODY_FIELDS:
            assert field not in data[0]

    def test_detail_includes_the_bodies(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        """Guards the edit form, which would otherwise load with an empty body and save it back."""
        update_information_page(
            page=fixture_informationpage,
            slug_field=fixture_informationpage.slug_field,
            gang=fixture_informationpage.gang,
            section=None,
            visible=fixture_informationpage.visible,
            content={'title_nb': 'Norsk tittel', 'title_en': 'Engelsk', 'text_nb': 'Norsk brødtekst', 'text_en': 'English body'},
            user=None,
        )
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        url = reverse(routes.samfundet__admin_information_pages_detail, kwargs={'slug_field': fixture_informationpage.slug_field})

        data = fixture_rest_client.get(path=url).json()

        assert data['text_nb'] == 'Norsk brødtekst'
        assert data['text_en'] == 'English body'


class TestListQueryCount:
    def test_listing_does_not_query_per_page(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_gang: Gang,
        django_assert_num_queries,
    ):
        """
        Guards the select_related in AdminInformationPageViewSet.get_queryset.

        The organization is two relations out, so without it every page would cost extra queries.
        Rather than pin an exact number, this asserts the count does not grow with the page count.
        """
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        url = reverse(routes.samfundet__admin_information_pages_list)

        make_pages(fixture_gang, 1)
        with django_assert_num_queries(1):
            assert len(fixture_rest_client.get(path=url).json()) == 1

        InformationPage.objects.all().delete()
        make_pages(fixture_gang, 10)
        with django_assert_num_queries(1):
            assert len(fixture_rest_client.get(path=url).json()) == 10

    def test_listing_section_owned_pages_does_not_query_per_page(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_gang_section: GangSection,
        django_assert_num_queries,
    ):
        """A section-owned page resolves its gang and organization through the section, three relations out."""
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        url = reverse(routes.samfundet__admin_information_pages_list)

        make_pages(fixture_gang_section.gang, 1, section=fixture_gang_section)
        with django_assert_num_queries(1):
            assert len(fixture_rest_client.get(path=url).json()) == 1

        InformationPage.objects.all().delete()
        make_pages(fixture_gang_section.gang, 10, section=fixture_gang_section)
        with django_assert_num_queries(1):
            assert len(fixture_rest_client.get(path=url).json()) == 10


class TestObjectLevelPermissions:
    """A permission granted on a single page has no gang to resolve through, so the listing has to union it in."""

    def test_listing_includes_pages_the_user_has_a_direct_permission_for(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_informationpage: InformationPage,
        fixture_gang2: Gang,
    ):
        create_information_page(
            slug_field='not-mine',
            gang=fixture_gang2,
            section=None,
            visible=True,
            content={'title_nb': 'Ikke min', 'title_en': None, 'text_nb': None, 'text_en': None},
            user=None,
        )
        assign_perm(SAMFUNDET_VIEW_INFORMATIONPAGE, fixture_user, fixture_informationpage)
        fixture_rest_client.force_authenticate(user=fixture_user)

        data = fixture_rest_client.get(path=reverse(routes.samfundet__admin_information_pages_list)).json()

        assert [page['slug_field'] for page in data] == [fixture_informationpage.slug_field]

    def test_a_direct_permission_also_opens_the_detail_and_history_routes(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_informationpage: InformationPage,
    ):
        assign_perm(SAMFUNDET_VIEW_INFORMATIONPAGE, fixture_user, fixture_informationpage)
        fixture_rest_client.force_authenticate(user=fixture_user)

        slug = fixture_informationpage.slug_field
        detail = reverse(routes.samfundet__admin_information_pages_detail, kwargs={'slug_field': slug})
        history = reverse(routes.samfundet__admin_information_pages_history, kwargs={'slug_field': slug})

        assert status.is_success(fixture_rest_client.get(path=detail).status_code)
        assert status.is_success(fixture_rest_client.get(path=history).status_code)

    def test_listing_stays_empty_without_any_permission(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_user)

        assert fixture_rest_client.get(path=reverse(routes.samfundet__admin_information_pages_list)).json() == []
