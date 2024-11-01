import { Icon } from '@iconify/react';
import { PaginationControll } from './PaginationControll';

export function PaginationNext() {
  return (
    <div>
      <Icon icon={'material-symbols-light:chevron-right'} />
      <PaginationControll controllText="Next" />
    </div>
  );
}
