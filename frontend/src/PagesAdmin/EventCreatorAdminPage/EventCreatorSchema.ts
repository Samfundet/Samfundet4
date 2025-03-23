import { z } from 'zod';
import {
  EVENT_CATEGORY,
  EVENT_DESCRIPTION_LONG,
  EVENT_DESCRIPTION_SHORT,
  EVENT_DURATION,
  EVENT_START_DT,
  EVENT_TITLE,
} from '~/schema/event';
import { OPTIONAL_IMAGE } from '~/schema/samfImage';

export const eventSchema = z.object({
  // text and description
  title_nb: EVENT_TITLE,
  title_en: EVENT_TITLE,
  description_long_nb: EVENT_DESCRIPTION_LONG,
  description_long_en: EVENT_DESCRIPTION_LONG,
  description_short_nb: EVENT_DESCRIPTION_SHORT,
  description_short_en: EVENT_DESCRIPTION_SHORT,
  // Date and information
  start_dt: EVENT_START_DT,
  duration: EVENT_DURATION,
  category: EVENT_CATEGORY,
  host: z.string().min(1, { message: 'Arrangør er påkrevd' }),
  location: z.string().min(1, { message: 'Lokale er påkrevd' }),
  capacity: z.number().min(1, { message: 'Kapasitet må være større enn 0' }),
  // Payment/registration
  age_restriction: z.enum(['none', 'eighteen', 'twenty', 'mixed']),
  ticket_type: z.enum(['free', 'included', 'billig', 'registration', 'prepaid', 'custom']),
  billig_event: z.string().min(1, { message: 'Billig event er ikke påkrevd' }),
  // Graphics
  image: OPTIONAL_IMAGE,
  // Summary/Publication date
  publish_dt: z.string().min(1, { message: 'Publikasjonsdato er påkrevd' }),
});
