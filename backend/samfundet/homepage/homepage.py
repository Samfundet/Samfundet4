from __future__ import annotations

from abc import ABC, abstractmethod
from enum import StrEnum
from typing import Any
from dataclasses import field, dataclass

from django.utils import timezone

from samfundet.serializers import EventSerializer, InfoboxSerializer
from samfundet.models.event import Event
from samfundet.models.general import Infobox
from samfundet.models.model_choices import EventStatus, EventCategory


class ElementType(StrEnum):
    CAROUSEL = 'carousel'
    LARGE_CARD = 'large-card'
    INFOBOX = 'infobox'


@dataclass(frozen=True)
class HomePageElement(ABC):
    variation: ElementType
    title_nb: str
    title_en: str
    description_nb: str | None = None
    description_en: str | None = None

    def common_dict(self) -> dict:
        return {
            'variation': self.variation,
            'title_nb': self.title_nb,
            'title_en': self.title_en,
            'description_nb': self.description_nb,
            'description_en': self.description_en,
        }

    @abstractmethod
    def to_dict(self) -> dict: ...


@dataclass(frozen=True, kw_only=True)
class EventElement(HomePageElement):
    """Base for elements backed by a list of events."""

    events: list[Event] = field(default_factory=list, compare=False)

    def to_dict(self) -> dict:
        return {
            **self.common_dict(),
            'events': EventSerializer(list(self.events), many=True).data,
        }


@dataclass(frozen=True, kw_only=True)
class Carousel(EventElement):
    variation: ElementType = ElementType.CAROUSEL


@dataclass(frozen=True, kw_only=True)
class LargeCard(EventElement):
    variation: ElementType = ElementType.LARGE_CARD


@dataclass(frozen=True, kw_only=True)
class InfoboxRow(HomePageElement):
    variation: ElementType = ElementType.INFOBOX
    infoboxes: list[Infobox] = field(default_factory=list)

    @classmethod
    def from_db(cls, *, title_nb: str, title_en: str) -> InfoboxRow | None:
        boxes = list(Infobox.objects.select_related('image').all())  # Join on Image
        if not boxes:
            return None
        return cls(title_nb=title_nb, title_en=title_en, infoboxes=boxes)

    def to_dict(self) -> dict:
        return {
            **self.common_dict(),
            'infoboxes': InfoboxSerializer(self.infoboxes, many=True).data,
        }


def generate() -> dict[str, Any]:
    elements: list[HomePageElement] = []

    # TODO: apply custom weighting
    upcoming_events = Event.objects.filter(start_dt__gt=timezone.now() - timezone.timedelta(hours=6), status=EventStatus.PUBLIC).order_by('start_dt')

    # Optimize DB queries by:
    # - select_related (FK and OTO) to perform an SQL JOIN, fetching related 'image' data in the same query.
    # - prefetch_related (MTM and reverse FK) to fetch related objects in separate queries and join in Python.
    # Reduces the number of DB queries.
    prefetch = ['custom_tickets', 'editors']
    select = ['image']
    upcoming_events = upcoming_events.select_related(*select).prefetch_related(*prefetch)

    # Splash events
    # TODO we should make a datamodel for this
    splash = EventSerializer(list(upcoming_events[:3]), many=True).data

    # Another highlight
    # TODO we should make a datamodel for this
    if splash_event2 := upcoming_events.last():
        elements.append(
            LargeCard(
                title_nb=splash_event2.title_nb,
                title_en=splash_event2.title_en,
                description_nb=splash_event2.description_short_nb,
                description_en=splash_event2.description_short_en,
                events=[splash_event2],
            )
        )

    # Infoboxes
    if (infobox := InfoboxRow.from_db(title_nb='Informasjon', title_en='Information')) is not None:
        elements.append(infobox)

    # debates / upcoming carousels:
    if events := list(upcoming_events[:9]):
        elements.append(Carousel(title_nb='Kommende arrangementer', title_en='Upcoming events', events=events))

    if events := list(upcoming_events.filter(category=EventCategory.DEBATE)[:10]):
        elements.append(Carousel(title_nb='Debatter', title_en='Debates', events=events))

    return {'splash': splash, 'elements': [el.to_dict() for el in elements]}
