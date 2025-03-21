import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { themeToStyleMap } from '~/Components/Button/utils';
import type { KV } from '~/constants';
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
  black_2: '#222222',
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

  // Application state colors (model_choices.py RecruitmentApplicantStates)

  not_set: '#ffffff',

  rejected: '#f9cccd',
  accepted: '#ccf9cd',
  withdrawn: '#bbbbbb',

  pending: '#fff5bc',
  top_wanted: '#32ff32',
  top_reserve: '#afffaf',
  less_reserve: '#ffb343',
  less_reserve_wanted: '#e3fc00',
  less_reserve_reserved: '#fc3f00',
  less_want: '#f74343',
  less_want_reserved: '#f74343',
  less_want_wanted: '#f74343',
  not_wanted: '#dc1010',
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

export const EventCategory = {
  SAMFUNDET_MEETING: 'samfundsmote',
  CONCERT: 'concert',
  DEBATE: 'debate',
  QUIZ: 'quiz',
  LECTURE: 'lecture',
  OTHER: 'other',
} as const;

export type EventCategoryValue = (typeof EventCategory)[keyof typeof EventCategory];

export type CalendarMarker = {
  date: Date;
  className?: string;
};

/*Names must be equal to what is found in the database*/
export const OrgNameType = {
  SAMFUNDET_NAME: 'Samfundet',
  ISFIT_NAME: 'ISFiT',
  UKA_NAME: 'UKA',
  FALLBACK: 'External organization',
} as const;

export type OrgNameTypeValue = (typeof OrgNameType)[keyof typeof OrgNameType];

export type OrganizationTheme = {
  organizationName: OrgNameTypeValue;
  pagePrimaryColor: string;
  pageSecondaryColor: string;
  pageTertiaryColor?: string;
  buttonTheme: keyof typeof themeToStyleMap;
};

// Recruitment mappings

// Recruitment Status Choices Enum
export const RecruitmentStatusChoices = {
  NOT_SET: 'Not Set',
  CALLED_AND_ACCEPTED: 'Called and Accepted',
  CALLED_AND_REJECTED: 'Called and Rejected',
  REJECTION: 'Rejection',
  AUTOMATIC_REJECTION: 'Automatic Rejection',
} as const;

// Recruitment Status Choices Mapping
export const RecruitmentStatusChoicesMapping: { [key: number]: string } = {
  0: RecruitmentStatusChoices.NOT_SET,
  1: RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
  2: RecruitmentStatusChoices.CALLED_AND_REJECTED,
  3: RecruitmentStatusChoices.REJECTION,
  4: RecruitmentStatusChoices.AUTOMATIC_REJECTION,
} as const;

// Recruitment Priority Choices Enum
export const RecruitmentPriorityChoices = {
  NOT_SET: 'Not Set',
  RESERVE: 'Reserve',
  WANTED: 'Wanted',
  NOT_WANTED: 'Not Wanted',
} as const;

// Recruitment Priority Choices Mapping
export const RecruitmentPriorityChoicesMapping: { [key: number]: string } = {
  0: RecruitmentPriorityChoices.NOT_SET,
  1: RecruitmentPriorityChoices.RESERVE,
  2: RecruitmentPriorityChoices.WANTED,
  3: RecruitmentPriorityChoices.NOT_WANTED,
};

export const RecruitmentApplicantStates = {
  // see model_choices.py (RecruitmentApplicantStates)
  NOT_SET: 0,
  TOP_RESERVED: 1,
  TOP_WANTED: 2,
  LESS_RESERVE: 3,
  LESS_RESERVE_RESERVED: 4,
  LESS_RESERVE_WANTED: 5,
  LESS_WANT: 6,
  LESS_WANT_RESERVED: 7,
  LESS_WANT_WANTED: 8,
  NOT_WANTED: 10,
} as const;

// Name mapping for display purposes
export const RecruitmentApplicantStatesNames: { [key: number]: string } = {
  // see model_choices.py (RecruitmentApplicantStates)
  0: 'Unprocessed',
  1: 'Top Reserve',
  2: 'Top Wanted',
  3: 'Lower Position (Other on Reserve)',
  4: 'Lower Position (Other on Reserve, You Reserved)',
  5: 'Lower Position (Other on Reserve, You Wanted)',
  6: 'Lower Position (Other on Wanted)',
  7: 'Lower Position (Other on Wanted, You Reserved)',
  8: 'Lower Position (Other on Wanted, You Wanted)',
  10: 'Not Wanted',
};

// Color mapping for applicant states
export const ApplicationStateColorMapping: { [key: number]: string } = {
  // see model_choices.py (RecruitmentApplicantStates)
  [RecruitmentApplicantStates.NOT_SET]: COLORS.not_set,
  [RecruitmentApplicantStates.TOP_RESERVED]: COLORS.top_reserve,
  [RecruitmentApplicantStates.TOP_WANTED]: COLORS.top_wanted,
  [RecruitmentApplicantStates.LESS_RESERVE]: COLORS.less_reserve,
  [RecruitmentApplicantStates.LESS_RESERVE_RESERVED]: COLORS.less_reserve_reserved,
  [RecruitmentApplicantStates.LESS_RESERVE_WANTED]: COLORS.less_reserve_wanted,
  [RecruitmentApplicantStates.LESS_WANT]: COLORS.less_want,
  [RecruitmentApplicantStates.LESS_WANT_RESERVED]: COLORS.less_want_reserved,
  [RecruitmentApplicantStates.LESS_WANT_WANTED]: COLORS.less_want_wanted,
  [RecruitmentApplicantStates.NOT_WANTED]: COLORS.not_wanted,
};

// Helper function to get the color for a state
export const getApplicantStateColor = (state: number): string => {
  return ApplicationStateColorMapping[state] || COLORS.not_set;
};

// Helper function to get state name
export const getApplicantStateName = (state: number): string => {
  return RecruitmentApplicantStatesNames[state] || 'Unknown State';
};

/* For DRF pagination, see pagination.py */
export interface PageNumberPaginationType<T> {
  page_size: number;
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  total_pages: number;
  results: T[];
}

/* For DRF pagination, see pagination.py */
export interface CursorPaginatedResponse<T> {
  next: string | null; // URL or cursor for next page
  previous: string | null; // URL or cursor for previous page
  results: T[]; // Current page results
}
