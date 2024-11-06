import classNames from 'classnames';
import React from 'react';
import styles from './PaginationItem.module.scss';

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={classNames(styles.item, className)} {...props} />,
);
PaginationItem.displayName = 'PaginationItem';
