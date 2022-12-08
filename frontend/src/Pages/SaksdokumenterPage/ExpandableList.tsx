import classNames from 'classnames';
import { useState } from 'react';
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
  const [showChildren, setShowChildren] = useState(false);

  function handleClick() {
    onClick && onClick();
    setShowChildren(true);
  }
  return (
    <>
      {visible && (
        <div className={classNames(styles.item, styles.parent)} onClick={handleClick}>
          <div>{content}</div>
          <div>{'>'}</div>
        </div>
      )}

      {showChildren && children}
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
