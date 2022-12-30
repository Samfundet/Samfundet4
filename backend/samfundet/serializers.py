from rest_framework import serializers

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Permission, Group

from .models import (
    Menu, Gang, Event, EventGroup, Table, Venue, Booking, Profile, MenuItem, GangType, FoodCategory, Saksdokument, FoodPreference, UserPreference,
    InformationPage, Image, Tag
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
    end_dt = serializers.DateTimeField(required=False)

    class Meta:
        model = Event
        fields = '__all__'


class EventGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventGroup
        fields = '__all__'


class VenueSerializer(serializers.ModelSerializer):

    class Meta:
        model = Venue
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    # pylint: disable=abstract-method
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
        # pylint: disable=positional-arguments # Inherited function.
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


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
        ]


class PermissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = '__all__'


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


class UserPreferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserPreference
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
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
