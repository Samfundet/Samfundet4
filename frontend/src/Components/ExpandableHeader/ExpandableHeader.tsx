import classnames from 'classnames';
import { useState } from 'react';
import type { Children } from '~/types';
import styles from './ExpandableHeader.module.scss';

type HeaderThemes = 'parent' | 'child';

type ExpandableHeaderProps = {
  className?: string;
  label?: string;
  children?: Children;
  showByDefault?: boolean;
  theme?: HeaderThemes;
};

export function ExpandableHeader({
  className,
  label,
  children,
  theme = 'parent',
  showByDefault = false,
}: ExpandableHeaderProps) {
  const [showChildren, setShowChildren] = useState(showByDefault);
  const classNames = classnames(className, styles.extendable_header_wrapper, styles.extendable_header);
  const containerClassNames = classnames(styles.container, {
    [styles.parent]: theme === 'parent',
    [styles.child]: theme === 'child',
  });

  return (
    <div className={containerClassNames}>
      <div className={classNames} onClick={() => setShowChildren(!showChildren)}>
        <p className={styles.extendable_header_title}>{label}</p>
        <div className={classnames(styles.expandable_header_arrow, showChildren ? styles.open : styles.closed)}>
          &#9660;
        </div>
      </div>
      {showChildren && children}
    </div>
  );
}
