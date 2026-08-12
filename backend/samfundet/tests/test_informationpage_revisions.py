from __future__ import annotations

import pytest

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.response import Response

from django.urls import reverse

from root.utils import routes
from root.constants import WebFeatures
from root.utils.permissions import SAMFUNDET_VIEW_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE

from samfundet.models import Gang, User
from samfundet.models.role import Role
from samfundet.infopages.models import InformationPage, InformationPageRevision
from samfundet.infopages.services import update_information_page

from .test_roles import grant


@pytest.fixture(autouse=True)
def _enable_information_feature(settings) -> None:
    settings.CP_ENABLED = {WebFeatures.INFORMATION}


def detail_url(page: InformationPage) -> str:
    return reverse(routes.samfundet__admin_information_pages_detail, kwargs={'slug_field': page.slug_field})


def history_url(page: InformationPage) -> str:
    return reverse(routes.samfundet__admin_information_pages_history, kwargs={'slug_field': page.slug_field})


def history_detail_url(page: InformationPage, version: int) -> str:
    return reverse(routes.samfundet__admin_information_pages_history_detail, kwargs={'slug_field': page.slug_field, 'version': version})


def put_body(page: InformationPage, **overrides: object) -> dict:
    revision = page.current_revision
    return {
        'slug_field': page.slug_field,
        'title_nb': revision.title_nb or '',
        'title_en': revision.title_en or '',
        'text_nb': revision.text_nb or '',
        'text_en': revision.text_en or '',
        'visible': page.visible,
        'gang_id': page.gang_id,
        **overrides,
    }


class TestRevisionsAreWritten:
    def test_creating_a_page_mints_the_first_revision(self, fixture_informationpage: InformationPage):
        assert fixture_informationpage.revisions.count() == 1
        assert fixture_informationpage.current_revision.version == 1
        assert fixture_informationpage.current_revision.title_nb == 'Norsk tittel'

    def test_a_content_edit_mints_a_new_revision(self, fixture_informationpage: InformationPage, fixture_gang: Gang):
        update_information_page(
            page=fixture_informationpage,
            slug_field=fixture_informationpage.slug_field,
            gang=fixture_gang,
            section=None,
            visible=True,
            content={'title_nb': 'Endret', 'title_en': 'Engelsk', 'text_nb': None, 'text_en': None},
            user=None,
        )

        fixture_informationpage.refresh_from_db()
        assert fixture_informationpage.revisions.count() == 2
        assert fixture_informationpage.current_revision.version == 2
        assert fixture_informationpage.current_revision.title_nb == 'Endret'

    def test_unchanged_content_mints_no_revision_but_still_touches_the_page(
        self,
        fixture_informationpage: InformationPage,
        fixture_gang: Gang,
    ):
        before = fixture_informationpage.updated_at

        update_information_page(
            page=fixture_informationpage,
            slug_field=fixture_informationpage.slug_field,
            gang=fixture_gang,
            section=None,
            visible=False,
            content={'title_nb': 'Norsk tittel', 'title_en': 'Engelsk', 'text_nb': None, 'text_en': None},
            user=None,
        )

        fixture_informationpage.refresh_from_db()
        assert fixture_informationpage.revisions.count() == 1
        assert fixture_informationpage.visible is False
        assert fixture_informationpage.updated_at > before

    def test_revisions_are_append_only(self, fixture_informationpage: InformationPage):
        revision = fixture_informationpage.current_revision
        revision.title_nb = 'Snik'

        with pytest.raises(ValueError):
            revision.save()

    def test_deleting_a_page_deletes_its_revisions(self, fixture_informationpage: InformationPage):
        page_id = fixture_informationpage.id
        InformationPage.objects.filter(pk=page_id).delete()

        assert not InformationPageRevision.objects.filter(page_id=page_id).exists()


class TestInternalFieldsAreNotExposed:
    """The admin API sends the page id, since object level permissions key on it. Nothing else internal leaks."""

    def test_public_detail_exposes_only_content(self, fixture_rest_client: APIClient, fixture_informationpage: InformationPage):
        url = reverse(routes.samfundet__information_pages_detail, kwargs={'slug_field': fixture_informationpage.slug_field})

        data = fixture_rest_client.get(path=url).json()

        assert set(data) == {'slug_field', 'title_nb', 'title_en', 'text_nb', 'text_en'}

    def test_admin_detail_sends_the_id_and_not_the_revision_pointer(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        data = fixture_rest_client.get(path=detail_url(fixture_informationpage)).json()

        assert data['id'] == fixture_informationpage.id
        assert data['slug_field'] == fixture_informationpage.slug_field
        assert 'current_revision' not in data

    def test_gang_payload_references_the_page_by_slug(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        fixture_gang.info_page = fixture_informationpage
        fixture_gang.save()
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        data = fixture_rest_client.get(path=detail_url(fixture_informationpage)).json()

        assert data['gang']['info_page'] == fixture_informationpage.slug_field


class TestPayloadShapeIsUnchanged:
    def test_editing_through_the_api_returns_the_merged_page(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        response: Response = fixture_rest_client.put(
            path=detail_url(fixture_informationpage),
            data=put_body(fixture_informationpage, title_nb='Endret', text_nb='Brødtekst'),
        )

        assert status.is_success(response.status_code), response.json()
        assert response.json()['title_nb'] == 'Endret'
        assert response.json()['text_nb'] == 'Brødtekst'

    def test_a_write_missing_a_content_field_is_rejected(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        body = put_body(fixture_informationpage)
        del body['text_en']

        response: Response = fixture_rest_client.put(path=detail_url(fixture_informationpage), data=body)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'text_en' in response.json()


class TestHistoryEndpoints:
    def _edit(self, client: APIClient, page: InformationPage, **overrides: object) -> None:
        response = client.put(path=detail_url(page), data=put_body(page, **overrides))
        assert status.is_success(response.status_code), response.json()
        page.refresh_from_db()

    def test_history_lists_every_revision_newest_first(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        self._edit(fixture_rest_client, fixture_informationpage, title_nb='Andre')
        self._edit(fixture_rest_client, fixture_informationpage, title_nb='Tredje')

        data = fixture_rest_client.get(path=history_url(fixture_informationpage)).json()

        assert [entry['version'] for entry in data] == [3, 2, 1]
        assert data[0]['title_nb'] == 'Tredje'

    def test_history_omits_the_bodies(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        data = fixture_rest_client.get(path=history_url(fixture_informationpage)).json()

        assert set(data[0]) == {'version', 'title_nb', 'title_en', 'created_at', 'created_by'}

    def test_history_detail_includes_the_bodies(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        self._edit(fixture_rest_client, fixture_informationpage, text_nb='Første brødtekst')
        self._edit(fixture_rest_client, fixture_informationpage, text_nb='Andre brødtekst')

        data = fixture_rest_client.get(path=history_detail_url(fixture_informationpage, 2)).json()

        assert data['version'] == 2
        assert data['text_nb'] == 'Første brødtekst'

    def test_history_records_who_wrote_the_revision(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        self._edit(fixture_rest_client, fixture_informationpage, title_nb='Endret')

        data = fixture_rest_client.get(path=history_url(fixture_informationpage)).json()

        assert data[0]['created_by'] == fixture_superuser.username

    def test_unknown_version_is_a_404(
        self,
        fixture_rest_client: APIClient,
        fixture_superuser: User,
        fixture_informationpage: InformationPage,
    ):
        fixture_rest_client.force_authenticate(user=fixture_superuser)

        response: Response = fixture_rest_client.get(path=history_detail_url(fixture_informationpage, 99))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_view_permission_is_enough_to_read_history(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_VIEW_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        assert status.is_success(fixture_rest_client.get(path=history_url(fixture_informationpage)).status_code)
        assert status.is_success(fixture_rest_client.get(path=history_detail_url(fixture_informationpage, 1)).status_code)

    def test_history_is_hidden_without_view_permission(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_CHANGE_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        assert fixture_rest_client.get(path=history_url(fixture_informationpage)).status_code == status.HTTP_404_NOT_FOUND
        assert fixture_rest_client.get(path=history_detail_url(fixture_informationpage, 1)).status_code == status.HTTP_404_NOT_FOUND

    def test_browsable_api_can_render_history(
        self,
        fixture_rest_client: APIClient,
        fixture_user: User,
        fixture_role: Role,
        fixture_gang: Gang,
        fixture_informationpage: InformationPage,
    ):
        """
        The browsable renderer runs the response serializer's instance back through the object
        permissions, which hands a revision to a permission class that expects a page.
        """
        grant(fixture_user, fixture_role, fixture_gang, SAMFUNDET_VIEW_INFORMATIONPAGE)
        fixture_rest_client.force_authenticate(user=fixture_user)

        assert fixture_rest_client.get(path=history_url(fixture_informationpage), headers={'accept': 'text/html'}).status_code == status.HTTP_200_OK
        assert fixture_rest_client.get(path=history_detail_url(fixture_informationpage, 1), headers={'accept': 'text/html'}).status_code == status.HTTP_200_OK

    def test_anonymous_users_get_nothing(self, fixture_rest_client: APIClient, fixture_informationpage: InformationPage):
        response: Response = fixture_rest_client.get(path=history_url(fixture_informationpage))

        assert response.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)
