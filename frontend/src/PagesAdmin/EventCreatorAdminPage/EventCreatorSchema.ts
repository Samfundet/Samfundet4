import { z } from 'zod';
import {
  EVENT_AGE_RESTRICTION,
  EVENT_CAPACITY,
  EVENT_CATEGORY,
  EVENT_DESCRIPTION_LONG,
  EVENT_DESCRIPTION_SHORT,
  EVENT_DURATION,
  EVENT_END_DT,
  EVENT_HOST,
  EVENT_LOCATION,
  EVENT_START_DT,
  EVENT_TICKET_TYPE,
  EVENT_TITLE,
  EVENT_VISIBILITY_FROM_DT,
  EVENT_VISIBILITY_TO_DT,
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
  end_dt: EVENT_END_DT,
  category: EVENT_CATEGORY,
  host: EVENT_HOST,
  location: EVENT_LOCATION,
  capacity: EVENT_CAPACITY,
  // Payment/registration
  age_restriction: EVENT_AGE_RESTRICTION,
  ticket_type: EVENT_TICKET_TYPE,
  // Graphics
  image: OPTIONAL_IMAGE,
  // Summary/Publication date
  visibility_from_dt: EVENT_VISIBILITY_FROM_DT,
  visibility_to_dt: EVENT_VISIBILITY_TO_DT,
});
