from __future__ import annotations

from rest_framework import serializers

from samfundet.infopages.models import InformationPage


def info_page_slug_field() -> serializers.SlugRelatedField:
    """
    `Gang.info_page` references an information page by its numeric id, but that id is an internal
    database detail. Read and write the relation as the page's slug instead.
    """
    return serializers.SlugRelatedField(
        slug_field='slug_field',
        queryset=InformationPage.objects.all(),
        allow_null=True,
        required=False,
    )
