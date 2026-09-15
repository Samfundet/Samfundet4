from __future__ import annotations

from rest_framework import serializers

from root.utils.mixins import CustomBaseSerializer

from samfundet.serializers import BasicUserSerializer
from samfundet.organization.models import Gang, GangType, GangSection
from samfundet.infopages.serializers.fields import info_page_slug_field


class AdminNestedGangTypeSerializer(serializers.ModelSerializer):
    """Trimmed gang type, for inlining in a gang."""

    class Meta:
        model = GangType
        fields = ['id', 'title_nb', 'title_en']


class AdminOrganizedGangSerializer(serializers.ModelSerializer):
    gang_type = AdminNestedGangTypeSerializer(read_only=True)
    info_page = info_page_slug_field()

    class Meta:
        model = Gang
        fields = ['id', 'name_nb', 'name_en', 'abbreviation', 'webpage', 'logo', 'gang_type', 'info_page']


class AdminOrganizedGangsSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='organization.id', read_only=True)
    name = serializers.CharField(source='organization.name', read_only=True)
    gangs = AdminOrganizedGangSerializer(many=True, read_only=True)


class AdminGangTypeSerializer(CustomBaseSerializer):
    class Meta:
        model = GangType
        fields = '__all__'


class AdminGangSectionSerializer(CustomBaseSerializer):
    class Meta:
        model = GangSection
        fields = '__all__'

    def get_created_by(self, obj: GangSection) -> dict | None:
        return BasicUserSerializer(obj.created_by).data if obj.created_by else None

    def get_updated_by(self, obj: GangSection) -> dict | None:
        return BasicUserSerializer(obj.updated_by).data if obj.updated_by else None
