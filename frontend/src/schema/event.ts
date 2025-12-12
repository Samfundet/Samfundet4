import { z } from 'zod';
import { EventAgeRestriction, EventCategory, EventTicketType } from '~/types';

export const EVENT_TITLE = z.string().min(1, { message: 'Tittel er påkrevd' });
export const EVENT_DESCRIPTION_LONG = z.string().min(1, { message: 'Lang beskrivelse er påkrevd' });
export const EVENT_DESCRIPTION_SHORT = z.string().min(1, { message: 'Kort beskrivelse er påkrevd' });
export const EVENT_START_DT = z.string().min(1, { message: 'Dato og tid er påkrevd' });
export const EVENT_DURATION = z.number().min(1, { message: 'Varighet må være større enn 0' });
export const EVENT_END_DT = z.string().optional();
export const EVENT_HOST = z.string().min(1, { message: 'Arrangør er påkrevd' });
export const EVENT_LOCATION = z.string().min(1, { message: 'Lokale er påkrevd' });
export const EVENT_CAPACITY = z.number().min(1, { message: 'Kapasitet må være større enn 0' });
export const EVENT_VISIBILITY_FROM_DT = z.string().min(1, { message: 'Synlig fra dato er påkrevd' });
export const EVENT_VISIBILITY_TO_DT = z.string().optional();
export const EVENT_PAID_OPTION = z.string().url().optional();

export const EVENT_REGISTRATION_URL = z.string().url().optional();
export const EVENT_HOST_LINK = z.string().url().optional();
export const EVENT_INSTAGRAM_LINK = z.string().url().optional();
export const EVENT_FACEBOOK_LINK = z.string().url().optional();
export const EVENT_X_LINK = z.string().url().optional();

export const EVENT_CATEGORY = z.nativeEnum(EventCategory);
export const EVENT_AGE_RESTRICTION = z.nativeEnum(EventAgeRestriction);
export const EVENT_TICKET_TYPE = z.nativeEnum(EventTicketType);

