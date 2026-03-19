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
  name_nb: z.string().min(1),
  name_en: z.string().min(1),
  price: z.number().min(0),
});

export const eventSchema = z
  .object({
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
  })
  .refine(
    (data) => {
      // If visibility_from_dt and start_dt are both provided, check that publication date is before event start
      if (data.visibility_from_dt && data.start_dt) {
        return new Date(data.visibility_from_dt) <= new Date(data.start_dt);
      }
      // If either is missing, allow it (will be caught by individual field validation)
      return true;
    },
    {
      message: 'Publication date must be before event start date!',
      path: ['visibility_from_dt'], // Show error on the publication date field
    },
  );

export type EventFormType = z.infer<typeof eventSchema>;
