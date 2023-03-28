import { EventDto, VenueDto } from '~/dto';

export function eventQuery(events: EventDto[], search: string, venue?: VenueDto): EventDto[] {
  search = search.toLowerCase();
  const venueName = (venue?.name ?? '').toLowerCase();
  return events.filter(
    (event: EventDto) =>
      (search.length == 0 ||
        event.title_nb.toLowerCase().includes(search) ||
        event.title_en.toLowerCase().includes(search) ||
        event.description_long_nb.toLowerCase().includes(search) ||
        event.description_long_en.toLowerCase().includes(search) ||
        event.description_short_nb.toLowerCase().includes(search) ||
        event.description_short_en.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search)) &&
      (venueName.length == 0 || event.location.toLowerCase().includes(venueName)),
  );
}
