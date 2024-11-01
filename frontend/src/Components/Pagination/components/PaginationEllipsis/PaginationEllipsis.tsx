import React from 'react';
import styles from './PaginationEllipsis.module.scss';
export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={`${styles.ellipsis} ${className}`} {...props}>
      . . .
    </span>
  ),
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
