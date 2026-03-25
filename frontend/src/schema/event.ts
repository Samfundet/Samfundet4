import { z } from 'zod';
import { KEY } from '~/i18n/constants';
import { EventAgeRestriction, EventCategory, EventTicketType } from '~/types';
import { zodEnum } from './utils';

export const EVENT_TITLE = z.string().min(1, { message: KEY.event_form_title_required });
export const EVENT_DESCRIPTION_LONG = z.string().min(1, { message: KEY.event_form_description_long_required });
export const EVENT_DESCRIPTION_SHORT = z.string().min(1, { message: KEY.event_form_description_short_required });
export const EVENT_START_DT = z.string().min(1, { message: KEY.event_form_start_dt_required });
export const EVENT_DURATION = z.number().min(1, { message: KEY.event_form_duration_min }).optional();
export const EVENT_END_DT = z.string().optional();
export const EVENT_HOST = z.string().min(1, { message: KEY.event_form_host_required });
export const EVENT_LOCATION = z.string().min(1, { message: KEY.event_form_location_required });
export const EVENT_CAPACITY = z.number().min(1, { message: KEY.event_form_capacity_min }).optional();
export const EVENT_VISIBILITY_FROM_DT = z.string().min(1, { message: KEY.event_form_visibility_from_required });
export const EVENT_VISIBILITY_TO_DT = z.string().optional();
export const EVENT_PAID_OPTION = z.string().url().optional();
export const EVENT_BILLIG_ID = z.number().optional();

export const EVENT_REGISTRATION_URL = z.string().url().optional();
export const EVENT_HOST_LINK = z.string().url().optional();
export const EVENT_INSTAGRAM_LINK = z.string().url().optional();
export const EVENT_FACEBOOK_LINK = z.string().url().optional();
export const EVENT_X_LINK = z.string().url().optional();

export const EVENT_CATEGORY = zodEnum(EventCategory, KEY.event_form_category_required);
export const EVENT_AGE_RESTRICTION = zodEnum(EventAgeRestriction, KEY.event_form_age_restriction_required);
export const EVENT_TICKET_TYPE = zodEnum(EventTicketType, KEY.event_form_ticket_type_required);
