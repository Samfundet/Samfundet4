# =============================== #
#          Home Page              #
# =============================== #
from __future__ import annotations

from typing import Any
from itertools import chain

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

from django.utils import timezone
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404

from root.custom_classes.permission_classes import RoleProtectedOrAnonReadOnlyObjectPermissions

from samfundet.homepage import homepage
from samfundet.models.role import Role, UserOrgRole, UserGangRole, UserGangSectionRole
from samfundet.serializers import (
    TagSerializer,
    GangSerializer,
    RoleSerializer,
    ImageSerializer,
    MerchSerializer,
    VenueSerializer,
    InfoboxSerializer,
    BlogPostSerializer,
    GangTypeSerializer,
    KeyValueSerializer,
    TextItemSerializer,
    UserOrgRoleSerializer,
    ClosedPeriodSerializer,
    OrganizationSerializer,
    SaksdokumentSerializer,
    UserFeedbackSerializer,
    UserGangRoleSerializer,
    InformationPageSerializer,
    UserGangSectionRoleSerializer,
)
from samfundet.models.general import (
    Tag,
    Gang,
    Image,
    Merch,
    Venue,
    Infobox,
    BlogPost,
    GangType,
    KeyValue,
    TextItem,
    ClosedPeriod,
    Organization,
    Saksdokument,
    InformationPage,
    UserFeedbackModel,
)


class HomePageView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        return Response(data=homepage.generate())


# =============================== #
#            Utility              #
# =============================== #


# Localized text storage
class TextItemView(ReadOnlyModelViewSet):
    """All CRUD operations can be performed in the admin panel instead."""

    permission_classes = [AllowAny]
    serializer_class = TextItemSerializer
    queryset = TextItem.objects.all()


class KeyValueView(ReadOnlyModelViewSet):
    """All CRUD operations can be performed in the admin panel instead."""

    permission_classes = [AllowAny]
    serializer_class = KeyValueSerializer
    queryset = KeyValue.objects.all()
    lookup_field = 'key'


# Images
class ImageView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = ImageSerializer
    queryset = Image.objects.all().order_by('-pk')


# Image tags
class TagView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = TagSerializer
    queryset = Tag.objects.all()


class VenueView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()
    lookup_field = 'slug'


class ClosedPeriodView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = ClosedPeriodSerializer
    queryset = ClosedPeriod.objects.all()


class IsClosedView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ClosedPeriodSerializer

    def get_queryset(self) -> QuerySet:
        return ClosedPeriod.objects.filter(
            start_dt__lte=timezone.now(),
            end_dt__gte=timezone.now(),
        )


class SaksdokumentView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = SaksdokumentSerializer
    queryset = Saksdokument.objects.all()


class OrganizationView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()

    @action(detail=True, methods=['get'])
    def gangs(self, request: Request, **kwargs: Any) -> Response:
        organization = self.get_object()
        gangs = Gang.objects.filter(organization=organization)
        serializer = GangSerializer(gangs, many=True)
        return Response(serializer.data)


class GangView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = GangSerializer
    queryset = Gang.objects.all()


class GangTypeView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = GangTypeSerializer
    queryset = GangType.objects.all()


class GangTypeOrganizationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = GangTypeSerializer

    def get(self, request: Request, organization: int) -> Response:
        data = GangType.objects.filter(organization=organization)
        return Response(data=self.serializer_class(data, many=True).data, status=status.HTTP_200_OK)


class InformationPageView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = InformationPageSerializer
    queryset = InformationPage.objects.all()


class InfoboxView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = InfoboxSerializer
    queryset = Infobox.objects.all()


class BlogPostView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()


class RoleView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = RoleSerializer
    queryset = Role.objects.all()

    @action(detail=True, methods=['get'])
    def users(self, request: Request, pk: int) -> Response:
        role = get_object_or_404(Role, id=pk)

        org_roles = UserOrgRole.objects.filter(role=role).select_related('user', 'obj')
        gang_roles = UserGangRole.objects.filter(role=role).select_related('user', 'obj')
        section_roles = UserGangSectionRole.objects.filter(role=role).select_related('user', 'obj')

        org_data = UserOrgRoleSerializer(org_roles, many=True).data
        gang_data = UserGangRoleSerializer(gang_roles, many=True).data
        section_data = UserGangSectionRoleSerializer(section_roles, many=True).data

        combined = list(chain(org_data, gang_data, section_data))

        return Response(combined)


# =============================== #
#             Merch               #
# =============================== #
class MerchView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = MerchSerializer
    queryset = Merch.objects.all()


class UserFeedbackView(CreateAPIView):
    permission_classes = [AllowAny]
    model = UserFeedbackModel
    serializer_class = UserFeedbackSerializer

    def create(self, request: Request) -> Response:
        data = request.data

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        UserFeedbackModel.objects.create(
            user=request.user if request.user.is_authenticated else None,
            text=data.get('text'),
            path=data.get('path'),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            screen_resolution=data.get('screen_resolution'),
            contact_email=data.get('contact_email'),
        )

        return Response(status=status.HTTP_201_CREATED, data={'message': 'Feedback submitted successfully!'})
