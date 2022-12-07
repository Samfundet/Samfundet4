import { Children } from '~/types';
import styles from './SaksdokumenterPage.module.scss';

type ExpandableListProps = {
  children: Children;
  header: string;
  depth: number;
};

export function ExpandableList({ children }: ExpandableListProps) {
  return { children };
}

type ParentProps = {
  children: Children;
  onClick?: () => void;
  content: string | number;
  key: string | number;
  visible: boolean;
};

export function Parent({ content, children, onClick, visible }: ParentProps) {
  return (
    <>
      {visible && (
        <div className={styles.item} onClick={onClick}>
          {content}
        </div>
      )}

      {children}
    </>
  );
}

type ChildProps = {
  content: string;
  fileLocation: string;
  visible: boolean;
};

export function Child({ content, fileLocation, visible }: ChildProps) {
  return (
    <>
      {visible && (
        <a className={styles.item} href={fileLocation}>
          {content}
        </a>
      )}
    </>
  );
}
