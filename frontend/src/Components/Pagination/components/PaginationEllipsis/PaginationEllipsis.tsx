import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React from 'react';
import styles from './PaginationEllipsis.module.scss';
export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={classNames(styles.ellipsis, className)} {...props}>
      <Icon icon={'lucide:ellipsis'} />
    </span>
  ),
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
