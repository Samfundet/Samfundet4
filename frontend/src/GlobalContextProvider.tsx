import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCsrfToken, getUser } from '~/api';
import { THEME, ThemeValue, XCSRFTOKEN } from '~/constants';
import { UserDto } from '~/dto';
import { Children, SetState } from '~/types';

/**
 * Define which values the global context can contain.
 */
type GlobalContextProps = {
  theme: ThemeValue;
  setTheme: SetState<ThemeValue>;
  switchTheme: () => ThemeValue;
  user: UserDto | undefined;
  setUser: SetState<UserDto | undefined>;
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
  const [theme, setTheme] = useState<ThemeValue>(THEME.LIGHT);
  const [user, setUser] = useState<UserDto>();

  // Stuff to do on first render.
  useEffect(() => {
    // Fetch and set fresh csrf token for future requests.
    getCsrfToken()
      .then((token) => {
        axios.defaults.headers.common[XCSRFTOKEN] = token;
      })
      .catch(console.error);

    // Always attempt to load user on first render.
    getUser()
      .then((user) => setUser(user))
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

  // Update body classes when theme changes.
  useEffect(() => {
    switch (theme) {
      case THEME.DARK:
        document.body.classList.add(THEME.DARK);
        document.body.classList.remove(THEME.LIGHT);
        break;
      case THEME.LIGHT:
        document.body.classList.add(THEME.LIGHT);
        document.body.classList.remove(THEME.DARK);
        break;
    }
  }, [theme]);

  // Update theme when user changes.
  useEffect(() => {
    if (user?.user_preference.theme) {
      setTheme(user?.user_preference.theme);
    }
  }, [user]);

  /** Populated global context values. */
  const globalContextValues: GlobalContextProps = {
    theme: theme,
    setTheme: setTheme,
    switchTheme: switchTheme,
    user: user,
    setUser: setUser,
  };

  return <GlobalContext.Provider value={globalContextValues}>{children}</GlobalContext.Provider>;
}
