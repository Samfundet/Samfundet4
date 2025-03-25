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

  // Applicant state colors (model_choices.py in RecruitmentApplicantStates)
  // these should communicate possible actions
  applicant_state_0: '#f5f0d5', // action needed here
  applicant_state_1: '#63b88f', // might call
  applicant_state_2: '#046404', // should call
  applicant_state_3: '#ebbc7c', // action needed here
  applicant_state_4: '#e3fc00', // dont call
  applicant_state_5: '#e53b2f', // dont call
  applicant_state_6: '#ebbc7c', // action needed here
  applicant_state_7: '#e53b2f', // dont call
  applicant_state_8: '#e53b2f', // dont call
  applicant_state_10: '#9f3dd3', // not wanted

  // Final application result colors
  rejected: '#dee73e',
  accepted: '#4f49eb',
  withdrawn: '#7f7f7f',
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

export const RecruitmentApplicantStates = {
  // Application state colors (model_choices.py in RecruitmentApplicantStates)
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

export const RecruitmentApplicantStatesDescriptions: {
  [key: number]: {
    short_nb: string;
    long_nb: string;
    short_en: string;
    long_en: string;
    guidance_nb: string;
    guidance_en: string;
  };
} = {
  0: {
    short_nb: 'Ubehandlet',
    short_en: 'Unprocessed',
    long_nb: 'Søker ikke behandlet.',
    long_en: 'Applicant not processed.',
    guidance_nb: 'Må behandles',
    guidance_en: 'Needs processing',
  },
  1: {
    short_nb: 'Søkers topprioritet, men satt reserve her.',
    short_en: "Applicant's top priority, but set as reserve here.",
    long_nb:
      'Søkeren er satt på reserve for dette vervet og det er dens topprioritet; Hvis enighet i opptaksforum kan søkeren få tilbud når offisiell ringerunde starter.',
    long_en:
      'The applicant is set as reserve for this position and it is their top priority; If there is agreement in the admission forum, the applicant can receive an offer when the official round of calling starts.',
    guidance_nb: 'Gitt klarsignal: kan kontakte, hvis ønskelig.',
    guidance_en: 'With goahed signal: can contact, if you want.',
  },
  2: {
    short_nb: 'Søkers topprioritet og ønsket her.',
    short_en: "Applicant's top priority and wanted here.",
    long_nb:
      'Søkeren er ønsket for vervet og det er dens topprioritet; Bør få tilbud når offisiell ringerunde starter.',
    long_en:
      'The applicant is wanted for the position and it is their top priority; Should receive an offer when the official round of calling starts.',
    guidance_nb: 'Gitt klarsignal: kan kontakte.',
    guidance_en: 'With goahed signal: can contact.',
  },
  3: {
    short_nb: 'Reserve på annet verv, ubehandlet her.',
    short_en: 'Reserve for another position, unprocessed here.',
    long_nb: 'Søkeren er satt som reserve på andre verv den prioriterer høyere. Søkeren er ubehandlet her.',
    long_en:
      'The applicant is set as reserve for other positions they prioritize higher. The applicant is unprocessed here.',
    guidance_nb: 'Må behandles',
    guidance_en: 'Needs processing',
  },
  4: {
    short_nb: 'Reserve på annet verv og på reserve her.',
    short_en: 'Reserve for another position and reserve here.',
    long_nb: 'Søkeren er satt reserve på andre verv den prioriterer høyere, men også reserve for dette vervet',
    long_en:
      'The applicant is set as reserve for other positions they prioritize higher, but also reserve for this position',
    guidance_nb: 'Ikke kontakt!',
    guidance_en: 'Do not contact!',
  },
  5: {
    short_nb: 'Reserve på annet verv, og ønsket her.',
    short_en: 'Reserve for another position, and wanted here.',
    long_nb: 'Søkeren er satt som reserve på andre verv den prioriterer høyere, men ønsket for dette vervet',
    long_en: 'The applicant is set as reserve for other positions they prioritize higher, but wanted for this position',
    guidance_nb: 'Ikke kontakt!',
    guidance_en: 'Do not contact!',
  },
  6: {
    short_nb: 'Ønsket for annet verv, og ubehandlet her.',
    short_en: 'Wanted for another position, and unprocessed here.',
    long_nb: 'Søkeren er ønsket for andre verv den prioriterer høyere og ubehandlet her.',
    long_en: 'The applicant is wanted for other positions they prioritize higher and unprocessed here.',
    guidance_nb: 'Må behandles',
    guidance_en: 'Needs processing',
  },
  7: {
    short_nb: 'Ønsket for annet verv, og på reserve her.',
    short_en: 'Wanted for another position, and reserve here.',
    long_nb: 'Søkeren er ønsket for andre verv den prioriterer høyere, og satt reserve her.',
    long_en: 'The applicant is wanted for other positions they prioritize higher, and set as reserve here.',
    guidance_nb: 'Ikke kontakt!',
    guidance_en: 'Do not contact!',
  },
  8: {
    short_nb: 'Ønsket for annet verv og ønsket her.',
    short_en: 'Wanted for another position and wanted here.',
    long_nb: 'Søkeren er ønsket for andre verv den prioriterer høyere, men også ønsket for dette vervet.',
    long_en: 'The applicant is wanted for other positions they prioritize higher, but also wanted for this position.',
    guidance_nb: 'Ikke kontakt!',
    guidance_en: 'Do not contact!',
  },
  10: {
    short_nb: 'Ikke ønsket',
    short_en: 'Not wanted',
    long_nb: 'Søkeren er ikke ønsket for dette vervet.',
    long_en: 'The applicant is not wanted for this position.',
    guidance_nb: 'Ikke kontakt!',
    guidance_en: 'Do not contact!',
  },
};

// Helper function to get state name
export const getRecruitmentApplicantStateName = (
  state: number,
): {
  short_nb: string;
  long_nb: string;
  comment_nb?: string;
  short_en: string;
  long_en: string;
  comment_en?: string;
} => {
  return RecruitmentApplicantStatesDescriptions[state] || 'Unknown state!!';
};

// Color mapping for applicant states
export const ApplicationStateColorMapping: { [key: number]: string } = {
  // Application state colors (model_choices.py in RecruitmentApplicantStates)
  [RecruitmentApplicantStates.NOT_SET]: COLORS.applicant_state_0,
  [RecruitmentApplicantStates.TOP_RESERVED]: COLORS.applicant_state_1,
  [RecruitmentApplicantStates.TOP_WANTED]: COLORS.applicant_state_2,
  [RecruitmentApplicantStates.LESS_RESERVE]: COLORS.applicant_state_3,
  [RecruitmentApplicantStates.LESS_RESERVE_RESERVED]: COLORS.applicant_state_4,
  [RecruitmentApplicantStates.LESS_RESERVE_WANTED]: COLORS.applicant_state_5,
  [RecruitmentApplicantStates.LESS_WANT]: COLORS.applicant_state_6,
  [RecruitmentApplicantStates.LESS_WANT_RESERVED]: COLORS.applicant_state_7,
  [RecruitmentApplicantStates.LESS_WANT_WANTED]: COLORS.applicant_state_8,
  [RecruitmentApplicantStates.NOT_WANTED]: COLORS.applicant_state_10,
};

// Helper function to get the color for a state
export const getApplicantStateColor = (state: number): string => {
  return ApplicationStateColorMapping[state] || COLORS.white;
};
