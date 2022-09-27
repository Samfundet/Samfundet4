from rest_framework.viewsets import ModelViewSet

from .models import Event
from .serializers import EventSerializer


class EventView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
