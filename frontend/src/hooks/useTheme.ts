import { useEffect, useState } from 'react';
import { putUserPreference } from '~/api';
import { THEME, THEME_KEY, type ThemeValue } from '~/constants';
import { useAuthContext } from '~/context/AuthContext';
import type { SetState } from '~/types';
import { updateBodyThemeClass } from '~/utils';

/** Return type for hook useTheme. */
type UseTheme = {
  theme: ThemeValue;
  setTheme: SetState<ThemeValue>;
  switchTheme: () => ThemeValue;
};

/**
 * Grouped functionality for theme.
 * Only meant to be used in GlobalContextProvider.
 */
export function useTheme(): UseTheme {
  const { user } = useAuthContext();

  // Get theme from localStorage.
  const storedTheme = (localStorage.getItem(THEME_KEY) as ThemeValue) || undefined;

  // Determine browser preference.
  const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const detectedTheme = prefersDarkTheme ? THEME.DARK : THEME.LIGHT;
  const initialTheme = storedTheme || detectedTheme;

  const [theme, setTheme] = useState<ThemeValue>(initialTheme);

  // Update body classes when theme changes.
  useEffect(() => {
    updateBodyThemeClass(theme);
  }, [theme]);

  // Update theme when user changes.
  useEffect(() => {
    if (user?.user_preference.theme) {
      setTheme(user.user_preference.theme);
    }
  }, [user]);

  /** Simplified theme switching. Returns theme it switched to. */
  function switchTheme(): ThemeValue {
    const isLightTheme = theme === THEME.LIGHT;
    const themeToSet = isLightTheme ? THEME.DARK : THEME.LIGHT;
    setTheme(themeToSet);
    if (user) {
      putUserPreference(user.user_preference.id, { theme: themeToSet });
    }
    return themeToSet;
  }

  return { theme, setTheme, switchTheme };
}
