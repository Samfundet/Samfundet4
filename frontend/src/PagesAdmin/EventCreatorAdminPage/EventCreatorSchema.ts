import { z } from 'zod';
import {
  EVENT_AGE_RESTRICTION,
  EVENT_BILLIG_ID,
  EVENT_CAPACITY,
  EVENT_CATEGORY,
  EVENT_DESCRIPTION_LONG,
  EVENT_DESCRIPTION_SHORT,
  EVENT_DURATION,
  EVENT_END_DT,
  EVENT_HOST,
  EVENT_LOCATION,
  EVENT_REGISTRATION_URL,
  EVENT_START_DT,
  EVENT_TICKET_TYPE,
  EVENT_TITLE,
  EVENT_VISIBILITY_FROM_DT,
  EVENT_VISIBILITY_TO_DT,
} from '~/schema/event';
import { OPTIONAL_IMAGE } from '~/schema/samfImage';

const event_custom_ticket = z.object({
  id: z.number(),
  name_nb: z.string().min(1, 'Name (Norwegian) is required'),
  name_en: z.string().min(1, 'Name (English) is required'),
  price: z.number({ invalid_type_error: 'Price must be a number' }).min(0, 'Price must be at least 0'),
});

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
  end_dt: EVENT_END_DT,
  category: EVENT_CATEGORY,
  host: EVENT_HOST,
  location: EVENT_LOCATION,
  capacity: EVENT_CAPACITY,
  // Payment/registration
  age_restriction: EVENT_AGE_RESTRICTION,
  ticket_type: EVENT_TICKET_TYPE,
  custom_tickets: z.array(event_custom_ticket).optional(),
  registration_url: EVENT_REGISTRATION_URL,
  billig_id: EVENT_BILLIG_ID,
  // Graphics
  image: OPTIONAL_IMAGE,
  // Summary/Publication date
  visibility_from_dt: EVENT_VISIBILITY_FROM_DT,
  visibility_to_dt: EVENT_VISIBILITY_TO_DT,
});

export type EventFormType = z.infer<typeof eventSchema>;
