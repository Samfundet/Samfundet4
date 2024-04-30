#
# This file contains most of the django models used for Samf4
#

from __future__ import annotations

import re
import secrets
from abc import abstractmethod
from typing import TYPE_CHECKING
from datetime import date, time, datetime, timedelta
from collections import defaultdict

from guardian.shortcuts import assign_perm
from notifications.base.models import AbstractNotification

from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.contrib.auth.models import Group, AbstractUser

from root.utils import permissions
from root.utils.mixins import CustomBaseModel, FullCleanSaveMixin
from root.utils.compute_permissions import Node, dfs

from samfundet.models.model_choices import ReservationOccasion, UserPreferenceTheme, SaksdokumentCategory

from .utils.fields import LowerCaseField, PhoneNumberField
from .utils.string_utils import ellipsize

if TYPE_CHECKING:
    from typing import Any

    from django.db.models import Model


class CustomPermisionsModel(CustomBaseModel):
    class Meta:
        abstract = True

    @abstractmethod
    def has_perm(self, user: User) -> bool:
        pass


class Notification(AbstractNotification):
    class Meta(AbstractNotification.Meta):
        abstract = False


class Tag(CustomBaseModel):
    # TODO make name case-insensitive
    # Kan tvinge alt til lowercase, er enklere.
    name = models.CharField(max_length=140)
    color = models.CharField(max_length=6, null=True, blank=True)

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'

    def __str__(self) -> str:
        return f'{self.name}'

    @classmethod
    def random_color(cls) -> str:
        hexnr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        c = [secrets.choice(range(len(hexnr))) for _ in range(6)]
        while sum(c) < (len(hexnr)) * 5:  # Controls if color is not too bright
            c = [secrets.choice(range(len(hexnr))) for _ in range(6)]
        return ''.join([hexnr[i] for i in c])

    @classmethod
    def find_or_create(cls, name: str) -> Tag:
        # TODO make name case-insensitive
        obj = Tag.objects.get(name=name)
        if obj is not None:
            return obj
        # Create new tag if none exists
        return Tag.objects.create(name=name, color=Tag.random_color())

    def save(self, *args: Any, **kwargs: Any) -> None:
        # Saves with random color
        if not self.color or not re.search(r'^(?:[0-9a-fA-F]{3}){1,2}$', self.color):
            self.color = Tag.random_color()
        super().save(*args, **kwargs)


class Image(CustomBaseModel):
    title = models.CharField(max_length=140)
    tags = models.ManyToManyField(Tag, blank=True, related_name='images')
    image = models.ImageField(upload_to='images/', blank=False, null=False)

    class Meta:
        verbose_name = 'Image'
        verbose_name_plural = 'Images'

    def __str__(self) -> str:
        return f'{self.title}'


class Campus(FullCleanSaveMixin):
    name_nb = models.CharField(max_length=64, unique=True, blank=False, null=False)
    name_en = models.CharField(max_length=64, unique=True, blank=False, null=False)
    abbreviation = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self) -> str:
        if not self.abbreviation:
            return f'{self.name_nb}'
        return f'{self.name_nb} ({self.abbreviation})'


class Role(CustomBaseModel):
    """
    This table stores all roles avalible. Groups, permissions and roles are all the same things, although a
    role functioning as a permission should ideally not have any children.
    """

    # The name of the role. i.e. 'MG-gjengleder', 'FS-arrangementansvarlig', 'MG-WEB-funksjonær'
    name = models.CharField(max_length=64, blank=True, unique=True)

    # This is a list of all roles that are included in this permission group.
    ownes = models.ManyToManyField('self', blank=True)

    class Meta:
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'

    def save(self, *args, **kwargs) -> None:
        ComputedRoleDescendants.compute_descendants()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs) -> None:
        ComputedRoleDescendants.compute_descendants()
        super().delete(*args, **kwargs)

    def __str__(self) -> str:
        return f'{self.name}'


class ComputedRoleDescendants(CustomBaseModel):
    """This table stores the computed descendant roles for each role."""

    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role')

    # A descendent of the role.
    descendant = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='descendant')

    @staticmethod
    def initialize_descendants() -> dict[Role, set[Role]]:
        role_descendants = {node: set() for node in Role.objects.all()}
        for node in role_descendants:
            role_descendants[node].add(node)
        return role_descendants

    @staticmethod
    def search_for_descendants(role_descendants: dict[Role, set[Role]]) -> dict[Role, set[Role]]:
        for node in role_descendants:
            stack = [node]
            while stack:
                current_node = stack.pop()
                for child in current_node.children:
                    if child not in role_descendants[node]:
                        role_descendants[node].add(child)
                        stack.append(child)

    @staticmethod
    def compute_descendants() -> None:
        # Drop rows ComputedRoleDescendants table
        ComputedRoleDescendants.objects.all().delete()

        # Compute the descendants of each role
        role_descendants = ComputedRoleDescendants.search_for_descendants(ComputedRoleDescendants.initialize_descendants())

        ##Create a new row for each descendant of each role
        for role in role_descendants:
            for descendant in role:
                ComputedRoleDescendants.objects.create(role=role, descendant=descendant)


class User(AbstractUser):
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    username = LowerCaseField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[AbstractUser.username_validator],
        error_messages={
            'unique': _('A user with that username already exists.'),
        },
    )
    phone_number = PhoneNumberField(
        _('phone_number'),
        blank=False,
        null=False,
        editable=True,
    )
    email = models.EmailField(
        _('email'),
        blank=False,
        null=False,
        unique=True,
    )
    campus = models.ForeignKey(
        Campus,
        blank=True,
        null=True,
        on_delete=models.PROTECT,
    )
    role = models.ManyToManyField(Role, blank=True)

    class Meta:
        permissions = [
            ('debug', 'Can view debug mode'),
            ('impersonate', 'Can impersonate users'),
        ]

    def has_global_perm(self, perm: Role) -> bool:
        # Fetch precomputed descendants
        descendants = ComputedRoleDescendants.objects.filter(role__in=self.role)
        # Check if the required permission is in the descendants
        return perm is not None and perm in descendants

    def has_object_perm(self, obj: CustomPermisionsModel) -> bool:
        return obj is not None and obj.has_perm(self)

    def has_perm(self, perm: Role, obj: CustomPermisionsModel) -> bool:
        """
        Because Django's ModelBackend and django-guardian's ObjectPermissionBackend
        are completely separate, calling `has_perm()` with an `obj` will return `False`
        even though the user has global perms.
            We have decided that global permissions implies that any obj perm check
        should return `True`. This function is extended to check both.
        """
        return self.has_global_perm(perm) or self.has_object_perm(obj)

    @property
    def is_impersonated(self) -> bool:
        return self._impersonated_by is not None

    @property
    def impersonated_by(self) -> User:
        if not self.is_impersonated:
            raise Exception('Real user not available unless currently impersonated.')
        return self._impersonated_by


class UserPreference(FullCleanSaveMixin):
    """Group all preferences and config per user."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    theme = models.CharField(max_length=30, choices=UserPreferenceTheme.choices, default=UserPreferenceTheme.LIGHT, blank=True, null=True)
    mirror_dimension = models.BooleanField(default=False)
    cursor_trail = models.BooleanField(default=False)

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        verbose_name = 'UserPreference'
        verbose_name_plural = 'UserPreferences'

    def __str__(self) -> str:
        return f'UserPreference ({self.user})'


class Profile(FullCleanSaveMixin):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    nickname = models.CharField(max_length=30, blank=True, null=True)

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'

    def __str__(self) -> str:
        return f'Profile ({self.user})'

    def save(self, *args: Any, **kwargs: Any) -> None:
        """Additional operations on save."""
        super().save(*args, **kwargs)

        # Extend Profile to assign permission to whichever user is related to it.
        assign_perm(perm=permissions.SAMFUNDET_VIEW_PROFILE, user_or_group=self.user, obj=self)
        assign_perm(perm=permissions.SAMFUNDET_CHANGE_PROFILE, user_or_group=self.user, obj=self)


class Venue(CustomBaseModel):
    name = models.CharField(max_length=140, blank=True, null=True, unique=True)
    slug = models.SlugField(unique=True, null=True)
    description = models.TextField(blank=True, null=True)
    floor = models.IntegerField(blank=True, null=True)
    last_renovated = models.DateTimeField(blank=True, null=True)
    handicapped_approved = models.BooleanField(blank=True, null=True)
    responsible_crew = models.CharField(max_length=140, blank=True, null=True)
    opening = models.TimeField(default=time(hour=8), blank=True, null=True)
    closing = models.TimeField(default=time(hour=20), blank=True, null=True)

    opening_monday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_tuesday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_wednesday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_thursday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_friday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_saturday = models.TimeField(default=time(hour=8), blank=True, null=True)
    opening_sunday = models.TimeField(default=time(hour=8), blank=True, null=True)

    closing_monday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_tuesday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_wednesday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_thursday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_friday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_saturday = models.TimeField(default=time(hour=20), blank=True, null=True)
    closing_sunday = models.TimeField(default=time(hour=20), blank=True, null=True)

    class Meta:
        verbose_name = 'Venue'
        verbose_name_plural = 'Venues'

    def get_opening_hours_date(self, selected_date: date | None = None) -> tuple[time, time]:
        selected_date = selected_date or timezone.now().date()
        fields = [
            (self.opening_monday, self.closing_monday),
            (self.opening_tuesday, self.closing_tuesday),
            (self.opening_wednesday, self.closing_wednesday),
            (self.opening_thursday, self.closing_thursday),
            (self.opening_friday, self.closing_friday),
            (self.opening_saturday, self.closing_saturday),
            (self.opening_sunday, self.closing_sunday),
        ]
        return fields[selected_date.weekday()]

    def __str__(self) -> str:
        return f'{self.name}'


class ClosedPeriod(CustomBaseModel):
    message_nb = models.TextField(blank=True, null=True, verbose_name='Melding (norsk)')
    message_en = models.TextField(blank=True, null=True, verbose_name='Melding (engelsk)')

    description_nb = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    start_dt = models.DateField(blank=True, null=False, verbose_name='Start dato')
    end_dt = models.DateField(blank=True, null=False, verbose_name='Slutt dato')

    class Meta:
        verbose_name = 'ClosedPeriod'
        verbose_name_plural = 'ClosedPeriods'

    def __str__(self) -> str:
        return f'{self.message_nb} {self.start_dt}-{self.end_dt}'


# GANGS ###
class Organization(CustomBaseModel):
    """Object for mapping out the orgs with different gangs, eg. Samfundet, UKA, ISFiT"""

    name = models.CharField(max_length=32, blank=False, null=False, unique=True)

    class Meta:
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'

    def __str__(self) -> str:
        return self.name


class GangType(CustomBaseModel):
    """Type of gang. eg. 'arrangerende', 'kunstnerisk' etc."""

    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Norsk')
    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Engelsk')

    class Meta:
        verbose_name = 'GangType'
        verbose_name_plural = 'GangTypes'

    def __str__(self) -> str:
        return f'{self.title_nb}'


class Gang(CustomBaseModel):
    name_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn Norsk')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn Engelsk')
    abbreviation = models.CharField(max_length=8, blank=True, null=True, verbose_name='Forkortelse')
    webpage = models.URLField(verbose_name='Nettside', blank=True, null=True)

    organization = models.ForeignKey(
        to=Organization,
        related_name='gangs',
        verbose_name='Organisasjon',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    logo = models.ImageField(upload_to='ganglogos/', blank=True, null=True, verbose_name='Logo')
    gang_type = models.ForeignKey(to=GangType, related_name='gangs', verbose_name='Gruppetype', blank=True, null=True, on_delete=models.SET_NULL)
    info_page = models.ForeignKey(to='samfundet.InformationPage', verbose_name='Infoside', blank=True, null=True, on_delete=models.SET_NULL)

    # Gang related permission groups
    gang_leader_group = models.OneToOneField(Group, related_name='gang_as_leader', verbose_name='Gangleder', blank=True, null=True, on_delete=models.SET_NULL)
    event_admin_group = models.OneToOneField(
        Group, related_name='gang_as_event_admin_group', verbose_name='Arrangementgruppe', blank=True, null=True, on_delete=models.SET_NULL
    )
    recruitment_admin_group = models.OneToOneField(
        Group, related_name='gang_as_recruitment_admin_group', verbose_name='Innganggruppe', blank=True, null=True, on_delete=models.SET_NULL
    )

    class Meta:
        verbose_name = 'Gang'
        verbose_name_plural = 'Gangs'

    def __str__(self) -> str:
        return f'{self.gang_type} - {self.name_nb}'


class InformationPage(CustomBaseModel):
    slug_field = models.SlugField(
        max_length=64,
        blank=True,
        null=False,
        unique=True,
        primary_key=True,
        help_text='Primary key, this field will identify the object and be used in the URL.',
    )

    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (norsk)')
    text_nb = models.TextField(blank=True, null=True, verbose_name='Tekst (norsk)')

    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (engelsk)')
    text_en = models.TextField(blank=True, null=True, verbose_name='Tekst (engelsk)')

    class Meta:
        verbose_name = 'InformationPage'
        verbose_name_plural = 'InformationPages'

    def __str__(self) -> str:
        return f'{self.slug_field}'


class BlogPost(CustomBaseModel):
    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (norsk)')
    text_nb = models.TextField(blank=True, null=True, verbose_name='Tekst (norsk)')

    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (engelsk)')
    text_en = models.TextField(blank=True, null=True, verbose_name='Tekst (engelsk)')

    image = models.ForeignKey(Image, on_delete=models.SET_NULL, blank=True, null=True)

    published_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)

    # TODO Find usage for owner field

    class Meta:
        verbose_name = 'Blog post'
        verbose_name_plural = 'Blogg posts'

    def __str__(self) -> str:
        return f'{self.title_nb} {self.published_at}'


class Table(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    seating = models.PositiveSmallIntegerField(blank=True, null=True)

    venue = models.ForeignKey(Venue, on_delete=models.PROTECT, blank=True, null=True)

    # TODO Implement HTML and Markdown
    # TODO Find usage for owner field

    class Meta:
        verbose_name = 'Table'
        verbose_name_plural = 'Tables'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class Reservation(CustomBaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=64, blank=True, verbose_name='Navn')
    email = models.EmailField(max_length=64, blank=True, verbose_name='Epost')
    phonenumber = models.CharField(max_length=8, blank=True, null=True, verbose_name='Telefonnummer')

    reservation_date = models.DateField(blank=True, null=False, verbose_name='Dato')
    start_time = models.TimeField(blank=True, null=False, verbose_name='Starttid')
    end_time = models.TimeField(blank=True, null=False, verbose_name='Sluttid')

    venue = models.ForeignKey(Venue, on_delete=models.PROTECT, blank=True, null=True, verbose_name='Sted')

    occasion = models.CharField(max_length=24, choices=ReservationOccasion.choices, default=ReservationOccasion.FOOD)
    guest_count = models.PositiveSmallIntegerField(null=False, verbose_name='Antall gjester')
    additional_info = models.TextField(blank=True, null=True, verbose_name='Tilleggsinformasjon')
    internal_messages = models.TextField(blank=True, null=True, verbose_name='Interne meldinger')

    # TODO Maybe add method for reallocating reservations if tables are reserved, and prohibit if there is an existing
    table = models.ForeignKey(Table, on_delete=models.PROTECT, null=True, blank=True, verbose_name='Bord')

    def fetch_available_times_for_date(*, venue: int, seating: int, date: date) -> list[str]:  # noqa: C901
        """
        Method for returning available reservation times for a venue
        Based on the amount of seating and the date
        """
        # Fetch tables that fits size criteria
        tables = Table.objects.filter(venue=venue, seating__gte=seating)
        # fetch all reservations for those tables for that date
        reserved_tables = (
            Reservation.objects.filter(venue=venue, reservation_date=date, table__in=tables).values('table', 'start_time', 'end_time').order_by('start_time')
        )

        # fetch opening hours for the date
        open_hours = Venue.objects.get(id=venue).get_opening_hours_date(date)
        c_time = datetime.combine(date, open_hours[0])
        end_time = datetime.combine(date, open_hours[1]) - timezone.timedelta(hours=1)

        # Transform each occupied table to stacks of their reservations
        occupied_table_times: dict[int, list[tuple[time, time]]] = defaultdict(list)
        for tr in reserved_tables:
            occupied_table_times[tr['table']].append((tr['start_time'], tr['end_time']))

        # Checks if list of occupied tables are shorter than available tables
        safe = len(occupied_table_times) < len(tables) or len(reserved_tables) == 0

        available_hours: list[str] = []
        if len(tables) > 0:
            while c_time <= end_time:
                available = False
                # If there are still occupied tables for time
                if not safe:
                    # Loop through tables and reservation
                    for key, table_times in occupied_table_times.items():
                        # If top of stack is over, remove it

                        if (c_time.time()) >= table_times[0][1]:  # If greater than end remove element
                            occupied_table_times[key].pop(0)
                            # if the reservations for a table is empty, drop checking for availability
                            if len(occupied_table_times[key]) == 0:
                                safe = True
                                break
                        # If time next occupancy is in future, drop and set available table,
                        # also tests for a buffer for an hour, to see if table is available for the next hour
                        if (c_time.time()) < table_times[0][0] and (c_time + timezone.timedelta(hours=1)).time() < table_times[0][0]:
                            # if there is no reservation at the moment, is available for booking
                            available = True
                            break
                # If available or safe, add available hour
                if safe or available:
                    available_hours.append(c_time.strftime('%H:%M'))

                # iterate to next half hour
                c_time = c_time + timezone.timedelta(minutes=30)
                c_time = c_time + (timezone.datetime.min - c_time) % timedelta(minutes=30)
        return available_hours

    class Meta:
        verbose_name = 'Reservation'
        verbose_name_plural = 'Reservations'

    def __str__(self) -> str:
        return f'{self.name}'


class FoodPreference(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')

    class Meta:
        verbose_name = 'FoodPreference'
        verbose_name_plural = 'FoodPreferences'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class FoodCategory(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    order = models.PositiveSmallIntegerField(blank=True, null=True, unique=True)

    class Meta:
        verbose_name = 'FoodCategory'
        verbose_name_plural = 'FoodCategories'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class MenuItem(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_nb = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    price = models.PositiveSmallIntegerField(blank=True, null=True)
    price_member = models.PositiveSmallIntegerField(blank=True, null=True)

    order = models.PositiveSmallIntegerField(blank=True, null=True, unique=True)

    food_preferences = models.ManyToManyField(FoodPreference, blank=True)
    food_category = models.ForeignKey(FoodCategory, blank=True, null=True, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'MenuItem'
        verbose_name_plural = 'MenuItems'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class Menu(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_nb = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    menu_items = models.ManyToManyField(MenuItem, blank=True)

    class Meta:
        verbose_name = 'Menu'
        verbose_name_plural = 'Menus'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class Saksdokument(CustomBaseModel):
    title_nb = models.CharField(max_length=80, blank=True, null=True, verbose_name='Tittel (Norsk)')
    title_en = models.CharField(max_length=80, blank=True, null=True, verbose_name='Tittel (Engelsk)')
    publication_date = models.DateTimeField(blank=True, null=True)

    category = models.CharField(max_length=25, choices=SaksdokumentCategory.choices, default=SaksdokumentCategory.FS_REFERAT)
    file = models.FileField(upload_to='uploads/saksdokument/', blank=True, null=True)

    class Meta:
        verbose_name = 'Saksdokument'
        verbose_name_plural = 'Saksdokumenter'

    def __str__(self) -> str:
        return f'{self.title_nb}'


class Booking(CustomBaseModel):
    name = models.CharField(max_length=64, blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    from_dt = models.DateTimeField(blank=True, null=True)
    to_dt = models.DateTimeField(blank=True, null=True)

    tables = models.ManyToManyField(Table, blank=True)

    user = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)
    first_name = models.CharField(max_length=64, unique=True, blank=True, null=True)
    last_name = models.CharField(max_length=64, unique=True, blank=True, null=True)
    email = models.CharField(max_length=64, unique=True, blank=True, null=True)
    phone_nr = models.CharField(max_length=64, unique=True, blank=True, null=True)

    class Meta:
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'

    def __str__(self) -> str:
        return f'Booking: {self.name} - {self.user} - {self.from_dt} ({self.table_count()})'

    def table_count(self) -> int:
        n: int = self.tables.count()
        return n

    def get_duration(self) -> timedelta | None:
        if self.to_dt and self.from_dt:
            duration: timedelta = self.to_dt - self.from_dt
            return duration
        return None

    def clean(self) -> None:
        errors: dict[str, ValidationError] = {}

        field_to_validate = 'to_dt'
        duration_constraint_hours = 2
        duration = self.get_duration()
        if duration and duration > timedelta(hours=duration_constraint_hours):
            error = f'Duration cannot be longer than {duration_constraint_hours} hours.'
            errors.setdefault(field_to_validate, []).append(error)

        if errors:
            raise ValidationError(errors)

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.full_clean()
        super().save(*args, **kwargs)


class Infobox(CustomBaseModel):
    title_nb = models.CharField(max_length=60, blank=False, null=False, verbose_name='Infoboks titel (norsk)')
    text_nb = models.CharField(max_length=255, blank=False, null=False, verbose_name='Infoboks tekst (norsk)')

    title_en = models.CharField(max_length=60, blank=False, null=False, verbose_name='Infoboks tekst (engelsk)')
    text_en = models.CharField(max_length=255, blank=False, null=False, verbose_name='Infoboks tekst (engelsk)')

    color = models.CharField(max_length=15, blank=False, null=False, verbose_name='Infoboks hexcolor eller css color-constant')
    url = models.URLField(verbose_name='Infoboks utgående link', blank=True, null=True)
    image = models.ForeignKey(Image, on_delete=models.PROTECT, blank=True, null=True, verbose_name='Infoboks bilde')

    class Meta:
        verbose_name = 'Infoboks'
        verbose_name_plural = 'Infobokser'

    @property
    def image_url(self) -> str:
        return self.image.image.url

    def __str__(self) -> str:
        return f'{self.title_nb}'


class TextItem(CustomBaseModel):
    key = models.CharField(max_length=40, blank=False, null=False, unique=True, primary_key=True)
    text_nb = models.TextField()
    text_en = models.TextField()

    class Meta:
        verbose_name = 'TextItem'
        verbose_name_plural = 'TextItems'

    def __str__(self) -> str:
        return f'{self.key}'


class KeyValue(FullCleanSaveMixin):
    """
    Model for environment variables in the database.
    Should not be used for secrets.
    Can be used to manage behaviour of the system on demand, such as feature toggling.
    Solution is inspired by variables from Github Actions.
    I.e. we do not want more fields on this model, CharField is sufficient, and is very flexible.

    You may populate the field value with whatever is needed.
    For boolean values, it's common to use e.g. `SOME_VAR=1` for `True`, or empty var for `False`.
    This model has helper methods to check for boolean values.

    All keys should be registered in 'samfundet.utils.key_values' for better overview and easy access backend.
    """

    key = models.CharField(max_length=60, blank=False, null=False, unique=True)
    value = models.CharField(max_length=60, default='', blank=True, null=False)

    # Keywords to annotate falsy values.
    EMPTY = ''
    FALSE = 'false'
    NO = 'no'
    ZERO = '0'
    FALSY = [FALSE, NO, ZERO, EMPTY]

    class Meta:
        verbose_name = 'KeyValue'
        verbose_name_plural = 'KeyValues'

    def __str__(self) -> str:
        return f'{self.key}={self.value}'

    def is_true(self) -> bool:
        """Check if value is truthy."""
        return not self.is_false()

    def is_false(self) -> bool:
        """Check if value is falsy."""
        return self.value.lower() in self.FALSY


# ----------------- #
#     Merch         #
# ----------------- #
class Merch(FullCleanSaveMixin):
    name_nb = models.CharField(max_length=60, blank=True, null=False, verbose_name='Navn (norsk)')
    description_nb = models.CharField(max_length=255, blank=True, null=False, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=60, blank=True, null=False, verbose_name='Navn (engelsk)')
    description_en = models.CharField(max_length=255, blank=True, null=False, verbose_name='Beskrivelse (engelsk)')

    base_price = models.PositiveSmallIntegerField(blank=True, null=False)
    released_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    image = models.ForeignKey(Image, on_delete=models.PROTECT, blank=True, null=True, verbose_name='Produkt Bilde')

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        verbose_name = 'Merch'
        verbose_name_plural = 'Merch'

    def in_stock(self) -> int:
        return sum(self.variations.values_list('stock', flat=True))

    @property
    def image_url(self) -> str:
        return self.image.image.url

    def __str__(self) -> str:
        return self.name_nb


class MerchVariation(FullCleanSaveMixin):
    specification = models.CharField(max_length=16, blank=False, null=False, verbose_name='Variation specification')

    merch = models.ForeignKey(Merch, blank=False, null=False, related_name='variations', on_delete=models.CASCADE, verbose_name='Merch')
    price = models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Price Variation')

    stock = models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='In stock')

    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    def __str__(self) -> str:
        return f'{self.merch.name_nb} ({self.specification})'


# ----------------- #
#     Feedback      #
# ----------------- #


class UserFeedbackModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField(blank=False, null=False)
    path = models.CharField(max_length=255, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    user_agent = models.TextField(blank=True)
    screen_resolution = models.CharField(max_length=13, blank=True)
    contact_email = models.EmailField(null=True)

    class Meta:
        verbose_name = 'UserFeedback'

    def __str__(self) -> str:
        return ellipsize(self.text, length=10)
