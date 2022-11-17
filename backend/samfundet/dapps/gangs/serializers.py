from rest_framework import serializers

from django.contrib.auth import get_user_model

from .models import Gang, GangType

User = get_user_model()


class GangSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gang
        fields = '__all__'


class GangTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = GangType
        fields = '__all__'
