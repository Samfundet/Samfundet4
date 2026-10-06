import type { BilligEventDto } from '~/apis/billig/billigDtos';
import type { ImageDto } from '~/dto';
import type { PageNumberPaginationType } from '~/types';

export type EventId = string | number;

export interface Filters {
  search?: string;
  event_group?: string;
  ticket_type?: string;
  venue?: string;
  category?: string;
}

export const EventStatusChoice = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  ARCHIVED: 'archived',
  CANCELLED: 'cancelled',
  DELETED: 'deleted',
} as const;

export type EventStatus = (typeof EventStatusChoice)[keyof typeof EventStatusChoice];

export const EventAgeRestriction = {
  NONE: 'none',
  EIGHTEEN: 'eighteen',
  TWENTY: 'twenty',
  MIXED: 'mixed',
} as const;

export type EventAgeRestrictionValue = (typeof EventAgeRestriction)[keyof typeof EventAgeRestriction];

export const EventTicketType = {
  FREE: 'free',
  INCLUDED: 'included',
  BILLIG: 'billig',
  REGISTRATION: 'registration',
  CUSTOM: 'custom',
} as const;

export type EventTicketTypeValue = (typeof EventTicketType)[keyof typeof EventTicketType];

export const ALL_TICKET_TYPES: EventTicketTypeValue[] = [
  EventTicketType.FREE,
  EventTicketType.INCLUDED,
  EventTicketType.REGISTRATION,
  EventTicketType.BILLIG,
  EventTicketType.CUSTOM,
];

export const PAID_TICKET_TYPES: EventTicketTypeValue[] = [
  EventTicketType.REGISTRATION,
  EventTicketType.BILLIG,
  EventTicketType.CUSTOM,
];

export const EventCategory = {
  ART: 'art',
  COURSE: 'course',
  DJ: 'dj',
  EXCENTERAFTEN: 'excenteraften',
  FOOTBALL_MATCH: 'football_match',
  HAPPENING: 'happening',
  LUKA_EVENT: 'luka_event',
  MEETING: 'meeting',
  MOVIE: 'movie',
  MUSIC: 'music',
  PERFORMANCE: 'performance',
  SHOW: 'show',
  THEATER: 'theater',
  THEME_PARTY: 'theme_party',
  UKA_EVENT: 'uka_event',
  PARTY_MEETING: 'party_meeting',
  SAMFUNDET_MEETING: 'samfundet_meeting',
  CONCERT: 'concert',
  DEBATE: 'debate',
  QUIZ: 'quiz',
  LECTURE: 'lecture',
  OTHER: 'other',
} as const;

export type EventCategoryValue = (typeof EventCategory)[keyof typeof EventCategory];

export type EventCustomTicketDto = {
  id: number;
  name_nb: string;
  name_en: string;
  price: number;
};

export type EventDto = {
  id: number;
  status: EventStatus;
  event_group: EventGroupDto;

  title_nb: string;
  title_en: string;
  description_long_nb: string;
  description_long_en: string;
  description_short_nb: string;
  description_short_en: string;

  age_restriction: EventAgeRestrictionValue;
  location: string;
  category: EventCategoryValue;
  host: string;

  billig?: BilligEventDto;
  numberOfTickets?: number;
  registration_url?: string;

  start_dt: string;
  end_dt: string;
  visibility_from_dt: string;
  visibility_to_dt: string;
  doors_time?: string;
  duration: number;

  ticket_type: EventTicketTypeValue;
  custom_tickets: EventCustomTicketDto[];

  image?: ImageDto;

  capacity?: number;

  spotify_uri?: string;
  youtube_link?: string;
  youtube_embed?: string;
  facebook_link?: string;
  soundcloud_link?: string;
  instagram_link?: string;
  x_link?: string;
  lastfm_link?: string;
  vimeo_link?: string;
  general_link?: string;
};

export type EventWriteDto = {
  status?: EventStatus;

  title_nb: string;
  title_en: string;
  description_long_nb: string;
  description_long_en: string;
  description_short_nb: string;
  description_short_en: string;

  age_restriction: EventAgeRestrictionValue;
  location: string;
  category: EventCategoryValue;
  host: string;

  registration_url?: string;

  start_dt: string;
  end_dt: string;
  visibility_from_dt: string;
  visibility_to_dt: string;

  ticket_type: EventTicketTypeValue;
  custom_tickets?: EventCustomTicketDto[];

  image_id?: number;
  capacity?: number;
  billig_id?: number;
};

export type EventGroupDto = {
  id: number;
  name: string;
};

export interface EventsPaginationType<T> extends PageNumberPaginationType<T> {
  categories?: Array<[string, string]> | string[];
  locations?: string[];
  ticket_types?: Array<[string, string]> | string[];
}
