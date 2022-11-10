from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from django.contrib.auth import login

from .models import Event, Venue
from .serializers import EventSerializer, VenueSerializer, LoginSerializer


class EventView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class VenueView(ModelViewSet):
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()


class LoginView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (AllowAny, )

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request=request, user=user)
        return Response(data=None, status=status.HTTP_202_ACCEPTED)
