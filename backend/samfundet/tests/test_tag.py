from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

from rest_framework import status

from django.urls import reverse
from django.core.exceptions import ValidationError

from root.utils import routes

from samfundet.models.general import Tag, User

if TYPE_CHECKING:
    from rest_framework.test import APIClient


class TestTagUniqueness:
    def test_duplicate_tag_name_is_rejected(self):
        Tag.objects.create(name='Redda')

        with pytest.raises(ValidationError):
            Tag.objects.create(name='redda')

    def test_find_or_create_matches_case_insensitively(self):
        tag = Tag.objects.create(name='Redda')

        assert Tag.find_or_create('REDDA') == tag
        assert Tag.find_or_create(' redda ') == tag
        assert Tag.objects.count() == 1

    def test_tag_api_rejects_duplicate_name_but_allows_own_rename(self, fixture_rest_client: APIClient, fixture_superuser: User):
        fixture_rest_client.force_authenticate(user=fixture_superuser)
        tag = Tag.objects.create(name='Redda')

        response = fixture_rest_client.post(reverse(routes.samfundet__tags_list), {'name': 'REDDA'})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

        # Updating a tag without changing its name must not trip the uniqueness check
        response = fixture_rest_client.put(reverse(routes.samfundet__tags_detail, kwargs={'pk': tag.id}), {'name': 'Redda'})
        assert status.is_success(response.status_code)
