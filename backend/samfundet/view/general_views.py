# =============================== #
#          Home Page              #
# =============================== #
from __future__ import annotations

from typing import Any
from datetime import timedelta
from itertools import chain

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter
from rest_framework.request import Request
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

from django.utils import timezone
from django.db.models import Count, QuerySet, ProtectedError
from django.shortcuts import get_object_or_404

from root.constants import WebFeatures
from root.custom_classes.permission_classes import FeatureEnabled, RoleProtectedOrAnonReadOnlyObjectPermissions

from samfundet.homepage import homepage
from samfundet.pagination import CustomPageNumberPagination
from samfundet.models.role import Role, UserOrgRole, UserGangRole, UserGangSectionRole
from samfundet.serializers import (
    TagSerializer,
    RoleSerializer,
    ImageSerializer,
    MerchSerializer,
    VenueSerializer,
    InfoboxSerializer,
    BlogPostSerializer,
    KeyValueSerializer,
    TextItemSerializer,
    UserOrgRoleSerializer,
    ClosedPeriodSerializer,
    OrganizationSerializer,
    SaksdokumentSerializer,
    UserFeedbackSerializer,
    UserGangRoleSerializer,
    UserGangSectionRoleSerializer,
)
from samfundet.models.general import (
    Tag,
    Image,
    Merch,
    Venue,
    Infobox,
    BlogPost,
    KeyValue,
    TextItem,
    ClosedPeriod,
    Saksdokument,
    UserFeedbackModel,
)
from samfundet.organization.models import Gang, Organization
from samfundet.models.model_choices import SaksdokumentCategory
from samfundet.organization.serializers.public import PublicGangSerializer


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
    feature_key = WebFeatures.IMAGES
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
    serializer_class = ImageSerializer
    queryset = Image.objects.all().order_by('-pk')
    pagination_class = CustomPageNumberPagination
    filter_backends = [SearchFilter]
    search_fields = ['title', 'tags__name']

    def get_queryset(self) -> QuerySet[Image]:
        """With ?tag=<name>, returns only images carrying that exact tag."""
        queryset = super().get_queryset()
        tag_name = self.request.query_params.get('tag')
        if tag_name:
            queryset = queryset.filter(tags__name__iexact=tag_name)
        return queryset

    def destroy(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                status=status.HTTP_409_CONFLICT,
                data={'detail': 'Cannot delete image, it is in use by other objects.'},
            )


# Image tags
class TagView(ModelViewSet):
    POPULAR_TAG_COUNT = 20

    feature_key = WebFeatures.IMAGES
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
    serializer_class = TagSerializer
    queryset = Tag.objects.all()

    def get_queryset(self) -> QuerySet[Tag]:
        """With ?popular=true on list, annotreturns the most used tags annotated with image_count."""
        queryset = super().get_queryset()
        if self.action == 'list' and self.request.query_params.get('popular'):
            queryset = queryset.annotate(image_count=Count('images')).filter(image_count__gt=0).order_by('-image_count', 'name')[: self.POPULAR_TAG_COUNT]
        return queryset


class VenueView(ModelViewSet):
    feature_key = WebFeatures.VENUE
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()
    lookup_field = 'slug'

    @action(detail=False, methods=['get'])
    def open_venues(self, request: Request) -> Response:
        # Note: This 4-hour offset must match frontend getVenueDay() in utils.ts
        day_name = (timezone.now() - timedelta(hours=4)).strftime('%A').lower()

        open_venues = Venue.objects.filter(**{f'is_open_{day_name}': True})
        serializer = self.get_serializer(open_venues, many=True)
        return Response(serializer.data)


class ClosedPeriodView(ModelViewSet):
    feature_key = WebFeatures.CLOSED_HOURS
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
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
    feature_key = WebFeatures.DOCUMENTS
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
    serializer_class = SaksdokumentSerializer
    queryset = Saksdokument.objects.all()

    @action(detail=False, methods=['get'])
    def categories(self, request: Request, **kwargs: Any) -> Response:
        data = [{'value': value, 'label': label} for value, label in SaksdokumentCategory.choices]
        return Response(data)


class OrganizationView(ModelViewSet):
    feature_key = WebFeatures.ORGANIZATION
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()

    @action(detail=True, methods=['get'])
    def gangs(self, request: Request, **kwargs: Any) -> Response:
        organization = self.get_object()
        gangs = Gang.objects.filter(organization=organization)
        serializer = PublicGangSerializer(gangs, many=True)
        return Response(serializer.data)


class InfoboxView(ModelViewSet):
    permission_classes = (RoleProtectedOrAnonReadOnlyObjectPermissions,)
    serializer_class = InfoboxSerializer
    queryset = Infobox.objects.all()


class BlogPostView(ModelViewSet):
    feature_key = WebFeatures.BLOG
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()


class RoleView(ModelViewSet):
    feature_key = WebFeatures.ROLES
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
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
    feature_key = WebFeatures.MERCH
    permission_classes = (
        RoleProtectedOrAnonReadOnlyObjectPermissions,
        FeatureEnabled,
    )
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
