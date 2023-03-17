from typing import List

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Group, Permission
from guardian.models import GroupObjectPermission, UserObjectPermission
from rest_framework import serializers

from .models import (
    Tag,
    Menu,
    Gang,
    Event,
    Table,
    Venue,
    Image,
    Booking,
    Profile,
    MenuItem,
    GangType,
    EventGroup,
    FoodCategory,
    Saksdokument,
    ClosedPeriod,
    FoodPreference,
    UserPreference,
    InformationPage,
    TextItem,
)

User = get_user_model()


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Image
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    # Read only properties (computed property, foreign model)
    end_dt = serializers.DateTimeField(read_only=True)
    image_url = serializers.SerializerMethodField(method_name='get_image_url', read_only=True)

    # For post/put (change image by id)
    image_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Event
        exclude = ['image']

    def get_image_url(self, event: Event) -> str:
        return event.image.image.url if event.image else None


class EventGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventGroup
        fields = '__all__'


class VenueSerializer(serializers.ModelSerializer):

    class Meta:
        model = Venue
        fields = '__all__'


class ClosedPeriodSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClosedPeriod
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * username
      * password.
    It will try to authenticate the user with when validated.
    https://www.guguweb.com/2022/01/23/django-rest-framework-authentication-the-easy-way/
    """
    username = serializers.CharField(label='Username', write_only=True)
    password = serializers.CharField(
        label='Password',
        # This will be used when the DRF browsable API is enabled.
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs: dict) -> dict:
        # Inherited function.
        # Take username and password from request
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            if not user:
                # If we don't have a regular user, raise a ValidationError
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id', 'nickname']


class UserPreferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserPreference
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    profile = ProfileSerializer(many=False, read_only=True)
    permissions = serializers.SerializerMethodField(method_name='get_permissions', read_only=True)
    object_permissions = serializers.SerializerMethodField(method_name='get_object_permissions', read_only=True)
    user_preference = serializers.SerializerMethodField(method_name='get_user_preference', read_only=True)

    class Meta:
        model = User
        exclude = ['password', 'user_permissions']

    def get_permissions(self, user) -> List[str]:  # type: ignore
        return user.get_all_permissions()

    def permission_to_str(self, permission: Permission) -> str:
        return f'{permission.content_type.app_label}.{permission.codename}'

    def get_object_permissions(self, user) -> List[str]:  # type: ignore
        # Collect user-level and group-level object permissions
        user_object_perms_qs = UserObjectPermission.objects.filter(user=user)
        group_object_perms_qs = GroupObjectPermission.objects.filter(group__in=user.groups.all())
        perms = [p.permission for p in list(user_object_perms_qs)]
        perms += [p.permission for p in list(group_object_perms_qs)]
        # Use list comprehension to generate string representation
        return list(set([self.permission_to_str(perm) for perm in perms]))

    def get_user_preference(self, user) -> dict:  # type: ignore
        prefs = UserPreference.objects.get_or_create(user=user)
        return UserPreferenceSerializer(prefs, many=False).data


# GANGS ###
class GangSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gang
        fields = '__all__'


class GangTypeSerializer(serializers.ModelSerializer):
    gangs = GangSerializer(read_only=True, many=True)

    class Meta:
        model = GangType
        fields = '__all__'


class InformationPageSerializer(serializers.ModelSerializer):

    class Meta:
        model = InformationPage
        fields = '__all__'


class FoodPreferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = FoodPreference
        fields = '__all__'


class FoodCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = FoodCategory
        fields = '__all__'


class MenuItemSerializer(serializers.ModelSerializer):
    food_preferences = FoodPreferenceSerializer(many=True)

    class Meta:
        model = MenuItem
        fields = '__all__'


class MenuSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True)

    class Meta:
        model = Menu
        fields = '__all__'


class SaksdokumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Saksdokument
        fields = '__all__'


class TableSerializer(serializers.ModelSerializer):
    venue = VenueSerializer(many=True)

    class Meta:
        model = Table
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    tables = TableSerializer(many=True)
    user = UserSerializer(many=True)

    class Meta:
        model = Booking
        fields = '__all__'


class TextItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextItem
        fields = '__all__'
