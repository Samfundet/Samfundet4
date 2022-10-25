from rest_framework.viewsets import ModelViewSet

from .models import Event, Venue
from .serializers import EventSerializer, VenueSerializer


class EventView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class VenueView(ModelViewSet):
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()
