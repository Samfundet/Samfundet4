import { Icon } from '@iconify/react';
import { PaginationControll } from './PaginationControll';

export function PaginationPrevious() {
  return (
    <div>
      <PaginationControll controllText="Previous" />
      <Icon icon={'material-symbols-light:chevron-left'} />
    </div>
  );
}
