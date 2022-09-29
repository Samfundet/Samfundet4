from rest_framework import serializers
from .models import Event, Lokale


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = '__all__'


class LokaleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lokale
        fields = '__all__'
