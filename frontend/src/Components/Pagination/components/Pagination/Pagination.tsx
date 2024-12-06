import classNames from 'classnames';
import React from 'react';
import styles from './Pagination.module.scss';

export const Pagination = React.forwardRef<HTMLElement, React.ComponentProps<'nav'>>(({ className, ...props }, ref) => (
  <nav ref={ref} aria-label="pagination" className={classNames(styles.nav, className)} {...props} />
));
Pagination.displayName = 'Pagination';
