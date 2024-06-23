import type { Children } from '~/types';
import styles from './ExpandableList.module.scss';
import { useExpandableListContext } from './components/ExpandableListContextProvider/ExpandableListContextProvider';

type ExpandableListProps = {
  children: Children;
  header: string;
  depth: number;
};

export function ExpandableList({ children }: ExpandableListProps) {
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
        <h3>Saksdokumenter</h3>
      </div>
      {children}
    </div>
  );
}
