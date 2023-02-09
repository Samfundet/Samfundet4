import { useEffect } from 'react';
import { Children } from '~/types';
import styles from './ExpandableList.module.scss';
import { useExpandableListContext } from './ExpandableListContext/ExpandableListContext';

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
