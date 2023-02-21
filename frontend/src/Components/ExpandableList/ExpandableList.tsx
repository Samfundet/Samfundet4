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
  const depthNotZero = depth > 0;

  function decreseDepth() {
    if (depth > 0) {
      setDepth(depth - 1);
    }
  }

  return (
    <div className={styles.content_container}>
      <div className={styles.header}>
        {depthNotZero && (
          <div
            className={styles.back_button}
            onClick={() => {
              decreseDepth();
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

