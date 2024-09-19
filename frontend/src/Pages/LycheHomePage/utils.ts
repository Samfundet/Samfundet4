import type { VenueDto } from '~/dto';

export function getIsConsistentWeekdayOpeningHours(venue?: VenueDto): boolean {
  return (
    venue?.opening_monday === venue?.opening_tuesday &&
    venue?.opening_wednesday === venue?.opening_thursday &&
    venue?.opening_monday === venue?.opening_thursday &&
    venue?.closing_monday === venue?.closing_tuesday &&
    venue?.closing_wednesday === venue?.closing_thursday &&
    venue?.closing_monday === venue?.closing_thursday
  );
}

export function getIsConsistentWeekendHours(venue?: VenueDto): boolean {
  return (
    venue?.opening_friday === venue?.opening_saturday &&
    venue?.opening_saturday === venue?.opening_sunday &&
    venue?.closing_friday === venue?.closing_saturday &&
    venue?.closing_saturday === venue?.closing_sunday
  );
}
