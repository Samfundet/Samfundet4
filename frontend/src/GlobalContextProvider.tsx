import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCsrfToken, getKeyValues } from '~/api';
import { useAuthContext } from '~/AuthContext';
import { MIRROR_CLASS, MOBILE_NAVIGATION_OPEN, THEME, THEME_KEY, ThemeValue, XCSRFTOKEN } from '~/constants';
import { Children, KeyValueMap, SetState } from '~/types';

export function updateBodyThemeClass(theme: ThemeValue) {
  // Set theme as data attr on body.
  document.body.setAttribute(THEME_KEY, theme);
  // Remember theme in localStorage between refreshes.
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Define which values the global context can contain.
 */
type GlobalContextProps = {
  theme: ThemeValue;
  setTheme: SetState<ThemeValue>;
  switchTheme: () => ThemeValue;
  mirrorDimension: boolean;
  setMirrorDimension: SetState<boolean>;
  toggleMirrorDimension: () => boolean;
  isMobileNavigation: boolean;
  setIsMobileNavigation: SetState<boolean>;
  keyValues: KeyValueMap;
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
  values?: Partial<GlobalContextProps>;
};

export function GlobalContextProvider({ children, values }: GlobalContextProviderProps) {
  // =================================== //
  //        Constants and states         //
  // =================================== //

  // Get theme from localStorage.
  const storedTheme = (localStorage.getItem(THEME_KEY) as ThemeValue) || undefined;

  // Determine browser preference.
  const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const detectedTheme = prefersDarkTheme ? THEME.DARK : THEME.LIGHT;
  const initialTheme = storedTheme || detectedTheme;

  const [keyValues, setKeyValues] = useState<KeyValueMap>(new Map());

  const [theme, setTheme] = useState<ThemeValue>(initialTheme);

  // Determines if navbar for mobile is shown.
  const [isMobileNavigation, setIsMobileNavigation] = useState(false);

  const { user } = useAuthContext();

  const [mirrorDimension, setMirrorDimension] = useState<boolean>(user?.user_preference.mirror_dimension ?? false);

  // =================================== //
  //               Effects               //
  // =================================== //

  // Stuff to do on first render.
  useEffect(() => {
    // Fetch and set fresh csrf token for future requests.
    getCsrfToken()
      .then((token) => {
        // Update axios globally with new token.
        axios.defaults.headers.common[XCSRFTOKEN] = token;
      })
      .catch(console.error);

    // Load keyValues.
    getKeyValues().then((response) => {
      // Transform KeyValue[] response to Map of [key,value] entries.
      const keyValueMap = new Map(response.data.map((kv) => [kv.key, kv.value ?? '']));
      setKeyValues(keyValueMap);
    });
  }, []);

  // Update body classes when mobile navigation opens/closes.
  useEffect(() => {
    if (isMobileNavigation) {
      document.body.classList.add(MOBILE_NAVIGATION_OPEN);
    } else {
      document.body.classList.remove(MOBILE_NAVIGATION_OPEN);
    }
  }, [isMobileNavigation]);

  // Update body classes when mirrorDimension is toggled.
  useEffect(() => {
    if (mirrorDimension) {
      document.body.classList.add(MIRROR_CLASS);
    } else {
      document.body.classList.remove(MIRROR_CLASS);
    }
  }, [mirrorDimension]);

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

  // =================================== //
  //          Helper functions           //
  // =================================== //

  /** Simplified theme switching. Returns theme it switched to. */
  function switchTheme(): ThemeValue {
    if (theme === THEME.LIGHT) {
      setTheme(THEME.DARK);
      return THEME.DARK;
    }

    setTheme(THEME.LIGHT);
    return THEME.LIGHT;
  }

  /** Toggles mirrorDimension and returns the state it switched to. */
  function toggleMirrorDimension(): boolean {
    const toggledValue = !mirrorDimension;
    setMirrorDimension(toggledValue);
    return toggledValue;
  }

  // =================================== //
  //    Finalize context with values     //
  // =================================== //

  /** Populated global context values. */
  const globalContextValues: GlobalContextProps = {
    ...values,
    theme,
    setTheme,
    switchTheme,
    isMobileNavigation,
    setIsMobileNavigation,
    mirrorDimension,
    setMirrorDimension,
    toggleMirrorDimension,
    keyValues,
  };

  return <GlobalContext.Provider value={globalContextValues}>{children}</GlobalContext.Provider>;
}
