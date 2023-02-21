/**
 * These constants are set as className on body to style the theme.
 * Write styles in global.scss with these names.
 */
export const THEME = {
  DARK: 'theme-dark',
  LIGHT: 'theme-light',
} as const;

// Class added to body when mobile navigation is open
export const MOBILE_NAVIGATION_OPEN = 'mobile-navigation-open';

export type ThemeKey = keyof typeof THEME;
export type ThemeValue = typeof THEME[ThemeKey];

export const XCSRFTOKEN = 'X-CSRFToken';
export const THEME_KEY = 'theme';

/**
 * Screen sizes, breakpoint (bp).
 * These values are also in _constants.scss
 */
export const largeDesktopBpLower = 1201;
export const desktopBpUpper = 1200;
export const desktopBpLower = 993;
export const tabletBpUpper = 992;
export const tabletBpLower = 769;
export const mobileBpUpper = 768;
export const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
