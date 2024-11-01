// type PaginationEllipsisprops = {
//   className?: string;
// };

import React from 'react';

// export function PaginationEllipsis({ className, ...props }: PaginationEllipsisprops) {
//   return <span {...props}>...</span>;
// }

export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={className} {...props}>
      . . .
    </span>
  ),
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
