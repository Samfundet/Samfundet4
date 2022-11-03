import { Dispatch, ReactNode, SetStateAction } from 'react';
/** Module for global generic types. */

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/**Duplicate of colors and hex from _constants.scss */
export const COLORS = {
  red_samf: '#a03033',
  blue_lighter: '#e3f2ff',
  blue_light: '#c4dbf3',
  blue_medium: '#88b3e0',
  blue_deep: '#1a3b80',
  blue_deeper: '#062356',
  turquoise_light: '#e2f8f5',
  turquoise_medium: '#9fe9dc',
  turquoise: '#5accb9',
  turquoise_deep: '#288474',
  white: '#ffffff',
  black: '#000000',
  grey_5: '#f4f4f4',
  grey_4: '#eeeeee',
  grey_3: '#dddddd',
  grey_2: '#cccccc',
  grey_1: '#767676',
  grey_0: '#444444',
  green_lighter: '#f6ffed',
  green_light: '#b7eb8f',
  orange_ligher: '#fffbe6',
  orange_light: '#ffe99e',
  red_lighter: '#fff2f0',
  red_light: '#ffcfca',
};

export type Color = typeof COLORS;
export type ColorKey = keyof Color;
/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;
/** Type for event */
export type Event = {
  id: number;
  title_no: string;
  title_en: string;
  start_dt: Date;
  end_dt: Date;
  description_long_no: string;
  description_long_en: string;
  description_short_no: string;
  description_short_en: string;
  publish_dt: Date;
  host: string;
  location: string;
};

type dateStrOptions = {
  [key: number]: string;
};

export const monthNamesNo: dateStrOptions = {
  1: 'Januar',
  2: 'Februar',
  3: 'Mars',
  4: 'April',
  5: 'Mai',
  6: 'Juni',
  7: 'Juli',
  8: 'August',
  9: 'September',
  10: 'Oktober',
  11: 'November',
  12: 'Desember',
} as const;

export const monthNamesEn: dateStrOptions = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'Juni',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
} as const;

export const weekDayNamesNo: dateStrOptions = {
  1: 'Mandag',
  2: 'Tirsdag',
  3: 'Onsdag',
  4: 'Torsdag',
  5: 'Fredag',
  6: 'Lørdag',
  7: 'Søndag',
} as const;

export const weekDayNamesEn: dateStrOptions = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};
