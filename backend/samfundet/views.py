from typing import Type

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission

from django.utils import timezone
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.contrib.auth.models import Group
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.db.models import Q, CharField, TextField, QuerySet

from root.constants import XCSRFTOKEN

from .utils import (
    event_query,
    user_to_dataclass,
    users_to_dataclass,
    groups_to_dataclass,
    events_to_dataclass,
    closedperiod_to_dataclass,
)

from .models import (
    Tag,
    User,
    Menu,
    Gang,
    Event,
    Table,
    Image,
    Venue,
    Profile,
    Booking,
    MenuItem,
    GangType,
    TextItem,
    EventGroup,
    FoodCategory,
    Saksdokument,
    ClosedPeriod,
    FoodPreference,
    UserPreference,
    InformationPage,
)
from .serializers import (
    TagSerializer,
    ImageSerializer,
    GangSerializer,
    MenuSerializer,
    EventSerializer,
    TableSerializer,
    VenueSerializer,
    LoginSerializer,
    ProfileSerializer,
    BookingSerializer,
    TextItemSerializer,
    MenuItemSerializer,
    GangTypeSerializer,
    EventGroupSerializer,
    SaksdokumentSerializer,
    FoodCategorySerializer,
    ClosedPeriodSerializer,
    FoodPreferenceSerializer,
    UserPreferenceSerializer,
    InformationPageSerializer,
)


class TextItemView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = TextItemSerializer
    queryset = TextItem.objects.all()


class EventView(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class EventPerDayView(APIView):
    permission_classes = [AllowAny]

    def url_args(self, query_word: str) -> str:
        query = self.request.GET.get(query_word, None)
        if query is None:
            return ''
        return query.split(',')[0]

    def general_search(self, events_query: QuerySet, search_term: str) -> QuerySet:
        fields = [f for f in Event._meta.fields if (isinstance(f, CharField) or isinstance(f, TextField))]
        queries = [Q(**{f.name+'__contains': search_term}) for f in fields]
        qs = Q()
        for query in queries:
            qs = qs | query

        return events_query.filter(qs)

    def statusGroup(self) -> str:
        if self.request.GET.get('archived', None) == 'true':
            return 'active'
        return 'archived'

    def get(self, request: Request) -> Response:
        events: dict = {}
        events_query = Event.objects.all()

        if '?' in self.request.build_absolute_uri():
            events_query = self.general_search(events_query, self.url_args('search')).filter(
                Q(location__contains=self.url_args('location')),
                Q(status_group=self.statusGroup())
            )

        for event in events_query.all().order_by('start_dt').values():
            _data_ = event['start_dt'].strftime('%Y-%m-%d')
            events.setdefault(_data_, [])
            events[_data_].append(event)

        return Response(data=events)


class EventsUpcommingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        events = event_query(request.query_params)
        events = events.filter(start_dt__gt=timezone.now()).order_by('start_dt')  # TODO Update with duration
        events = [event.to_dict() for event in events_to_dataclass(events=events)]  # type: ignore[attr-defined]
        return Response(data=events)


class EventFormView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        data = {
            'age_groups': Event.AgeGroup.choices,
            'status_groups': Event.StatusGroup.choices,
            'venues': [[v.name] for v in Venue.objects.all()],
            'event_groups': [[e.id, e.name] for e in EventGroup.objects.all()]
        }
        return Response(data=data)


class VenueView(ModelViewSet):
    serializer_class = VenueSerializer
    queryset = Venue.objects.all()


class ClosedPeriodView(ModelViewSet):
    serializer_class = ClosedPeriodSerializer
    queryset = ClosedPeriod.objects.all()


class IsClosedView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        closed_period = ClosedPeriod.objects.filter(start_dt__lte=timezone.now(), end_dt__gte=timezone.now()).first()
        data = closedperiod_to_dataclass(closed_period=closed_period) if closed_period else None
        return Response(data={data})


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


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = user_to_dataclass(user=request.user)
        return Response(data=user.to_dict())  # type: ignore[attr-defined]


class AllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        users = users_to_dataclass(users=User.objects.all())
        users_objs = [user.to_dict() for user in users]  # type: ignore[attr-defined]
        return Response(data=users_objs)


class AllGroupsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        all_groups = groups_to_dataclass(groups=Group.objects.all())
        all_groups_objs = [group.to_dict() for group in all_groups]  # type: ignore[attr-defined]
        return Response(data=all_groups_objs)


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


### GANGS ###
class GangView(ModelViewSet):
    serializer_class = GangSerializer
    queryset = Gang.objects.all()


class GangTypeView(ModelViewSet):
    http_method_names = ['get']
    serializer_class = GangTypeSerializer
    queryset = GangType.objects.all()


class GangFormView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        data = {'gang_type': [[e.id, e.title_nb] for e in GangType.objects.all()],
                'info_page': [[e.slug_field] for e in InformationPage.objects.all()]}
        return Response(data=data)


class EventGroupView(ModelViewSet):
    http_method_names = ['get']
    serializer_class = EventGroupSerializer
    queryset = EventGroup.objects.all()


### Information Page ###


class InformationPageView(ModelViewSet):
    serializer_class = InformationPageSerializer
    queryset = InformationPage.objects.all()


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


class SaksdokumentView(ModelViewSet):
    serializer_class = SaksdokumentSerializer
    queryset = Saksdokument.objects.all()


class SaksdokumentFormView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        data = {'categories': Saksdokument.SaksdokumentCategory.choices}
        return Response(data=data)


class TableView(ModelViewSet):
    serializer_class = TableSerializer
    queryset = Table.objects.all()


class BookingView(ModelViewSet):
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()


class TagView(ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()


class ImageView(ModelViewSet):
    serializer_class = ImageSerializer
    queryset = Image.objects.all()
