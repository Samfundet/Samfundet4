import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from '~/AuthContext';
import { getCsrfToken, getKeyValues } from '~/api';
import { MIRROR_CLASS, MOBILE_NAVIGATION_OPEN, ThemeValue, XCSRFTOKEN } from '~/constants';
import { useMouseTrail, useTheme } from '~/hooks';
import { Children, KeyValueMap, SetState } from '~/types';

/**
 * Define which values the global context can contain.
 */
type GlobalContextProps = {
  // Theme
  theme: ThemeValue;
  setTheme: SetState<ThemeValue>;
  switchTheme: () => ThemeValue;

  // Mirror dimention
  mirrorDimension: boolean;
  setMirrorDimension: SetState<boolean>;
  toggleMirrorDimension: () => boolean;

  // Mouse trail
  isMouseTrail: boolean;
  setIsMouseTrail: SetState<boolean>;
  toggleMouseTrail: () => boolean;

  // Navbar
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
};

export function GlobalContextProvider({ children }: GlobalContextProviderProps) {
  // =================================== //
  //        Constants and states         //
  // =================================== //

  const [keyValues, setKeyValues] = useState<KeyValueMap>(new Map());

  const { theme, setTheme, switchTheme } = useTheme();

  // Determines if navbar for mobile is shown.
  const [isMobileNavigation, setIsMobileNavigation] = useState(false);

  const { user } = useAuthContext();

  const [mirrorDimension, setMirrorDimension] = useState<boolean>(false);
  const { isMouseTrail, setIsMouseTrail, toggleMouseTrail } = useMouseTrail();

  // =================================== //
  //               Effects               //
  // =================================== //

  // Update preferences when user is loaded.
  useEffect(() => {
    if (!user) return;
    setMirrorDimension(user.user_preference.mirror_dimension);
  }, [user]);

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

  // =================================== //
  //          Helper functions           //
  // =================================== //

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
    theme,
    setTheme,
    switchTheme,
    isMobileNavigation,
    setIsMobileNavigation,
    mirrorDimension,
    setMirrorDimension,
    isMouseTrail: isMouseTrail,
    setIsMouseTrail: setIsMouseTrail,
    toggleMouseTrail,
    toggleMirrorDimension,
    keyValues,
  };

  return <GlobalContext.Provider value={globalContextValues}>{children}</GlobalContext.Provider>;
}
