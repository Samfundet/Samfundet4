import { createContext, useContext, useState } from 'react';
import { Children, SetState } from '~/types';

type ExpandableListContextProps = {
  depth: number | undefined;
  setDepth: SetState<number | undefined>;
};

const ExpandableListContext = createContext<ExpandableListContextProps | undefined>(undefined);

export function useExpandableListContext() {
  const contextValue = useContext(ExpandableListContext);

  if (contextValue === undefined) {
    throw new Error('useExpandableListContext must be used within an ExpandableListContext');
  }

  return contextValue;
}

type ExpandableListContextProviderProps = {
  children: Children;
};

export function ExpandableListContextProvider({ children }: ExpandableListContextProviderProps) {
  const [depth, setDepth] = useState<number | undefined>();

  const contextValue: ExpandableListContextProps = {
    depth: depth,
    setDepth: setDepth,
  };

  return <ExpandableListContext.Provider value={contextValue}>{children}</ExpandableListContext.Provider>;
}
