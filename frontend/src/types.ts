import { Dispatch, ReactNode, SetStateAction } from 'react';
/** Module for global generic types. */

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/**Duplicate of colors and hex from _constants.scss */
export const COLORS = {
  SAMFUNDET_RED: '#a03033',
  SAMFUNDET_BLUE: '#337ab7',
  SAMFUNDET_GREEN: '#27ae60',
  SAMFUNDET_PURPLE: '#512d44',
  SAMFUNDET_ORANGE: '#e87511',
  SAMFUNDET_YELLOW: '#ced649',
  BLUE_MEDIUM: '#88b3e0',
  BLUE_DEEP: '#1a3b80',
  BLUE_DEEPER: '#062356',
  WHITE: '#ffffff',
  BLACK: '#111111',
  GREY_VERY_LIGHT: '#f4f4f4',
  GREY_LIGHT: '#eeeeee',
  GREY_MEDIUM: '#dddddd',
  GREY_DARK: '#cccccc',
  GREY_VERY_DARK: '#767676',
  GREY_DARKEST: '#444444',
};

export type Color = typeof COLORS;
export type ColorValue = ColorKey[keyof ColorKey];
export type ColorKey = keyof Color;
/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;
