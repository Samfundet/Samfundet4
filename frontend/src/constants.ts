/**
 * These constants are set as className on body to style the theme.
 * Write styles in global.scss with these names.
 */
export const THEME = {
  DARK: 'theme-dark',
  LIGHT: 'theme-light',
} as const;

export type ThemeKey = keyof typeof THEME;
export type ThemeValue = typeof THEME[ThemeKey];

export const XCSRFTOKEN = 'X-CSRFToken';
export const THEME_KEY = 'theme';
