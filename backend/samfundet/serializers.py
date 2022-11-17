from rest_framework import serializers

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Permission, Group

from .models import Event, Venue

User = get_user_model()


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
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
