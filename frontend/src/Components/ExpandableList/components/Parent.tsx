import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Children } from '~/types';
import styles from '../ExpandableList.module.scss';
import { useExpandableListContext } from './ExpandableListContext';

type ParentProps = {
  children: Children;
  onClick?: () => void;
  content: string | number;
  nestedDepth?: number;
};
export function Parent({ content, children, onClick, nestedDepth }: ParentProps) {
  const [showChildren, setShowChildren] = useState(false);
  const { depth, setDepth } = useExpandableListContext();
  const [isVisible, setIsVisible] = useState(false);

  function handleClick() {
    onClick && onClick();
    setShowChildren(true);
    setDepth(depth ? depth + 1 : 1);
  }

  useEffect(() => {
    if (depth == nestedDepth) {
      setShowChildren(false);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [depth, nestedDepth]);

  return (
    <>
      {isVisible && (
        <div className={classNames(styles.item, styles.parent)} onClick={handleClick}>
          <div>{content}</div>
          <div>{'>'}</div>
        </div>
      )}

      {showChildren && children}
    </>
  );
}
