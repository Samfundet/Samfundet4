from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from typing import Any
from collections import defaultdict
from datetime import datetime, date, time, timedelta

from root.utils.mixins import CustomBaseModel
from samfundet.models.model_choices import ReservationOccasion


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
    user = models.ForeignKey('samfundet.User', on_delete=models.CASCADE, blank=True, null=True)
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

    def fetch_available_times_for_date(venue: int, seating: int, date: date) -> list[str]:
        """
            Method for returning available reservation times for a venue
            Based on the amount of seating and the date
        """
        # Fetch tables that fits size criteria
        tables = Table.objects.filter(venue=venue, seating__gte=seating)
        # fetch all reservations for those tables for that date
        reserved_tables = Reservation.objects.filter(venue=venue, reservation_date=date, table__in=tables).values('table', 'start_time',
                                                                                                                  'end_time').order_by('start_time')

        # fetch opening hours for the date
        open_hours = Venue.objects.get(id=venue).get_opening_hours_date(date)
        c_time = datetime.combine(date, open_hours[0])
        end_time = datetime.combine(date, open_hours[1]) - timezone.timedelta(hours=1)

        # Transform each occupied table to stacks of their reservations
        occupied_table_times: dict[int, list[tuple[time, time]]] = defaultdict(list)
        for tr in reserved_tables:
            occupied_table_times[tr['table']].append((tr['start_time'], tr['end_time']))

        # Checks if list of occupied tables are shorter than available tables
        safe = (len(occupied_table_times) < len(tables) or len(reserved_tables) == 0)

        available_hours: list[str] = []
        if (len(tables) > 0):
            while (c_time <= end_time):
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
                c_time = (c_time + timezone.timedelta(minutes=30))
                c_time = c_time + (timezone.datetime.min - c_time) % timedelta(minutes=30)
        return available_hours

    class Meta:
        verbose_name = 'Reservation'
        verbose_name_plural = 'Reservations'

    def __str__(self) -> str:
        return f'{self.name}'


class Booking(CustomBaseModel):
    name = models.CharField(max_length=64, blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    from_dt = models.DateTimeField(blank=True, null=True)
    to_dt = models.DateTimeField(blank=True, null=True)

    tables = models.ManyToManyField(Table, blank=True)

    user = models.ForeignKey('samfundet.User', on_delete=models.PROTECT, blank=True, null=True)
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
