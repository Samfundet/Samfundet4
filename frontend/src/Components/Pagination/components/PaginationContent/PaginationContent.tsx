import React from 'react';
import styles from './PaginationContent.module.scss';
export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => <ul ref={ref} className={`${styles.list} ${className}`} {...props} />,
);
PaginationContent.displayName = 'PaginationContent';
