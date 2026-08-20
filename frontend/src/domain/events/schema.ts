import { z } from 'zod';
import { KEY } from '~/i18n/constants';
import { EventAgeRestriction, EventCategory, EventTicketType } from '~/types';
import { zodEnum } from '../utils';
import { OPTIONAL_IMAGE } from '../images';

const validUrl = z
  .string()
  .trim()
  .refine((val) => val === '' || /^https?:\/\//.test(val), { message: KEY.event_must_be_valid_url });

const validSpotifyUri = z
  .string()
  .trim()
  .refine((val) => val === '' || /^spotify:(track|artist|album|playlist):[a-zA-Z0-9]{22}$/.test(val), {
    message: KEY.event_must_be_valid_spotify_uri,
  });

// text and description
export const EVENT_TITLE = z.string().min(1, { message: KEY.event_form_title_required });
export const EVENT_DESCRIPTION_LONG = z.string().min(1, { message: KEY.event_form_description_long_required });
export const EVENT_DESCRIPTION_SHORT = z.string().min(1, { message: KEY.event_form_description_short_required });
// Date and information
export const EVENT_START_DT = z.string().min(1, { message: KEY.event_form_start_dt_required });
export const EVENT_DURATION = z.number().min(1, { message: KEY.event_form_duration_min }).optional();
export const EVENT_END_DT = z.string().optional();
export const EVENT_CATEGORY = zodEnum(EventCategory, KEY.event_form_category_required);
export const EVENT_HOST = z.string().min(1, { message: KEY.event_form_host_required });
export const EVENT_LOCATION = z.string().min(1, { message: KEY.event_form_location_required });
export const EVENT_CAPACITY = z.number().min(1, { message: KEY.event_form_capacity_min }).optional();
// Payment/registration
export const EVENT_AGE_RESTRICTION = zodEnum(EventAgeRestriction, KEY.event_form_age_restriction_required);
export const EVENT_TICKET_TYPE = zodEnum(EventTicketType, KEY.event_form_ticket_type_required);
export const EVENT_CUSTOM_TICKET = z.object({
  id: z.number(),
  name_nb: z.string().min(1),
  name_en: z.string().min(1),
  price: z.number().min(0),
});
export const EVENT_REGISTRATION_URL = z.string().url().optional();
export const EVENT_HOST_LINK = z.string().url().optional();
export const EVENT_BILLIG_ID = z.number().optional();
// Social media links
export const EVENT_SPOTIFY_URI = validSpotifyUri;
export const EVENT_YOUTUBE_LINK = validUrl;
export const EVENT_YOUTUBE_EMBED = validUrl;
export const EVENT_FACEBOOK_LINK = validUrl;
export const EVENT_SOUNDCLOUD_LINK = validUrl;
export const EVENT_INSTAGRAM_LINK = validUrl;
export const EVENT_X_LINK = validUrl;
export const EVENT_LASTFM_LINK = validUrl;
export const EVENT_VIMEO_LINK = validUrl;
export const EVENT_GENERAL_LINK = validUrl;
// Summary/Publication date
export const EVENT_VISIBILITY_FROM_DT = z.string().min(1, { message: KEY.event_publication_date_required });
export const EVENT_VISIBILITY_TO_DT = z.string().optional();
export const EVENT_PAID_OPTION = z.string().url().optional();

const event_custom_ticket = z.object({
  id: z.number(),
  name_nb: z.string().min(1),
  name_en: z.string().min(1),
  price: z.number().min(0),
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
  // Social media links
  spotify_uri: EVENT_SPOTIFY_URI.optional(),
  youtube_link: EVENT_YOUTUBE_LINK.optional(),
  youtube_embed: EVENT_YOUTUBE_EMBED.optional(),
  facebook_link: EVENT_FACEBOOK_LINK.optional(),
  soundcloud_link: EVENT_SOUNDCLOUD_LINK.optional(),
  instagram_link: EVENT_INSTAGRAM_LINK.optional(),
  x_link: EVENT_X_LINK.optional(),
  lastfm_link: EVENT_LASTFM_LINK.optional(),
  vimeo_link: EVENT_VIMEO_LINK.optional(),
  general_link: EVENT_GENERAL_LINK.optional(),
  // Graphics
  image: OPTIONAL_IMAGE,
  // Summary/Publication date
  visibility_from_dt: EVENT_VISIBILITY_FROM_DT,
  visibility_to_dt: EVENT_VISIBILITY_TO_DT,
});

export type EventFormType = z.infer<typeof eventSchema>;
