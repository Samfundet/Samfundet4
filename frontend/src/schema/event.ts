import { z } from 'zod';
import { KEY } from '~/i18n/constants';
import { EventAgeRestriction, EventCategory, EventTicketType } from '~/types';
import { zodEnum } from './utils';

const optionalUrl = z
  .string()
  .trim()
  .refine((val) => val === '' || /^https?:\/\//.test(val), { message: 'Må være en gyldig URL' })
  .optional();

const validSpotifyUri = z
  .string()
  .trim()
  .refine((val) => val === '' || /^spotify:(track|artist|album|playlist):[a-zA-Z0-9]{22}$/.test(val), {
    message: 'Må være gyldig Spotify URI',
  })
  .optional();

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
export const EVENT_YOUTUBE_LINK = optionalUrl;
export const EVENT_YOUTUBE_EMBED = optionalUrl;
export const EVENT_FACEBOOK_LINK = optionalUrl;
export const EVENT_SOUNDCLOUD_LINK = optionalUrl;
export const EVENT_INSTAGRAM_LINK = optionalUrl;
export const EVENT_X_LINK = optionalUrl;
export const EVENT_LASTFM_LINK = optionalUrl;
export const EVENT_VIMEO_LINK = optionalUrl;
export const EVENT_GENERAL_LINK = optionalUrl;
// Summary/Publication date
export const EVENT_VISIBILITY_FROM_DT = z.string().min(1, { message: 'Synlig fra dato er påkrevd' });
export const EVENT_VISIBILITY_TO_DT = z.string().optional();
export const EVENT_PAID_OPTION = z.string().url().optional();
