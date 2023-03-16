import { Dispatch, ReactNode, SetStateAction } from 'react';
/** Module for global generic types. */

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/**Duplicate of colors and hex from _constants.scss */
export const COLORS = {
  red_samf: '#a03033',
  compl_samf: '#2e802b',
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
} as const;

export type Color = typeof COLORS;
export type ColorKey = keyof Color;
export type ColorValue = typeof COLORS[ColorKey];

/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;
