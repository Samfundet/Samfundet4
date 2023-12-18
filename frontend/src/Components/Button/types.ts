import { displayToStyleMap, themeToStyleMap } from './utils';

export type ButtonTheme = keyof typeof themeToStyleMap;

export type ButtonDisplay = keyof typeof displayToStyleMap;
