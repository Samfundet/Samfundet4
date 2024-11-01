import React from 'react';

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => <ul ref={ref} className={className} {...props} />,
);
PaginationContent.displayName = 'PaginationContent';
