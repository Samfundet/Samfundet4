from __future__ import annotations

from typing import Any
from dataclasses import dataclass

from django.utils import timezone

from samfundet.serializers import EventSerializer
from samfundet.models.event import Event
from samfundet.models.model_choices import EventCategory, EventTicketType


class ElementType:
    CAROUSEL = 'carousel'
    LARGE_CARD = 'large-card'


@dataclass
class HomePageElement:
    variation: str
    title_nb: str
    title_en: str
    events: list[Event]
    description_nb: str | None = None
    description_en: str | None = None

    def to_dict(self) -> dict:
        return {
            'variation': self.variation,
            'title_nb': self.title_nb,
            'title_en': self.title_en,
            'events': EventSerializer(self.events, many=True).data,
            'description_nb': self.description_nb,
            'description_en': self.description_en,
        }


def large_card(event: Event) -> HomePageElement:
    return HomePageElement(
        variation=ElementType.LARGE_CARD,
        title_nb=event.title_nb,
        title_en=event.title_en,
        description_nb=event.description_short_nb,
        description_en=event.description_short_en,
        events=[event],
    )


def carousel(title_nb: str, title_en: str, events: list[Event]) -> HomePageElement:
    return HomePageElement(
        variation=ElementType.CAROUSEL,
        title_nb=title_nb,
        title_en=title_en,
        events=events,
    )


def generate() -> dict[str, Any]:
    elements: list[HomePageElement] = []
    upcoming_events = Event.objects.filter(start_dt__gt=timezone.now() - timezone.timedelta(hours=6)).order_by('start_dt')

    # Splash events
    # TODO we should make a datamodel for this
    try:
        splash_events = list(upcoming_events[0:min(3, len(upcoming_events))])
        splash = EventSerializer(splash_events, many=True).data
    except IndexError:
        splash = []
        pass

    # Upcoming events
    try:
        elements.append(carousel(
            title_nb='Hva skjer?',
            title_en="What's happening?",
            events=list(upcoming_events[:10]),
        ))
    except IndexError:
        pass

    # Another highlight
    # TODO we should make a datamodel for this
    try:
        splash_event2: Event = upcoming_events.last()
        if splash_event2:
            elements.append(large_card(splash_event2))
    except IndexError:
        pass

    # Concerts
    try:
        elements.append(carousel(
            title_nb='Konserter',
            title_en='Concerts',
            events=list(upcoming_events.filter(category=EventCategory.CONCERT)[:10]),
        ))
    except IndexError:
        pass

    # Another highlight
    # TODO we should make a datamodel for this
    try:
        splash_event3: Event = upcoming_events[2]
        if splash_event3:
            elements.append(large_card(splash_event3))
    except IndexError:
        pass

    # Debates
    try:
        elements.append(carousel(
            title_nb='Debatter',
            title_en='Debates',
            events=list(upcoming_events.filter(category=EventCategory.DEBATE)[:10]),
        ))
    except IndexError:
        pass

    # Courses
    try:
        elements.append(
            carousel(
                title_nb='Kurs og Forelesninger',
                title_en='Courses & Lectures',
                events=list(upcoming_events.filter(category=EventCategory.LECTURE)[:10]),
            )
        )
    except IndexError:
        pass

    # Free!
    try:
        elements.append(
            carousel(
                title_nb='Gratisarrangementer',
                title_en='Free events',
                events=list(upcoming_events.filter(ticket_type__in=[EventTicketType.FREE, EventTicketType.INCLUDED])[:10]),
            )
        )
    except IndexError:
        pass

    # Other
    try:
        elements.append(
            carousel(
                title_nb='Andre arrangementer',
                title_en='Other events',
                events=list(upcoming_events.filter(category=EventCategory.OTHER)[:10]),
            )
        )
    except IndexError:
        pass

    return {'splash': splash, 'elements': [el.to_dict() for el in elements]}
