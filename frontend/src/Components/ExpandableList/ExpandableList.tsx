import type { ReactNode } from 'react';
import styles from './ExpandableList.module.scss';
import { useExpandableListContext } from './components/ExpandableListContextProvider/ExpandableListContextProvider';

type ExpandableListProps = {
  children: ReactNode;
  header: string;
  depth: number;
};

export function ExpandableList({ header, children }: ExpandableListProps) {
  const { depth, setDepth } = useExpandableListContext();
  const depthNotZero = depth > 0;

  function decreaseDepth() {
    if (depth > 0) {
      setDepth(depth - 1);
    }
  }

  return (
    <div className={styles.content_container}>
      <div className={styles.header}>
        {depthNotZero && (
          <button type="button" className={styles.back_button} onClick={decreaseDepth}>
            ↩︎
          </button>
        )}
        {header && <strong>{header}</strong>}
      </div>
      {children}
    </div>
  );
}
