import { z } from 'zod';
import {
  EVENT_AGE_RESTRICTION,
  EVENT_BILLIG_ID,
  EVENT_CAPACITY,
  EVENT_CATEGORY,
  EVENT_CUSTOM_TICKET,
  EVENT_DESCRIPTION_LONG,
  EVENT_DESCRIPTION_SHORT,
  EVENT_DURATION,
  EVENT_END_DT,
  EVENT_FACEBOOK_LINK,
  EVENT_GENERAL_LINK,
  EVENT_HOST,
  EVENT_INSTAGRAM_LINK,
  EVENT_LASTFM_LINK,
  EVENT_LOCATION,
  EVENT_REGISTRATION_URL,
  EVENT_SOUNDCLOUD_LINK,
  EVENT_SPOTIFY_URI,
  EVENT_START_DT,
  EVENT_TICKET_TYPE,
  EVENT_TITLE,
  EVENT_VIMEO_LINK,
  EVENT_VISIBILITY_FROM_DT,
  EVENT_VISIBILITY_TO_DT,
  EVENT_X_LINK,
  EVENT_YOUTUBE_EMBED,
  EVENT_YOUTUBE_LINK,
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
  custom_tickets: z.array(EVENT_CUSTOM_TICKET).optional(),
  registration_url: EVENT_REGISTRATION_URL,
  billig_id: EVENT_BILLIG_ID,
  // Social media links
  spotify_uri: EVENT_SPOTIFY_URI,
  youtube_link: EVENT_YOUTUBE_LINK,
  youtube_embed: EVENT_YOUTUBE_EMBED,
  facebook_link: EVENT_FACEBOOK_LINK,
  soundcloud_link: EVENT_SOUNDCLOUD_LINK,
  instagram_link: EVENT_INSTAGRAM_LINK,
  x_link: EVENT_X_LINK,
  lastfm_link: EVENT_LASTFM_LINK,
  vimeo_link: EVENT_VIMEO_LINK,
  general_link: EVENT_GENERAL_LINK,
  // Graphics
  image: OPTIONAL_IMAGE,
  // Summary/Publication date
  visibility_from_dt: EVENT_VISIBILITY_FROM_DT,
  visibility_to_dt: EVENT_VISIBILITY_TO_DT,
});

export type EventFormType = z.infer<typeof eventSchema>;
