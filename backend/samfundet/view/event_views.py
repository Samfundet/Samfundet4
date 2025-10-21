# =============================== #
#           Events                #
# =============================== #
from __future__ import annotations

from django.utils import timezone

from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView

from root.custom_classes.permission_classes import RoleProtectedOrAnonReadOnlyObjectPermissions

from samfundet.models.event import (
    Event,
    EventGroup,
    PurchaseFeedbackAlternative,
    PurchaseFeedbackQuestion,
)
from samfundet.models.general import Venue
from samfundet.models.model_choices import EventStatus
from samfundet.serializers import (
    EventGroupSerializer,
    EventSerializer,
    PurchaseFeedbackSerializer,
)
from samfundet.utils import event_query


class EventView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class EventPerDayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        # Fetch and serialize events.
        now = timezone.now()
        # Only events:
        # - with a start date/time that is later than the current time will be included
        # - where the event's visibility period has already begun
        # - where  visibility period hasn't ended yet
        # - where status is "PUBLIC"
        events = Event.objects.filter(start_dt__gt=now, visibility_from_dt__lte=now, visibility_to_dt__gte=now, status=EventStatus.PUBLIC).order_by('start_dt')
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
        serialized_events = EventSerializer(events, many=True).data

        # Fetch all venue names
        venue_names = list(Venue.objects.values_list('name', flat=True))

        response_data = {
            'events': serialized_events,
            'categories': Event._meta.get_field('category').choices if Event._meta.get_field('category').choices else [],
            'locations': venue_names if venue_names else [],
        }

        return Response(data=response_data, status=status.HTTP_200_OK)



class EventGroupView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = EventGroupSerializer
    queryset = EventGroup.objects.all()


class PurchaseFeedbackView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseFeedbackSerializer

    def post(self, request: Request) -> Response:
        request.data['event'] = request.data.pop('eventId')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        purchase_model = serializer.save(user=request.user)

        alternatives = request.data.get('alternatives', {})
        for alternative, selected in alternatives.items():
            PurchaseFeedbackAlternative.objects.create(
                alternative=alternative,
                selected=selected,
                form=purchase_model,
            )

        questions = request.data.get('questions', {})
        for question, answer in questions.items():
            PurchaseFeedbackQuestion.objects.create(
                question=question,
                answer=answer,
                form=purchase_model,
            )
        return Response(status=status.HTTP_201_CREATED, data={'message': 'Feedback submitted successfully!'})
