import type { VenueDto } from '~/dto';
import type { Day } from '~/types';
import type { VenueDaySchedule } from './dto';

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

function normalizeTime(value: string): string {
  const [hour = '', minute = ''] = value.split(':');
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}
