import { Dispatch, ReactNode, SetStateAction } from 'react';
import { KV } from '~/constants';
import { themeToStyleMap } from '~/Components/Button/utils';
/** Module for global generic types. */

/** Type for home page element. */
export type HomePageElementVariation = 'carousel' | 'large-card';

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Map of KeyValues from backend. */
export type KeyValueMap = Map<string, string>;

/** Type for the constant of KeyValue keys in the database. */
export type Key = (typeof KV)[keyof typeof KV];

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/**Duplicate of colors and hex from _constants.scss */
export const COLORS = {
  red_samf: '#a03033',
  red_samf_hover: '#732225',
  red_samf_faded: '#fac7c8',
  blue: '#337ab7',
  blue_lighter: '#e3f2ff',
  blue_light: '#c4dbf3',
  blue_medium: '#88b3e0',
  blue_deep: '#1a3b80',
  blue_deeper: '#062356',
  blue_uka: '#150b59',
  blue_isfit: '#0099cc',
  turquoise_light: '#e2f8f5',
  turquoise_medium: '#9fe9dc',
  turquoise: '#5accb9',
  turquoise_deep: '#288474',
  white: '#ffffff',
  black: '#000000',
  black_1: '#161616',
  grey_5: '#f4f4f4',
  grey_4: '#eeeeee',
  grey_35: '#cccccc',
  grey_3: '#999999',
  grey_2: '#777777',
  grey_1: '#555555',
  grey_0: '#444444',
  green: '#4ab74c',
  green_lighter: '#f6ffed',
  green_light: '#b7eb8f',
  orange_ligher: '#fffbe6',
  orange_light: '#ffe99e',
  bisque_uka: '#ffe4c4',
  red_lighter: '#fff2f0',
  red_light: '#ffcfca',
  red: '#dc1010',
  salmon: '#fa8072',
  salmon_light: '#fab4ac',
  sulten_orange: '#fbb042',

  // Transparent colors
  black_t75: 'rgba(0, 0, 0, 0.75)',
  black_t50: 'rgba(0, 0, 0, 0.5)',
  black_t25: 'rgba(0, 0, 0, 0.25)',
  black_t10: 'rgba(0, 0, 0, 0.1)',
  transparent: 'rgba(0, 0, 0, 0)',

  // Theme colors:
  theme_light_bg: '#f5f5f5',

  theme_dark_bg: '#202023',
  theme_dark_color: '#dddddd',
  theme_dark_input_bg: '#242323',
  theme_dark_input_bg_disabled: '#7b7b7b',

  form_bg_dark: '#161619',
  form_border_dark: '#1c1919',

  // Defaults
  background_primary: '#ffffff',
  background_secondary: '#efefef',
} as const;

export type Color = typeof COLORS;
export type ColorKey = keyof Color;
export type ColorValue = (typeof COLORS)[ColorKey];

/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;

/** Days */
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export const ALL_DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export const WEEK_DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

/** Event types */
export type EventStatus = 'active' | 'cancelled' | 'archived' | 'deleted';

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
  EventTicketType.BILLIG,
  EventTicketType.REGISTRATION,
  EventTicketType.CUSTOM,
];
export const PAID_TICKET_TYPES: EventTicketTypeValue[] = [
  EventTicketType.BILLIG,
  EventTicketType.REGISTRATION,
  EventTicketType.CUSTOM,
];

export type CalendarMarker = {
  date: Date;
  className?: string;
};

export const OrganizationType = {
  SAMFUNDET: 'samfundet',
  UKA: 'uka',
  ISFIT: 'isfit',
} as const;

export type OrganizationTypeValue = (typeof OrganizationType)[keyof typeof OrganizationType];

export const OrgNameType = {
  SAMFUNDET_NAME: 'Samfundet',
  ISFIT_NAME: 'ISFiT',
  UKA_NAME: 'UKA',
  FALLBACK: 'fallback',
} as const;

export type OrgNameTypeValue = (typeof OrgNameType)[keyof typeof OrgNameType];

export type OrganizationTheme = {
  organizationName: OrgNameTypeValue;
  pagePrimaryColor: string;
  pageSecondaryColor: string;
  pageTertiaryColor?: string;
  buttonTheme: keyof typeof themeToStyleMap;
};
