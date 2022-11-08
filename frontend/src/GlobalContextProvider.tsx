import { createContext, useContext, useEffect, useState } from 'react';
import { THEME, ThemeValue } from '~/constants';
import { Children, SetState } from '~/types';

/**
 * Define which values the global context can contain.
 */
type GlobalContextProps = {
  theme: ThemeValue;
  setTheme: SetState<ThemeValue>;
  switchTheme: () => void;
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
  const [theme, setTheme] = useState<ThemeValue>(THEME.DARK);

  /** Simplified theme switching. */
  function switchTheme() {
    if (theme === THEME.LIGHT) {
      setTheme(THEME.DARK);
    } else {
      setTheme(THEME.LIGHT);
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

  /** Populated global context values. */
  const globalContextValues: GlobalContextProps = {
    theme: theme,
    setTheme: setTheme,
    switchTheme: switchTheme,
  };

  return <GlobalContext.Provider value={globalContextValues}>{children}</GlobalContext.Provider>;
}
