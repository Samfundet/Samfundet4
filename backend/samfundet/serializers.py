from __future__ import annotations

import itertools
from typing import TYPE_CHECKING
from collections import defaultdict

from guardian.models import UserObjectPermission, GroupObjectPermission

from rest_framework import serializers

from django.db.models import Q, QuerySet
from django.core.files import File
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.files.images import ImageFile
from django.contrib.auth.models import Group, Permission

from root.constants import PHONE_NUMBER_REGEX
from root.utils.mixins import CustomBaseSerializer

from .models.role import Role
from .models.event import Event, EventGroup, EventCustomTicket, PurchaseFeedbackModel, PurchaseFeedbackQuestion, PurchaseFeedbackAlternative
from .models.billig import BilligEvent, BilligPriceGroup, BilligTicketGroup
from .models.general import (
    Tag,
    Gang,
    Menu,
    User,
    Image,
    Merch,
    Table,
    Venue,
    Campus,
    Booking,
    Infobox,
    Profile,
    BlogPost,
    GangType,
    KeyValue,
    MenuItem,
    TextItem,
    Reservation,
    ClosedPeriod,
    FoodCategory,
    Organization,
    Saksdokument,
    FoodPreference,
    MerchVariation,
    UserPreference,
    InformationPage,
    UserFeedbackModel,
)
from .models.recruitment import (
    Interview,
    Recruitment,
    InterviewRoom,
    OccupiedTimeslot,
    RecruitmentDateStat,
    RecruitmentGangStat,
    RecruitmentPosition,
    RecruitmentTimeStat,
    RecruitmentCampusStat,
    RecruitmentStatistics,
    RecruitmentApplication,
    RecruitmentSeparatePosition,
    RecruitmentInterviewAvailability,
)
from .models.model_choices import RecruitmentStatusChoices, RecruitmentPriorityChoices

if TYPE_CHECKING:
    from typing import Any

if TYPE_CHECKING:
    from typing import Any


class TagSerializer(CustomBaseSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ImageSerializer(CustomBaseSerializer):
    # Read only tags used in frontend.
    tags = TagSerializer(many=True, read_only=True)
    url = serializers.SerializerMethodField(method_name='get_url', read_only=True)

    # Write only fields for posting new images.
    file = serializers.FileField(write_only=True, required=True)
    # Comma separated tag string "tag_a,tag_b" is automatically parsed to list of tag models.
    tag_string = serializers.CharField(write_only=True, allow_blank=True, required=False)

    class Meta:
        model = Image
        exclude = ['image']

    def create(self, validated_data: dict) -> Event:
        """
        Uses the write_only file field to create new image file.
        Automatically finds/creates new tags based on comma-separated string.
        """
        file = validated_data.pop('file')
        if 'tag_string' in validated_data:
            tag_names = validated_data.pop('tag_string').split(',')
            tags = [Tag.objects.get_or_create(name=name)[0] for name in tag_names]
        else:
            tags = []
        image = Image.objects.create(
            image=ImageFile(file, validated_data['title']),
            **validated_data,
        )
        image.tags.set(tags)
        image.save()
        return image

    def get_url(self, image: Image) -> str:
        return image.image.url if image.image else None


class EventCustomTicketSerializer(CustomBaseSerializer):
    class Meta:
        model = EventCustomTicket
        fields = '__all__'


class BilligPriceGroupSerializer(CustomBaseSerializer):
    class Meta:
        model = BilligPriceGroup
        fields = ['id', 'name', 'can_be_put_on_card', 'membership_needed', 'netsale', 'price']


class BilligTicketGroupSerializer(CustomBaseSerializer):
    # These fields are calculated based on percentages sold and should be public
    is_almost_sold_out = serializers.BooleanField(read_only=True)
    is_sold_out = serializers.BooleanField(read_only=True)

    # Price groups in this ticket group
    price_groups = BilligPriceGroupSerializer(many=True, read_only=True)

    class Meta:
        model = BilligTicketGroup
        # The number of tickets and sold tickets should not be
        # public, so don't add the 'num' and 'num_sold' fields here!
        fields = [
            'id',
            'name',
            'is_sold_out',
            'is_almost_sold_out',
            'ticket_limit',
            'price_groups',
        ]


class BilligEventSerializer(CustomBaseSerializer):
    ticket_groups = BilligTicketGroupSerializer(many=True, read_only=True)

    class Meta:
        model = BilligEvent
        fields = [
            'id',
            'name',
            'ticket_groups',
            'sale_from',
            'sale_to',
            'in_sale_period',
            'is_almost_sold_out',
            'is_sold_out',
        ]


class EventListSerializer(serializers.ListSerializer):
    """Speedup fetching of billig events for lists serialization"""

    def to_representation(self, events: list[Event] | QuerySet[Event]) -> list[str]:
        # Prefetch related/billig for speed
        if hasattr(events, 'prefetch_related'):
            events = events.prefetch_related('custom_tickets')
            events = events.prefetch_related('image')

        Event.prefetch_billig(events=events, tickets=True, prices=True)

        # Use event serializer (child) as normal after
        return [self.child.to_representation(e) for e in events]


class EventSerializer(CustomBaseSerializer):
    class Meta:
        model = Event
        list_serializer_class = EventListSerializer
        # Warning: registration object contains sensitive data, don't include it!
        exclude = ['image', 'registration', 'event_group', 'billig_id']

    # Read only properties (computed property, foreign model).
    end_dt = serializers.DateTimeField(read_only=True)
    total_registrations = serializers.IntegerField(read_only=True)
    image_url = serializers.CharField(read_only=True)

    # Custom tickets/billig
    custom_tickets = EventCustomTicketSerializer(many=True, read_only=True)
    billig = BilligEventSerializer(read_only=True)

    # For post/put (change image by id).
    image_id = serializers.IntegerField(write_only=True)

    def create(self, validated_data: dict) -> Event:
        """
        Uses the write_only field 'image_id' to get an Image object
        and sets it in the new event. Read/write only fields enable
        us to use the same serializer for both reading and writing.
        """
        validated_data['image'] = Image.objects.get(pk=validated_data['image_id'])
        event = Event(**validated_data)
        event.save()
        return event


class EventGroupSerializer(CustomBaseSerializer):
    class Meta:
        model = EventGroup
        fields = '__all__'


class VenueSerializer(CustomBaseSerializer):
    class Meta:
        model = Venue
        fields = '__all__'


class ClosedPeriodSerializer(CustomBaseSerializer):
    class Meta:
        model = ClosedPeriod
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * username
      * password.
    It will try to authenticate the user with when validated.
    https://www.guguweb.com/2022/01/23/django-rest-framework-authentication-the-easy-way/
    """

    username = serializers.CharField(label='Username', write_only=True)
    password = serializers.CharField(
        label='Password',
        # This will be used when the DRF browsable API is enabled.
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
    )

    def validate(self, attrs: dict) -> dict:
        # Inherited function.
        # Take username and password from request.
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            if not user:
                # If we don't have a regular user, raise a ValidationError.
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs


class RegisterSerializer(serializers.Serializer):
    """
    This serializer defines following fields for registration
      * username
      * email
      * phone_number
      * firstname
      * lastname
      * password
    """

    username = serializers.CharField(label='Username', write_only=True)
    email = serializers.EmailField(label='Email', write_only=True)
    phone_number = serializers.RegexField(
        label='Phonenumber',
        regex=PHONE_NUMBER_REGEX,
        write_only=True,
    )
    firstname = serializers.CharField(label='First name', write_only=True)
    lastname = serializers.CharField(label='Last name', write_only=True)
    password = serializers.CharField(
        label='Password',
        # This will be used when the DRF browsable API is enabled.
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
    )

    ALREADY_EXISTS_MESSAGE = 'User already exists with this value'

    def validate(self, attrs: dict) -> dict:  # noqa: C901
        # Inherited function.
        # Take username and password from request.
        username = attrs.get('username')
        email = attrs.get('email')
        phone_number = attrs.get('phone_number')
        firstname = attrs.get('firstname')
        lastname = attrs.get('lastname')
        password = attrs.get('password')
        # Check for unique
        existing_users = User.objects.filter(Q(username=username) | Q(email=email) | Q(phone_number=phone_number))

        if existing_users:
            errors: dict[str, list[ValidationError]] = defaultdict(list)
            if username in existing_users.values_list('username', flat=True):
                errors['username'].append(self.ALREADY_EXISTS_MESSAGE)
            if email in existing_users.values_list('email', flat=True):
                errors['email'].append(self.ALREADY_EXISTS_MESSAGE)
            if phone_number in existing_users.values_list('phone_number', flat=True):
                errors['phone_number'].append(self.ALREADY_EXISTS_MESSAGE)
            raise serializers.ValidationError(errors)

        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = User.objects.create_user(
                first_name=firstname, last_name=lastname, username=username, email=email, phone_number=phone_number, password=password
            )
            user = authenticate(request=self.context.get('request'), username=username, password=password)
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'nickname']


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = '__all__'


class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    profile = ProfileSerializer(many=False, read_only=True)
    campus = CampusSerializer(read_only=True)
    permissions = serializers.SerializerMethodField(method_name='get_permissions', read_only=True)
    object_permissions = serializers.SerializerMethodField(method_name='get_object_permissions', read_only=True)
    user_preference = serializers.SerializerMethodField(method_name='get_user_preference', read_only=True)

    class Meta:
        model = User
        exclude = ['password', 'user_permissions']

    def get_permissions(self, user: User) -> list[str]:
        return user.get_all_permissions()

    @staticmethod
    def _permission_to_str(permission: Permission) -> str:
        return f'{permission.content_type.app_label}.{permission.codename}'

    def _obj_permission_to_obj(self, obj_perm: UserObjectPermission | GroupObjectPermission) -> dict[str, str]:
        perm_obj = {
            'obj_pk': obj_perm.object_pk,
            'permission': self._permission_to_str(permission=obj_perm.permission),
        }
        return perm_obj

    def get_object_permissions(self, user: User) -> list[dict[str, str]]:
        # Collect user-level and group-level object permissions.
        user_object_perms_qs = UserObjectPermission.objects.filter(user=user)
        group_object_perms_qs = GroupObjectPermission.objects.filter(group__in=user.groups.all())

        perm_objs = []
        for obj_perm in itertools.chain(user_object_perms_qs, group_object_perms_qs):
            perm_objs.append(self._obj_permission_to_obj(obj_perm=obj_perm))  # noqa: PERF401

        return perm_objs

    def get_user_preference(self, user: User) -> dict:
        user_preference, _created = UserPreference.objects.get_or_create(user=user)
        return UserPreferenceSerializer(user_preference, many=False).data


# GANGS ###
class OrganizationSerializer(CustomBaseSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class GangSerializer(CustomBaseSerializer):
    class Meta:
        model = Gang
        fields = '__all__'


class RecruitmentGangSerializer(CustomBaseSerializer):
    recruitment_positions = serializers.SerializerMethodField(method_name='get_positions_count', read_only=True)

    class Meta:
        model = Gang
        fields = '__all__'

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        # This will allow it to filter applications on recruitment
        self.recruitment = kwargs.pop('recruitment', None)
        self.gang = kwargs.pop('gang', None)
        super().__init__(*args, **kwargs)

    def get_positions_count(self, obj: Gang) -> list[int]:
        """Return total number of positions for this gang's recruitment."""
        return RecruitmentPosition.objects.filter(recruitment=self.recruitment, gang=obj).count()


class GangTypeSerializer(CustomBaseSerializer):
    gangs = GangSerializer(read_only=True, many=True)

    class Meta:
        model = GangType
        fields = '__all__'


class InformationPageSerializer(CustomBaseSerializer):
    class Meta:
        model = InformationPage
        fields = '__all__'


class BlogPostSerializer(CustomBaseSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'


class FoodPreferenceSerializer(CustomBaseSerializer):
    class Meta:
        model = FoodPreference
        fields = '__all__'


class FoodCategorySerializer(CustomBaseSerializer):
    class Meta:
        model = FoodCategory
        fields = ['id', 'name_nb', 'name_en']


class MenuItemSerializer(CustomBaseSerializer):
    food_preferences = FoodPreferenceSerializer(many=True, read_only=True)  # Todo make this work with post
    food_category = FoodCategorySerializer(read_only=True)

    class Meta:
        model = MenuItem
        fields = '__all__'


class MenuSerializer(CustomBaseSerializer):
    menu_items = MenuItemSerializer(many=True)

    class Meta:
        model = Menu
        fields = '__all__'


class RoleSerializer(CustomBaseSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class SaksdokumentSerializer(CustomBaseSerializer):
    # Read only url file path used in frontend
    url = serializers.SerializerMethodField(method_name='get_url', read_only=True)
    # Write only field for posting new document
    file = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Saksdokument
        fields = '__all__'

    def get_url(self, instance: Saksdokument) -> str | None:
        return instance.file.url if instance.file else None

    def create(self, validated_data: dict) -> Event:
        """Uses the write_only file field to create new document file."""
        file = validated_data.pop('file')
        # Ensure file name ends with .pdf
        fname = validated_data['title_nb']
        fname = f'{fname}.pdf' if not fname.lower().endswith('.pdf') else fname
        # Save model
        document = Saksdokument.objects.create(
            file=File(file, name=fname),
            **validated_data,
        )
        document.save()
        return document


class TextItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextItem
        fields = '__all__'


class InfoboxSerializer(CustomBaseSerializer):
    class Meta:
        model = Infobox
        fields = '__all__'


class KeyValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyValue
        fields = '__all__'


# =============================== #
#            Sulten               #
# =============================== #


class TableSerializer(CustomBaseSerializer):
    class Meta:
        model = Table
        fields = '__all__'


class ReservationSerializer(CustomBaseSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'


class ReservationCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['guest_count', 'occasion', 'reservation_date']


class BookingSerializer(serializers.ModelSerializer):
    tables = TableSerializer(many=True)
    user = UserSerializer(many=True)

    class Meta:
        model = Booking
        fields = '__all__'


# =============================== #
#              Merch              #
# =============================== #


class MerchVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MerchVariation
        fields = '__all__'


class MerchSerializer(serializers.ModelSerializer):
    variations = MerchVariationSerializer(many=True, read_only=True)
    stock = serializers.SerializerMethodField()

    class Meta:
        model = Merch
        fields = '__all__'

    def get_stock(self, obj: Merch) -> int:
        return obj.in_stock()


# =============================== #
#            Recruitment          #
# =============================== #


class RecruitmentTimeStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentTimeStat
        exclude = ['id', 'recruitment_stats']


class RecruitmentDateStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentDateStat
        exclude = ['id', 'recruitment_stats']


class RecruitmentCampusStatSerializer(serializers.ModelSerializer):
    campus = serializers.SerializerMethodField(method_name='campus_name', read_only=True)
    applicant_percentage = serializers.SerializerMethodField(method_name='get_applicant_percentage', read_only=True)

    class Meta:
        model = RecruitmentCampusStat
        exclude = ['id', 'recruitment_stats']

    def campus_name(self, stat: RecruitmentCampusStat) -> str:
        return stat.campus.name_nb if stat.campus else None

    def get_applicant_percentage(self, stat: RecruitmentCampusStat) -> float:
        return stat.normalized_applicant_percentage()


class RecruitmentGangStatSerializer(serializers.ModelSerializer):
    gang = serializers.SerializerMethodField(method_name='gang_name', read_only=True)

    class Meta:
        model = RecruitmentGangStat
        exclude = ['id', 'recruitment_stats']

    def gang_name(self, stat: RecruitmentGangStat) -> str:
        return stat.gang.name_nb


class RecruitmentStatisticsSerializer(serializers.ModelSerializer):
    time_stats = RecruitmentTimeStatSerializer(read_only=True, many=True)
    date_stats = RecruitmentDateStatSerializer(read_only=True, many=True)
    campus_stats = RecruitmentCampusStatSerializer(read_only=True, many=True)
    gang_stats = RecruitmentGangStatSerializer(read_only=True, many=True)

    class Meta:
        model = RecruitmentStatistics
        fields = '__all__'


class RecruitmentUpdateUserPrioritySerializer(serializers.Serializer):
    direction = serializers.IntegerField(label='direction', write_only=True)


class UserForRecruitmentSerializer(serializers.ModelSerializer):
    applications = serializers.SerializerMethodField(method_name='get_applications', read_only=True)
    applications_without_interview = serializers.SerializerMethodField(method_name='get_applications_without_interviews_for_recruitment', read_only=True)
    top_application = serializers.SerializerMethodField(method_name='get_top_application', read_only=True)
    campus = CampusSerializer()

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'username',
            'email',
            'phone_number',
            'applications',
            'campus',
            'applications_without_interview',
            'top_application',
        ]

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        # This will allow it to filter applications on recruitment
        self.recruitment = kwargs.pop('recruitment', None)
        self.gang = kwargs.pop('gang', None)
        super().__init__(*args, **kwargs)

    def get_applications(self, obj: User) -> list[int]:
        """Return list of recruitment application IDs for the user."""
        applications = RecruitmentApplication.objects.filter(user=obj)
        if self.recruitment:
            applications = applications.filter(recruitment=self.recruitment)
        if self.gang:
            applications = applications.filter(recruitment_position__gang=self.gang)
        return RecruitmentApplicationForApplicantSerializer(applications, many=True).data

    def get_applications_without_interviews_for_recruitment(self, obj: User) -> list[int]:
        """Return list of recruitment application IDs for the user."""
        applications = RecruitmentApplication.objects.filter(user=obj, interview=None)
        if self.recruitment:
            applications = applications.filter(recruitment=self.recruitment)
        if self.gang:
            applications = applications.filter(recruitment_position__gang=self.gang)
        return RecruitmentApplicationForApplicantSerializer(applications, many=True).data

    def get_top_application(self, obj: User) -> list[int]:
        applications = RecruitmentApplication.objects.filter(user=obj)
        if self.recruitment:
            applications = applications.filter(recruitment=self.recruitment)
        if self.gang:
            applications = applications.filter(recruitment_position__gang=self.gang)
        return RecruitmentApplicationForApplicantSerializer(applications.order_by('applicant_priority').first()).data


class InterviewerSerializer(CustomBaseSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'id',
        ]


class RecruitmentSeparatePositionSerializer(CustomBaseSerializer):
    class Meta:
        model = RecruitmentSeparatePosition
        fields = [
            'id',
            'recruitment',
            'name_nb',
            'name_en',
            'description_nb',
            'description_en',
            'url',
        ]


class RecruitmentSerializer(CustomBaseSerializer):
    separate_positions = RecruitmentSeparatePositionSerializer(many=True, read_only=True)

    class Meta:
        model = Recruitment
        fields = '__all__'

    def to_representation(self, instance: Recruitment) -> dict:
        data = super().to_representation(instance)
        data['organization'] = OrganizationSerializer(instance.organization).data
        return data


class RecruitmentForRecruiterSerializer(CustomBaseSerializer):
    separate_positions = RecruitmentSeparatePositionSerializer(many=True, read_only=True)
    recruitment_progress = serializers.SerializerMethodField(method_name='get_recruitment_progress', read_only=True)
    statistics = RecruitmentStatisticsSerializer(read_only=True)

    class Meta:
        model = Recruitment
        fields = '__all__'

    def get_recruitment_progress(self, instance: Recruitment) -> float:
        return instance.recruitment_progress()


class RecruitmentPositionSerializer(CustomBaseSerializer):
    total_applicants = serializers.SerializerMethodField(method_name='get_total_applicants', read_only=True)
    processed_applicants = serializers.SerializerMethodField(method_name='get_processed_applicants', read_only=True)
    accepted_applicants = serializers.SerializerMethodField(method_name='get_accepted_applicants', read_only=True)

    gang = GangSerializer(read_only=True)
    interviewers = InterviewerSerializer(many=True, read_only=True)

    class Meta:
        model = RecruitmentPosition
        fields = '__all__'

    def _update_interviewers(
        self,
        *,
        recruitment_position: RecruitmentPosition,
        interviewer_objects: list[dict],
    ) -> None:
        try:
            interviewers = []
            if interviewer_objects:
                interviewer_ids = [interviewer.get('id') for interviewer in interviewer_objects]
                if interviewer_ids:
                    interviewers = User.objects.filter(id__in=interviewer_ids)
            recruitment_position.interviewers.set(interviewers)
        except (TypeError, KeyError):
            raise ValidationError('Invalid data for interviewers.') from None
        
    def validate(self, data: dict) -> dict:
        gang_id = self.initial_data.get('gang').get('id')
        if gang_id:
            try:
                data['gang'] = Gang.objects.get(id=gang_id)
            except Gang.DoesNotExist:
                raise serializers.ValidationError("Invalid gang id")
        return super().validate(data)

    def create(self, validated_data: dict) -> RecruitmentPosition:
        recruitment_position = super().create(validated_data)
        interviewer_objects = self.initial_data.get('interviewers', [])
        self._update_interviewers(recruitment_position=recruitment_position, interviewer_objects=interviewer_objects)
        return recruitment_position

    def update(self, instance: RecruitmentPosition, validated_data: dict) -> RecruitmentPosition:
        updated_instance = super().update(instance, validated_data)
        interviewer_objects = self.initial_data.get('interviewers', [])
        self._update_interviewers(recruitment_position=updated_instance, interviewer_objects=interviewer_objects)
        return updated_instance

    def get_total_applicants(self, recruitment_position: RecruitmentPosition) -> int:
        return RecruitmentApplication.objects.filter(recruitment_position=recruitment_position, withdrawn=False).count()

    def get_processed_applicants(self, recruitment_position: RecruitmentPosition) -> int:
        return (
            RecruitmentApplication.objects.filter(recruitment_position=recruitment_position, withdrawn=False)
            .exclude(recruiter_status=RecruitmentStatusChoices.NOT_SET)
            .count()
        )

    def get_accepted_applicants(self, recruitment_position: RecruitmentPosition) -> int:
        return RecruitmentApplication.objects.filter(
            recruitment_position=recruitment_position, withdrawn=False, recruiter_status=RecruitmentStatusChoices.CALLED_AND_ACCEPTED
        ).count()


class ApplicantInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = [
            'id',
            'interview_time',
            'interview_location',
        ]


class RecruitmentPositionForApplicantSerializer(serializers.ModelSerializer):
    gang = GangSerializer()

    class Meta:
        model = RecruitmentPosition
        fields = [
            'id',
            'name_nb',
            'name_en',
            'short_description_nb',
            'short_description_en',
            'long_description_nb',
            'long_description_en',
            'is_funksjonaer_position',
            'default_application_letter_nb',
            'default_application_letter_en',
            'gang',
            'recruitment',
        ]


class RecruitmentApplicationForApplicantSerializer(CustomBaseSerializer):
    interview = ApplicantInterviewSerializer(read_only=True)

    class Meta:
        model = RecruitmentApplication
        fields = [
            'id',
            'application_text',
            'recruitment_position',
            'applicant_priority',
            'withdrawn',
            'interview',
            'created_at',
            'user',
            'recruitment',
        ]
        read_only_fields = [
            'applicant_priority',
            'withdrawn',
        ]

    def create(self, validated_data: dict) -> RecruitmentApplication:
        recruitment_position = validated_data['recruitment_position']
        # should auto fail if no position exists
        recruitment = recruitment_position.recruitment
        user = self.context['request'].user

        recruitment_application = RecruitmentApplication.objects.create(
            application_text=validated_data.get('application_text'),
            recruitment_position=recruitment_position,
            recruitment=recruitment,
            user=user,
        )

        return recruitment_application

    def to_representation(self, instance: RecruitmentApplication) -> dict:
        data = super().to_representation(instance)
        data['recruitment_position'] = RecruitmentPositionForApplicantSerializer(instance.recruitment_position).data
        return data


class RecruitmentInterviewAvailabilitySerializer(CustomBaseSerializer):
    # Set custom format to remove seconds from start/end times, as they are ignored
    start_time = serializers.DateTimeField(format='%H:%M')
    end_time = serializers.DateTimeField(format='%H:%M')

    class Meta:
        model = RecruitmentInterviewAvailability
        fields = ['recruitment', 'position', 'start_date', 'end_date', 'start_time', 'end_time', 'timeslot_interval']


class OccupiedTimeslotSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupiedTimeslot
        fields = '__all__'


class ApplicantInfoSerializer(CustomBaseSerializer):
    occupied_timeslots = OccupiedTimeslotSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'occupied_timeslots']


class InterviewRoomSerializer(CustomBaseSerializer):
    class Meta:
        model = InterviewRoom
        fields = '__all__'


class InterviewSerializer(CustomBaseSerializer):
    interviewers = InterviewerSerializer(many=True, required=False)

    class Meta:
        model = Interview
        fields = '__all__'

    def create(self, validated_data: dict) -> Interview:
        interviewers_data = validated_data.pop('interviewers', [])
        interview = super().create(validated_data)
        interview.interviewers.set(interviewers_data)
        return interview

    def update(self, instance: Interview, validated_data: dict) -> Interview:
        interviewers_data = validated_data.pop('interviewers', [])
        instance = super().update(instance, validated_data)
        instance.interviewers.set(interviewers_data)
        return instance


class RecruitmentApplicationForRecruiterSerializer(serializers.ModelSerializer):
    recruitment_position = RecruitmentPositionForApplicantSerializer()
    recruiter_priority = serializers.CharField(source='get_recruiter_priority_display')
    interview_time = serializers.SerializerMethodField(method_name='get_interview_time', read_only=True)

    class Meta:
        model = RecruitmentApplication
        fields = [
            'id',
            'recruitment',
            'user',
            'application_text',
            'recruitment_position',
            'recruiter_status',
            'applicant_priority',
            'applicant_state',
            'recruiter_priority',
            'withdrawn',
            'interview_time',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'recruitment',
            'user',
            'application_text',
            'recruitment_position',
            'recruiter_status',
            'applicant_priority',
            'recruiter_priority',
            'applicant_state',
            'interview_time',
            'withdrawn',
            'created_at',
        ]

    def get_interview_time(self, instance: RecruitmentApplication) -> str | None:
        return instance.interview.interview_time if instance.interview else None


class RecruitmentBasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number']


class RecruitmentRecruitmentPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentPosition
        fields = ['id', 'name_nb', 'name_en', 'gang']


class RecruitmentShowUnprocessedApplicationsSerializer(serializers.ModelSerializer):
    user = RecruitmentBasicUserSerializer(read_only=True)
    recruitment_position = RecruitmentRecruitmentPositionSerializer(read_only=True)

    class Meta:
        model = RecruitmentApplication
        fields = [
            'id',
            'recruitment',
            'user',
            'applicant_priority',
            'recruitment_position',
            'recruiter_status',
            'recruiter_priority',
        ]
        read_only_fields = [
            'id',
            'recruitment',
            'user',
            'applicant_priority',
            'recruitment_position',
            'recruiter_status',
            'recruiter_priority',
        ]

    def get_recruitment_position(self, instance: RecruitmentApplication) -> str:
        return instance.recruitment_position.name_nb


class RecruitmentApplicationForGangSerializer(CustomBaseSerializer):
    user = ApplicantInfoSerializer(read_only=True)
    interview = InterviewSerializer(read_only=False)
    interviewers = InterviewerSerializer(many=True, read_only=True)
    recruitment_position = RecruitmentPositionSerializer(read_only=True)
    application_count = serializers.SerializerMethodField(method_name='get_application_count', read_only=True)

    class Meta:
        model = RecruitmentApplication
        fields = '__all__'

    def update(self, instance: RecruitmentApplication, validated_data: dict) -> RecruitmentApplication:
        # More or less this is rough, interview should be its own thing
        interview_data = validated_data.pop('interview', {})

        interview_instance = instance.interview
        interview_instance.interview_location = interview_data.get('interview_location', interview_instance.interview_location)
        interview_instance.interview_time = interview_data.get('interview_time', interview_instance.interview_time)
        interviewers_data = validated_data.pop('interviewers', [])
        interview_instance.interviewers.set(interviewers_data)
        interview_instance.notes = interview_data.get('notes', interview_instance.notes)
        interview_instance.save()

        # Update other fields of RecruitmentApplication instance
        return super().update(instance, validated_data)

    def get_application_count(self, application: RecruitmentApplication) -> int:
        return application.user.applications.filter(recruitment=application.recruitment).count()


class RecruitmentApplicationUpdateForGangSerializer(serializers.Serializer):
    recruiter_priority = serializers.ChoiceField(choices=RecruitmentPriorityChoices.choices, required=False)
    recruiter_status = serializers.ChoiceField(choices=RecruitmentStatusChoices.choices, required=False)


class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedbackModel
        fields = [
            'text',
            'contact_email',
            'path',
            'screen_resolution',
        ]
        extra_kwargs = {
            'contact_email': {'required': False},
            'screen_resolution': {'required': False},
        }


class PurchaseFeedbackAlternativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseFeedbackAlternative
        fields = ['alternative', 'selected']


class PurchaseFeedbackQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseFeedbackQuestion
        fields = ['question', 'answer']


class PurchaseFeedbackSerializer(serializers.ModelSerializer):
    alternatives = serializers.DictField(child=serializers.CharField())
    responses = serializers.DictField(child=serializers.CharField())

    class Meta:
        model = PurchaseFeedbackModel
        fields = ['event', 'title', 'alternatives', 'responses']

    def create(self, validated_data: dict) -> PurchaseFeedbackModel:
        alternatives_data = validated_data.pop('alternatives')
        responses_data = validated_data.pop('responses')

        event = validated_data.pop('event')

        purchase_feedback = PurchaseFeedbackModel.objects.create(event=event, **validated_data)

        for alternative, selected in alternatives_data.items():
            PurchaseFeedbackAlternative.objects.create(form=purchase_feedback, alternative=alternative, selected=selected)

        for question, answer in responses_data.items():
            PurchaseFeedbackQuestion.objects.create(form=purchase_feedback, question=question, answer=answer)

        return purchase_feedback
