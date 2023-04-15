import django.db
import pytest
from django.utils import timezone
from samfundet.models.billig import BilligEvent, BilligTicketGroup, BilligPriceGroup
from samfundet.models.event import Event


def test_billig_link_with_event(fixture_event: Event, fixture_billig_event: BilligEvent):
    fixture_event.billig_id = fixture_billig_event.id
    fixture_event.save()
    assert fixture_event.billig == fixture_billig_event


def test_prefetch_billig(fixture_event_with_billig: Event):
    event, billig_event = fixture_event_with_billig
    Event.prefetch_billig([event])
    assert event._billig == billig_event
