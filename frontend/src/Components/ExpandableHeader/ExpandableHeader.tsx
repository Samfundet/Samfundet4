import classnames from 'classnames';
import { useState } from 'react';
import { Children } from '~/types';
import styles from './ExpandableHeader.module.scss';

type ExpandableHeaderProps = {
  className?: string;
  label?: string;
  children?: Children;
  showByDefault?: boolean;
};

export function ExpandableHeader({ className, label, children, showByDefault = false }: ExpandableHeaderProps) {
  const [showChildren, setShowChildren] = useState(showByDefault);
  const classNames = classnames(className, styles.extendable_header_wrapper, styles.extendable_header);
  return (
    <div>
      <div className={classNames} onClick={() => setShowChildren(!showChildren)}>
        <div className={classnames(styles.expandable_header_arrow, showChildren ? styles.open : styles.closed)}>
          &#9660;
        </div>
        <p className={styles.extendable_header_title}>{label}</p>
      </div>
      {showChildren && children}
    </div>
  );
}
