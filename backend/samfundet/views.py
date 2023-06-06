from typing import Type

from django.contrib.auth import login, logout
from django.contrib.auth.models import Group
from django.db.models import QuerySet
from django.middleware.csrf import get_token
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, DjangoModelPermissionsOrAnonReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from root.constants import XCSRFTOKEN
from .homepage import homepage
from .models.event import (Event, EventGroup)
from .models.recruitment import (Recruitment, RecruitmentPosition)
from .models.general import (
    Tag,
    User,
    Menu,
    Gang,
    Table,
    Venue,
    Image,
    Profile,
    Booking,
    MenuItem,
    GangType,
    TextItem,
    KeyValue,
    Organization,
    FoodCategory,
    Saksdokument,
    ClosedPeriod,
    FoodPreference,
    UserPreference,
    InformationPage,
)
from .serializers import (
    TagSerializer,
    GangSerializer,
    MenuSerializer,
    UserSerializer,
    ImageSerializer,
    EventSerializer,
    TableSerializer,
    VenueSerializer,
    LoginSerializer,
    GroupSerializer,
    ProfileSerializer,
    BookingSerializer,
    RegisterSerializer,
    TextItemSerializer,
    KeyValueSerializer,
    MenuItemSerializer,
    GangTypeSerializer,
    EventGroupSerializer,
    RecruitmentSerializer,
    SaksdokumentSerializer,
    OrganizationSerializer,
    FoodCategorySerializer,
    ClosedPeriodSerializer,
    FoodPreferenceSerializer,
    UserPreferenceSerializer,
    InformationPageSerializer,
    RecruitmentPositionSerializer,
)
from .utils import event_query

# =============================== #
#          Home Page              #
# =============================== #


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
    serializer_class = ImageSerializer
    queryset = Image.objects.all().order_by('-pk')


# Image tags
class TagView(ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()


# =============================== #
#           Events                #
# =============================== #


class EventView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class EventPerDayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        # Fetch and serialize events
        events = Event.objects.filter(start_dt__gt=timezone.now()).order_by('start_dt')
        serialized = EventSerializer(events, many=True).data

        # Organize in date dictionary
        events_per_day: dict = {}
        for event, serial in zip(events, serialized):
            date = event.start_dt.strftime('%Y-%m-%d')
            events_per_day.setdefault(date, [])
            events_per_day[date].append(serial)

        return Response(data=events_per_day)


class EventsUpcomingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        events = event_query(request.query_params)
        events = events.filter(start_dt__gt=timezone.now()).order_by('start_dt')
        return Response(data=EventSerializer(events, many=True).data)


class EventGroupView(ModelViewSet):
    http_method_names = ['get']
    serializer_class = EventGroupSerializer
    queryset = EventGroup.objects.all()


# =============================== #
#            General              #
# =============================== #


class VenueView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()


class ClosedPeriodView(ModelViewSet):
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
    permission_classes = [AllowAny]
    serializer_class = SaksdokumentSerializer
    queryset = Saksdokument.objects.all()


class OrganizationView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()


class GangView(ModelViewSet):
    serializer_class = GangSerializer
    queryset = Gang.objects.all()


class GangTypeView(ModelViewSet):
    http_method_names = ['get']
    serializer_class = GangTypeSerializer
    queryset = GangType.objects.all()


class InformationPageView(ModelViewSet):
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly, )
    serializer_class = InformationPageSerializer
    queryset = InformationPage.objects.all()


# =============================== #
#            Sulten               #
# =============================== #


class MenuView(ModelViewSet):
    serializer_class = MenuSerializer
    queryset = Menu.objects.all()


class MenuItemView(ModelViewSet):
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all()


class FoodCategoryView(ModelViewSet):
    serializer_class = FoodCategorySerializer
    queryset = FoodCategory.objects.all()


class FoodPreferenceView(ModelViewSet):
    serializer_class = FoodPreferenceSerializer
    queryset = FoodPreference.objects.all()


class TableView(ModelViewSet):
    serializer_class = TableSerializer
    queryset = Table.objects.all()


class BookingView(ModelViewSet):
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()


# =============================== #
#          Auth/Login             #
# =============================== #


@method_decorator(csrf_protect, 'dispatch')
class LoginView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request=request, user=user)
        new_csrf_token = get_token(request=request)

        return Response(
            status=status.HTTP_202_ACCEPTED,
            data=new_csrf_token,
            headers={XCSRFTOKEN: new_csrf_token},
        )


@method_decorator(csrf_protect, 'dispatch')
class LogoutView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        logout(request)
        return Response(status=status.HTTP_200_OK)


@method_decorator(csrf_protect, 'dispatch')
class RegisterView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RegisterSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request=request, user=user)
        new_csrf_token = get_token(request=request)

        return Response(
            status=status.HTTP_202_ACCEPTED,
            data=new_csrf_token,
            headers={XCSRFTOKEN: new_csrf_token},
        )


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(data=UserSerializer(request.user, many=False).data)


class AllUsersView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()


class AllGroupsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer
    queryset = Group.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
class CsrfView(APIView):
    permission_classes: list[Type[BasePermission]] = [AllowAny]

    def get(self, request: Request) -> Response:
        csrf_token = get_token(request=request)
        return Response(data=csrf_token, headers={XCSRFTOKEN: csrf_token})


@method_decorator(csrf_protect, 'dispatch')
class UserPreferenceView(ModelViewSet):
    serializer_class = UserPreferenceSerializer
    queryset = UserPreference.objects.all()


class ProfileView(ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
class AssignGroupView(APIView):
    """
     Assigns a user to a group.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        username = request.data.get('username')
        group_name = request.data.get('group_name')

        if not username or not group_name:
            return Response({'error': 'Username and group_name fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            group = Group.objects.get(name=group_name)
        except Group.DoesNotExist:
            return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.has_perm('auth.change_group', group):
            user.groups.add(group)
        else:
            return Response({'error': 'You do not have permission to add users to this group.'}, status=status.HTTP_403_FORBIDDEN)

        return Response({'message': f"User '{username}' added to group '{group_name}'."}, status=status.HTTP_200_OK)

    def delete(self, request: Request) -> Response:
        username = request.data.get('username')
        group_name = request.data.get('group_name')

        if not username or not group_name:
            return Response({'error': 'Username and group_name fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            group = Group.objects.get(name=group_name)
        except Group.DoesNotExist:
            return Response({'error': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.has_perm('auth.change_group', group):
            user.groups.remove(group)
        else:
            return Response({'error': 'You do not have permission to remove users from this group.'}, status=status.HTTP_403_FORBIDDEN)

        return Response({'message': f"User '{username}' removed from '{group_name}'."}, status=status.HTTP_200_OK)


# =============================== #
#            Recruitment          #
# =============================== #


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentView(ModelViewSet):
    # TODO: Verify that object is valid (that the times make sense)
    permission_classes = [AllowAny]
    serializer_class = RecruitmentSerializer
    queryset = Recruitment.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentPositionView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionSerializer
    queryset = RecruitmentPosition.objects.all()


@method_decorator(ensure_csrf_cookie, 'dispatch')
class RecruitmentPositionsPerRecruitmentView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = RecruitmentPositionSerializer

    def get_queryset(self) -> Response:
        """
        Optionally restricts the returned positions to a given recruitment,
        by filtering against a `recruitment` query parameter in the URL.
        """
        recruitment = self.request.query_params.get('recruitment', None)
        if recruitment is not None:
            return RecruitmentPosition.objects.filter(recruitment=recruitment)
        else:
            return None
