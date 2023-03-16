import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCsrfToken } from '~/api';
import { useAuthContext } from '~/AuthContext';
import { THEME, ThemeValue, THEME_KEY, XCSRFTOKEN, MOBILE_NAVIGATION_OPEN } from '~/constants';
import { Children, SetState } from '~/types';

/**
 * Define which values the global context can contain.
 */
type GlobalContextProps = {
  theme: ThemeValue;
  setTheme: SetState<ThemeValue>;
  switchTheme: () => ThemeValue;
  mobileNavigation: boolean;
  setMobileNavigation: SetState<boolean>;
};

/**
 * Create context instance.
 */
export const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

// ====================================================================================================================

/**
 * Hook to retrieve values from GlobalContext.
 */
export function useGlobalContext() {
  const globalContext = useContext(GlobalContext);

  if (globalContext === undefined) {
    throw new Error('useGlobalContext must be used within GlobalContextProvider');
  }

  return globalContext;
}

// ====================================================================================================================

type GlobalContextProviderProps = {
  children: Children;
};

export function GlobalContextProvider({ children }: GlobalContextProviderProps) {
  // Get theme from localStorage.
  const storedTheme = (localStorage.getItem(THEME_KEY) as ThemeValue) || undefined;
  // Detect browser preference.
  const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const detectedTheme = prefersDarkTheme ? THEME.DARK : THEME.LIGHT;
  const initialTheme = storedTheme || detectedTheme;

  const [theme, setTheme] = useState<ThemeValue>(initialTheme);
  const [mobileNavigation, setMobileNavigation] = useState(false);
  const { user } = useAuthContext();

  // Stuff to do on first render.
  useEffect(() => {
    // Fetch and set fresh csrf token for future requests.
    getCsrfToken()
      .then((token) => {
        axios.defaults.headers.common[XCSRFTOKEN] = token;
      })
      .catch(console.error);
  }, []);

  /** Simplified theme switching. Returns theme it switched to. */
  function switchTheme(): ThemeValue {
    if (theme === THEME.LIGHT) {
      setTheme(THEME.DARK);
      return THEME.DARK;
    } else {
      setTheme(THEME.LIGHT);
      return THEME.LIGHT;
    }
  }

  // Update body classes when mobile navigation opens/closes
  useEffect(() => {
    if (mobileNavigation) {
      document.body.classList.add(MOBILE_NAVIGATION_OPEN);
    } else {
      document.body.classList.remove(MOBILE_NAVIGATION_OPEN);
    }
  }, [mobileNavigation]);

  // Update body classes when theme changes.
  useEffect(() => {
    if (theme === THEME.DARK) {
      document.body.classList.add(THEME.DARK);
      document.body.classList.remove(THEME.LIGHT);
    } else if (theme === THEME.LIGHT) {
      document.body.classList.add(THEME.LIGHT);
      document.body.classList.remove(THEME.DARK);
    }
    // Remember theme in localStorage between refreshes.
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Update theme when user changes.
  useEffect(() => {
    if (user?.user_preference.theme) {
      setTheme(user?.user_preference.theme);
    }
  }, [user]);

  /** Populated global context values. */
  const globalContextValues: GlobalContextProps = {
    theme,
    setTheme,
    switchTheme,
    mobileNavigation,
    setMobileNavigation,
  };

  return <GlobalContext.Provider value={globalContextValues}>{children}</GlobalContext.Provider>;
}
