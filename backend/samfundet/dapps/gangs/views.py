from rest_framework.viewsets import ModelViewSet
# Create your views here.

from .models import Gang, GangType
from .serializers import GangSerializer, GangTypeSerializer


class GangView(ModelViewSet):
    serializer_class = GangSerializer
    queryset = Gang.objects.all()


class GangTypeView(ModelViewSet):
    serializer_class = GangTypeSerializer
    queryset = GangType.objects.all()
