import { createContext, useContext, useState } from 'react';
import { Children, SetState } from '~/types';

/**
 * Define which values the global context can contain.
 */
type GlobalContextProps = {
  test: number;
  setTest: SetState<number>;
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
  const [test, setTest] = useState<number>(0);

  const globalContextValues = {
    test: test,
    setTest: setTest,
  };

  return <GlobalContext.Provider value={globalContextValues}>{children}</GlobalContext.Provider>;
}
