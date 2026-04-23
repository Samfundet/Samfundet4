import type { EventDto } from '~/dto';
import type { EventCategoryValue } from '~/types';
import { utcTimestampToLocal } from '~/utils';
import type { FormType } from './hooks/useEventCreatorForm';

function computeDurationMinutes(startIso?: string, endIso?: string) {
  if (!startIso || !endIso) return 0;
  return Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
}

export function mapEventToFormValues(params: {
  event: Partial<EventDto>;
  defaultCategory: EventCategoryValue;
  defaultLocation: string;
  forTemplate?: boolean;
}): FormType {
  const { event, defaultCategory, defaultLocation, forTemplate = false } = params;

  const duration = computeDurationMinutes(event.start_dt, event.end_dt);

  return {
    title_nb: event.title_nb || '',
    title_en: event.title_en || '',
    description_long_nb: event.description_long_nb || '',
    description_long_en: event.description_long_en || '',
    description_short_nb: event.description_short_nb || '',
    description_short_en: event.description_short_en || '',

    start_dt: forTemplate ? '' : event.start_dt ? utcTimestampToLocal(event.start_dt, false) : '',
    duration: forTemplate ? undefined : duration || undefined,
    end_dt: forTemplate ? '' : event.end_dt ? utcTimestampToLocal(event.end_dt, false) : '',

    category: event.category || defaultCategory,
    host: event.host || '',
    location: event.location || defaultLocation,
    capacity: event.capacity || undefined,
    age_restriction: event.age_restriction || 'none',
    ticket_type: event.ticket_type || 'free',
    custom_tickets: event.custom_tickets || [],
    billig_id: event.billig?.id,
    image: event.image ?? undefined,

    visibility_from_dt: forTemplate
      ? ''
      : event.visibility_from_dt
        ? utcTimestampToLocal(event.visibility_from_dt, false)
        : '',
    visibility_to_dt: forTemplate
      ? ''
      : event.visibility_to_dt
        ? utcTimestampToLocal(event.visibility_to_dt, false)
        : '',
  };
}
