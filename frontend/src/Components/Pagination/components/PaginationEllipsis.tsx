import React from 'react';

export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={className} {...props}>
      . . .
    </span>
  ),
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
