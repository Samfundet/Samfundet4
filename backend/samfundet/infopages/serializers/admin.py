from __future__ import annotations

from typing import Any

from rest_framework import serializers

from root.utils.permissions import SAMFUNDET_ADD_INFORMATIONPAGE, SAMFUNDET_CHANGE_INFORMATIONPAGE, SAMFUNDET_DELETE_INFORMATIONPAGE

from samfundet.roles import OwnerPermissionMap, get_owner_permission_map
from samfundet.serializers import BasicUserSerializer, OrganizationSerializer
from samfundet.models.general import User
from samfundet.infopages.models import NO_OWNER_ERROR, ONLY_ONE_OWNER_ERROR, InformationPage, InformationPageRevision
from samfundet.infopages.services import create_information_page, update_information_page
from samfundet.organization.models import Gang, GangSection
from samfundet.infopages.permissions import INFORMATION_PAGE_OWNER_PERMISSIONS
from samfundet.organization.serializers.public import PublicGangSerializer, PublicGangSectionSerializer

# An information page owner. Exactly one of the two is set.
Owner = tuple[Gang | None, GangSection | None]


def _owner_field(owner: Owner) -> str:
    """Which request field an error about this owner belongs on."""
    return 'section_id' if owner[1] else 'gang_id'


def _capabilities_for(owner: Owner, capabilities: OwnerPermissionMap) -> set[str]:
    gang, section = owner
    if section:
        return capabilities.for_section(section.id)
    return capabilities.for_gang(gang.id) if gang else set()


def _same_owner(a: Owner, b: Owner) -> bool:
    return [obj.id if obj else None for obj in a] == [obj.id if obj else None for obj in b]


def _exactly_one_owner(attrs: dict) -> Owner:
    """Validation to reject a write containing both gang and section, or none of them."""
    gang: Gang | None = attrs.get('gang')
    section: GangSection | None = attrs.get('section')

    if gang and section:
        raise serializers.ValidationError({'gang_id': ONLY_ONE_OWNER_ERROR, 'section_id': ONLY_ONE_OWNER_ERROR})
    if not (gang or section):
        raise serializers.ValidationError({'gang_id': NO_OWNER_ERROR, 'section_id': NO_OWNER_ERROR})

    return gang, section


class OwnerOptionSerializer(serializers.Serializer):
    gang = PublicGangSerializer(read_only=True)
    section = PublicGangSectionSerializer(read_only=True, allow_null=True)
    organization = OrganizationSerializer(source='gang.organization', read_only=True, allow_null=True)
    can_create = serializers.BooleanField(read_only=True)
    can_change = serializers.BooleanField(read_only=True)
    can_delete = serializers.BooleanField(read_only=True)


class AdminInformationPageWriteSerializer(serializers.ModelSerializer):
    gang_id = serializers.PrimaryKeyRelatedField(queryset=Gang.objects.all(), source='gang', write_only=True, required=False, allow_null=True)
    section_id = serializers.PrimaryKeyRelatedField(queryset=GangSection.objects.all(), source='section', write_only=True, required=False, allow_null=True)

    # Declared here since these live in the revision model, not the info page itself.
    # All content fields are required, since a partial update would be ambiguous since we create
    # whole new revisions each update.
    title_nb = serializers.CharField(max_length=64, required=True, allow_blank=True, allow_null=True)
    text_nb = serializers.CharField(required=True, allow_blank=True, allow_null=True)
    title_en = serializers.CharField(max_length=64, required=True, allow_blank=True, allow_null=True)
    text_en = serializers.CharField(required=True, allow_blank=True, allow_null=True)

    class Meta:
        model = InformationPage
        fields = [
            'slug_field',
            'title_nb',
            'text_nb',
            'title_en',
            'text_en',
            'gang_id',
            'section_id',
            'visible',
        ]
        extra_kwargs = {
            'slug_field': {'required': True, 'allow_blank': False},
            'visible': {'required': True},
        }

    def validate(self, attrs: dict) -> dict:
        gang, section = self._validate_owner(attrs)
        attrs['gang'] = gang
        attrs['section'] = section
        return attrs

    def create(self, validated_data: dict) -> InformationPage:
        return create_information_page(
            slug_field=validated_data['slug_field'],
            gang=validated_data['gang'],
            section=validated_data['section'],
            visible=validated_data['visible'],
            content=self._content(validated_data),
            user=self._user(),
        )

    def update(self, instance: InformationPage, validated_data: dict) -> InformationPage:
        return update_information_page(
            page=instance,
            slug_field=validated_data['slug_field'],
            gang=validated_data['gang'],
            section=validated_data['section'],
            visible=validated_data['visible'],
            content=self._content(validated_data),
            user=self._user(),
        )

    def _user(self) -> User | None:
        user = getattr(self.context.get('request'), 'user', None)
        return user if isinstance(user, User) else None

    @staticmethod
    def _content(validated_data: dict) -> dict[str, Any]:
        return {field: validated_data.get(field) for field in InformationPageRevision.CONTENT_FIELDS}

    def _validate_owner(self, attrs: dict) -> Owner:
        """Ensures exactly one owner is set, and that the user has access to it."""
        user = getattr(self.context.get('request'), 'user', None)
        capabilities = get_owner_permission_map(user=user, permissions=INFORMATION_PAGE_OWNER_PERMISSIONS)

        target = _exactly_one_owner(attrs)

        if self.instance is None:
            if SAMFUNDET_ADD_INFORMATIONPAGE not in _capabilities_for(target, capabilities):
                raise serializers.ValidationError({_owner_field(target): 'You do not have permission to create information pages for this gang/section'})
            return target

        source: Owner = (self.instance.gang, self.instance.section)
        if _same_owner(source, target):
            return source

        return self._authorize_owner_change(source=source, target=target, capabilities=capabilities)

    @staticmethod
    def _authorize_owner_change(*, source: Owner, target: Owner, capabilities: OwnerPermissionMap) -> Owner:
        """Changing an infopage's owner requires add permission for the target, and change+delete perms for the source."""
        field = _owner_field(target)

        if SAMFUNDET_ADD_INFORMATIONPAGE not in _capabilities_for(target, capabilities):
            raise serializers.ValidationError({field: 'You do not have permission to change owner of this information page to the selected gang/section'})

        required_source_perms = {SAMFUNDET_CHANGE_INFORMATIONPAGE, SAMFUNDET_DELETE_INFORMATIONPAGE}
        if not required_source_perms.issubset(_capabilities_for(source, capabilities)):
            raise serializers.ValidationError({field: 'You do not have permission to change owner of this information page.'})

        return target


class AdminInformationPageListSerializer(serializers.ModelSerializer):
    """
    Body fields are excluded, since they can be quite large and drastically increase payload size,
    and they aren't needed for normal listings.
    """

    gang = serializers.SerializerMethodField(read_only=True)
    organization = serializers.SerializerMethodField(read_only=True)
    section = PublicGangSectionSerializer(read_only=True, allow_null=True)

    title_nb = serializers.CharField(source='current_revision.title_nb', read_only=True, allow_null=True)
    title_en = serializers.CharField(source='current_revision.title_en', read_only=True, allow_null=True)

    def get_gang(self, page: InformationPage) -> dict | None:
        gang = page.owner_gang()
        return PublicGangSerializer(gang).data if gang else None

    def get_organization(self, page: InformationPage) -> dict | None:
        gang = page.owner_gang()
        return OrganizationSerializer(gang.organization).data if gang and gang.organization else None

    class Meta:
        model = InformationPage
        fields = [
            'id',
            'slug_field',
            'title_nb',
            'title_en',
            'visible',
            'gang',
            'section',
            'organization',
            'version',
            'created_at',
            'created_by',
            'updated_at',
            'updated_by',
        ]


class AdminInformationPageReadSerializer(AdminInformationPageListSerializer):
    text_nb = serializers.CharField(source='current_revision.text_nb', read_only=True, allow_null=True)
    text_en = serializers.CharField(source='current_revision.text_en', read_only=True, allow_null=True)
    created_by = BasicUserSerializer()
    updated_by = BasicUserSerializer()

    class Meta(AdminInformationPageListSerializer.Meta):
        fields = [*AdminInformationPageListSerializer.Meta.fields, 'text_nb', 'text_en', 'created_by', 'updated_by']


class InformationPageRevisionListSerializer(serializers.ModelSerializer):
    # Username
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = InformationPageRevision
        fields = ['version', 'title_nb', 'title_en', 'created_at', 'created_by']


class InformationPageRevisionSerializer(InformationPageRevisionListSerializer):
    class Meta(InformationPageRevisionListSerializer.Meta):
        fields = [*InformationPageRevisionListSerializer.Meta.fields, 'text_nb', 'text_en']
