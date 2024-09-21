import type { EventDto, VenueDto } from '~/dto';
import { queryDtoCustom } from '~/utils';

// Converts event to a searchable string representation
function toRepresentation(event: EventDto): string {
  return `
    ${event.title_nb}
    ${event.title_en} 
    ${event.description_short_nb} 
    ${event.description_short_en} 
    ${event.description_long_nb} 
    ${event.description_long_en} 
    ${event.location} 
    ${event.host} 
  `;
}

export function eventQuery(events: EventDto[], search: string, venue?: VenueDto): EventDto[] {
  const searchMatch = queryDtoCustom(search, events, toRepresentation);
  // Filter by venue
  if (venue !== undefined) {
    return searchMatch.filter((event) => {
      return event.location.toLowerCase().includes(venue.name);
    });
  }
  return searchMatch;
}
