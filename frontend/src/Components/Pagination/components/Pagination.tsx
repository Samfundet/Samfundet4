import React from 'react';

export const Pagination = React.forwardRef<HTMLElement, React.ComponentProps<'nav'>>(({ className, ...props }, ref) => (
  <nav ref={ref} aria-label="pagination" className={className} {...props} />
));
Pagination.displayName = 'Pagination';
