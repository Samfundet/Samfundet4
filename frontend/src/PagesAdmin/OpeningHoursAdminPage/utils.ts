import type { VenueDto } from '~/dto';
import { ALL_DAYS, type Day } from '~/types';
import type { VenueDaySchedule, VenueOpeningHoursPatch, VenueOpeningHoursUpdate } from './types';

export function getVenueDaySchedule(venue: VenueDto, weekday: Day): VenueDaySchedule {
  return {
    is_open: venue[`is_open_${weekday}`],
    opening: venue[`opening_${weekday}`] ?? '',
    closing: venue[`closing_${weekday}`] ?? '',
  };
}

export function updateVenueDaySchedule(venue: VenueDto, weekday: Day, schedule: VenueDaySchedule): VenueDto {
  return {
    ...venue,
    [`is_open_${weekday}`]: schedule.is_open,
    [`opening_${weekday}`]: schedule.opening,
    [`closing_${weekday}`]: schedule.closing,
  };
}

export function normalizeVenueDaySchedule(schedule: VenueDaySchedule): VenueDaySchedule {
  return {
    ...schedule,
    opening: normalizeTime(schedule.opening),
    closing: normalizeTime(schedule.closing),
  };
}

export function getVenueOpeningHoursUpdates(venues: VenueDto[], draftVenues: VenueDto[]): VenueOpeningHoursUpdate[] {
  const draftVenuesBySlug = new Map(draftVenues.map((venue) => [venue.slug, venue]));

  return venues.flatMap((venue) => {
    const draftVenue = draftVenuesBySlug.get(venue.slug);
    if (!draftVenue) return [];

    const changes: VenueOpeningHoursPatch = {};

    for (const weekday of ALL_DAYS) {
      const schedule = normalizeVenueDaySchedule(getVenueDaySchedule(venue, weekday));
      const draftSchedule = normalizeVenueDaySchedule(getVenueDaySchedule(draftVenue, weekday));

      if (schedule.is_open !== draftSchedule.is_open) {
        changes[`is_open_${weekday}`] = draftSchedule.is_open;
      }
      if (schedule.opening !== draftSchedule.opening) {
        changes[`opening_${weekday}`] = draftSchedule.opening;
      }
      if (schedule.closing !== draftSchedule.closing) {
        changes[`closing_${weekday}`] = draftSchedule.closing;
      }
    }

    return Object.keys(changes).length > 0 ? [{ slug: venue.slug, changes }] : [];
  });
}

function normalizeTime(value: string): string {
  const [hour = '', minute = ''] = value.split(':');
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}
