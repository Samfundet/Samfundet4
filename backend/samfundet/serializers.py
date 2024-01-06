import itertools

from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Group, Permission
from django.core.files import File
from django.core.files.images import ImageFile
from django.db.models import QuerySet
from guardian.models import GroupObjectPermission, UserObjectPermission

from rest_framework import serializers
from root.constants import PHONE_NUMBER_REGEX
from .models.billig import BilligEvent, BilligTicketGroup, BilligPriceGroup
from .models.recruitment import (
    Recruitment,
    RecruitmentPosition,
    RecruitmentAdmission,
    InterviewRoom,
    Interview,
    Occupiedtimeslot,
)
from .models.event import (Event, EventGroup, EventCustomTicket)
from .models.general import (
    Tag,
    User,
    Menu,
    Gang,
    Table,
    Venue,
    Image,
    Infobox,
    Booking,
    Profile,
    TextItem,
    MenuItem,
    GangType,
    KeyValue,
    Organization,
    BlogPost,
    FoodCategory,
    Saksdokument,
    ClosedPeriod,
    FoodPreference,
    UserPreference,
    InformationPage,
)


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
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


class EventCustomTicketSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventCustomTicket
        fields = '__all__'


class BilligPriceGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = BilligPriceGroup
        fields = ['id', 'name', 'can_be_put_on_card', 'membership_needed', 'netsale', 'price']


class BilligTicketGroupSerializer(serializers.ModelSerializer):
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


class BilligEventSerializer(serializers.ModelSerializer):
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
    """
    Speedup fetching of billig events for lists serialization
    """

    def to_representation(self, events: list[Event] | QuerySet[Event]) -> list[str]:
        # Prefetch related/billig for speed
        if hasattr(events, 'prefetch_related'):
            events = events.prefetch_related('custom_tickets')
            events = events.prefetch_related('image')

        Event.prefetch_billig(events, tickets=True, prices=True)

        # Use event serializer (child) as normal after
        return [self.child.to_representation(e) for e in events]


class EventSerializer(serializers.ModelSerializer):

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


class EventGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventGroup
        fields = '__all__'


class VenueSerializer(serializers.ModelSerializer):

    class Meta:
        model = Venue
        fields = '__all__'


class ClosedPeriodSerializer(serializers.ModelSerializer):

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
        write_only=True
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
        write_only=True
    )

    def validate(self, attrs: dict) -> dict:
        # Inherited function.
        # Take username and password from request.
        username = attrs.get('username')
        email = attrs.get('email')
        phone_number = attrs.get('phone_number')
        firstname = attrs.get('firstname')
        lastname = attrs.get('lastname')
        password = attrs.get('password')

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


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id', 'nickname']


class UserPreferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserPreference
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    profile = ProfileSerializer(many=False, read_only=True)
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
            perm_objs.append(self._obj_permission_to_obj(obj_perm=obj_perm))

        return perm_objs

    def get_user_preference(self, user: User) -> dict:
        user_preference, _created = UserPreference.objects.get_or_create(user=user)
        return UserPreferenceSerializer(user_preference, many=False).data


# GANGS ###
class OrganizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organization
        fields = '__all__'


class GangSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gang
        fields = '__all__'


class GangTypeSerializer(serializers.ModelSerializer):
    gangs = GangSerializer(read_only=True, many=True)

    class Meta:
        model = GangType
        fields = '__all__'


class InformationPageSerializer(serializers.ModelSerializer):

    class Meta:
        model = InformationPage
        fields = '__all__'


class BlogPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlogPost
        fields = '__all__'


class FoodPreferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = FoodPreference
        fields = '__all__'


class FoodCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = FoodCategory
        fields = ['id', 'name_nb', 'name_en']


class MenuItemSerializer(serializers.ModelSerializer):
    food_preferences = FoodPreferenceSerializer(many=True)
    food_category = FoodCategorySerializer()

    class Meta:
        model = MenuItem
        fields = '__all__'


class MenuSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True)

    class Meta:
        model = Menu
        fields = '__all__'


class SaksdokumentSerializer(serializers.ModelSerializer):
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
        """
        Uses the write_only file field to create new document file.
        """
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


class TableSerializer(serializers.ModelSerializer):
    venue = VenueSerializer(many=True)

    class Meta:
        model = Table
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    tables = TableSerializer(many=True)
    user = UserSerializer(many=True)

    class Meta:
        model = Booking
        fields = '__all__'


class TextItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextItem
        fields = '__all__'


class InfoboxSerializer(serializers.ModelSerializer):

    class Meta:
        model = Infobox
        fields = '__all__'


class KeyValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = KeyValue
        fields = '__all__'


# =============================== #
#            Recruitment          #
# =============================== #


class RecruitmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recruitment
        fields = '__all__'


class UserForRecruitmentSerializer(serializers.ModelSerializer):
    recruitment_admission_ids = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'username',
            'email',
            'recruitment_admission_ids',  # Add this to the fields list
        ]

    def get_recruitment_admission_ids(self, obj: User) -> list[int]:
        """Return list of recruitment admission IDs for the user."""
        return RecruitmentAdmission.objects.filter(user=obj).values_list('id', flat=True)


class InterviewerSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'id',
        ]


class RecruitmentPositionSerializer(serializers.ModelSerializer):
    gang = GangSerializer(read_only=True)
    interviewers = InterviewerSerializer(many=True, read_only=True)

    class Meta:
        model = RecruitmentPosition
        fields = '__all__'

    def _update_interviewers(self, recruitment_position: RecruitmentPosition, interviewer_objects: list[dict]) -> None:
        try:
            interviewers = []
            if interviewer_objects:
                interviewer_ids = [interviewer.get('id') for interviewer in interviewer_objects]
                if interviewer_ids:
                    interviewers = User.objects.filter(id__in=interviewer_ids)
            recruitment_position.interviewers.set(interviewers)
        except (TypeError, KeyError):
            raise ValidationError('Invalid data for interviewers.')

    def create(self, validated_data: dict) -> RecruitmentPosition:
        recruitment_position = super().create(validated_data)
        interviewer_objects = self.initial_data.get('interviewers', [])
        self._update_interviewers(recruitment_position, interviewer_objects)
        return recruitment_position

    def update(self, instance: RecruitmentPosition, validated_data: dict) -> RecruitmentPosition:
        updated_instance = super().update(instance, validated_data)
        interviewer_objects = self.initial_data.get('interviewers', [])
        self._update_interviewers(updated_instance, interviewer_objects)
        return updated_instance


class RecruitmentAdmissionForApplicantSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecruitmentAdmission
        fields = [
            'admission_text',
            'recruitment_position',
        ]

    def create(self, validated_data: dict) -> RecruitmentAdmission:
        recruitment_position = validated_data['recruitment_position']
        recruitment = recruitment_position.recruitment
        user = self.context['request'].user
        applicant_priority = 1

        recruitment_admission = RecruitmentAdmission.objects.create(
            admission_text=validated_data.get('admission_text'),
            recruitment_position=recruitment_position,
            recruitment=recruitment,
            user=user,
            applicant_priority=applicant_priority,
        )

        return recruitment_admission


class OccupiedtimeslotSerializer(serializers.ModelSerializer):

    class Meta:
        model = Occupiedtimeslot
        fields = '__all__'


class ApplicantInfoSerializer(serializers.ModelSerializer):
    occupied_timeslots = OccupiedtimeslotSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'occupied_timeslots']


class InterviewRoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = InterviewRoom
        fields = '__all__'


class InterviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interview
        fields = '__all__'


class RecruitmentAdmissionForGangSerializer(serializers.ModelSerializer):
    user = ApplicantInfoSerializer(read_only=True)
    interview = InterviewSerializer(read_only=False)

    class Meta:
        model = RecruitmentAdmission
        fields = '__all__'

    def update(self, instance: RecruitmentAdmission, validated_data: dict) -> RecruitmentAdmission:
        interview_data = validated_data.pop('interview', {})

        interview_instance = instance.interview
        interview_instance.interview_location = interview_data.get('interview_location', interview_instance.interview_location)
        interview_instance.interview_time = interview_data.get('interview_time', interview_instance.interview_time)
        interview_instance.save()

        # Update other fields of RecruitmentAdmission instance
        return super().update(instance, validated_data)
