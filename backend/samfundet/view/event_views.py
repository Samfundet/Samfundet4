# =============================== #
#           Events                #
# =============================== #
from __future__ import annotations

from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from django.utils import timezone

from root.custom_classes.permission_classes import RoleProtectedOrAnonReadOnlyObjectPermissions

from samfundet.utils import event_query
from samfundet.serializers import (
    EventSerializer,
    EventGroupSerializer,
)
from samfundet.models.event import Event, EventGroup


class EventView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class EventPerDayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        # Fetch and serialize events.
        events = Event.objects.filter(start_dt__gt=timezone.now()).order_by('start_dt')
        serialized = EventSerializer(events, many=True).data

        # Organize in date dictionary.
        events_per_day: dict = {}
        for event, serial in zip(events, serialized, strict=False):
            date = event.start_dt.strftime('%Y-%m-%d')
            events_per_day.setdefault(date, [])
            events_per_day[date].append(serial)

        return Response(data=events_per_day)


class EventsUpcomingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        events = event_query(query=request.query_params)
        events = events.filter(start_dt__gt=timezone.now()).order_by('start_dt')
        return Response(data=EventSerializer(events, many=True).data)


class EventGroupView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = EventGroupSerializer
    queryset = EventGroup.objects.all()
