import { EventDto } from '~/dto';

export function eventQuery(events: EventDto[], search: string, venue: string, event_type: string): EventDto[] {
  search = search.toLowerCase();
  venue = venue.toLowerCase();
  return events.filter(
    (event) =>
      (search.length == 0 ||
        event.title_no.toLowerCase().includes(search) ||
        event.title_en.toLowerCase().includes(search) ||
        event.description_long_no.toLowerCase().includes(search) ||
        event.description_long_en.toLowerCase().includes(search) ||
        event.description_short_no.toLowerCase().includes(search) ||
        event.description_short_en.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search) ||
        event.event_group.name.toLowerCase().includes(search)) &&
      (venue.length == 0 || event.location.toLowerCase().includes(venue)) &&
      (event_type.length == 0 || event.event_group.id == Number(event_type)),
  );
}
