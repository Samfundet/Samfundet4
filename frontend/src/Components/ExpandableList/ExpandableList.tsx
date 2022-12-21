import { createContext, useContext, useEffect, useState } from 'react';
import { Children, SetState } from '~/types';
import styles from './ExpandableList.module.scss';

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

type ExpandableListProps = {
  children: Children;
  header: string;
  depth: number;
};

export function ExpandableList({ children }: ExpandableListProps) {
  const { depth, setDepth } = useExpandableListContext();

  // Set depth to 0 on initial render
  useEffect(() => {
    setDepth(0);
  }, [setDepth]);

  return (
    <div className={styles.content_container}>
      <div className={styles.header}>
        {depth != 0 && (
          <div
            className={styles.back_button}
            onClick={() => {
              setDepth(depth && depth - 1);
            }}
          >
            ↩︎
          </div>
        )}
        <h3>Saksdokumenter</h3>
      </div>
      {children}
    </div>
  );
}
