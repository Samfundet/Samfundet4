from __future__ import annotations

from root.utils.mixins import CustomBaseSerializer

from samfundet.organization.models import Gang, GangType, GangSection
from samfundet.infopages.serializers.fields import info_page_slug_field


class PublicGangSerializer(CustomBaseSerializer):
    info_page = info_page_slug_field()

    class Meta:
        model = Gang
        fields = ['id', 'info_page', 'name_nb', 'name_en', 'abbreviation', 'webpage', 'logo', 'organization', 'gang_type']


class PublicGangSectionSerializer(CustomBaseSerializer):
    class Meta:
        model = GangSection
        fields = ['id', 'name_nb', 'name_en', 'logo', 'gang']


class PublicGangTypeSerializer(CustomBaseSerializer):
    gangs = PublicGangSerializer(read_only=True, many=True)

    class Meta:
        model = GangType
        fields = ['id', 'gangs', 'title_nb', 'title_en', 'organization']
