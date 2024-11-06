import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import styles from './DrfPagination.module.scss';
import { Pagination, PaginationContent, PaginationControl, PaginationEllipsis, PaginationItem } from './components';

type PaginationItemType = (number | 'ellipsis')[];

interface DRFPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemClassName?: string;
}

export const DrfPagination: React.FC<DRFPaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className,
  itemClassName,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginationItems = useMemo(() => {
    const pages: PaginationItemType = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);
  return (
    <div className={styles.container}>
      <Pagination className={className}>
        <PaginationContent>
          <PaginationItem className={itemClassName}>
            <PaginationControl
              controlSymbol={<Icon icon={'mdi:chevron-left'} />}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>

          {paginationItems.map((page, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <PaginationItem key={index} className={itemClassName}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationControl
                  isActive={page === currentPage}
                  controlSymbol={String(page)}
                  onClick={() => onPageChange(page)}
                />
              )}
            </PaginationItem>
          ))}

          <PaginationItem className={itemClassName}>
            <PaginationControl
              controlSymbol={<Icon icon={'mdi:chevron-right'} />}
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
