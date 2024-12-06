import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useMemo } from 'react';
import styles from './PagedPagination.module.scss';
import { Pagination, PaginationButton, PaginationContent, PaginationEllipsis, PaginationItem } from './components';

type PagedPaginationPaginationItemType = (number | 'ellipsis')[];

interface PagedPaginationnProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // Controls the number of sibling pages around the current page
  boundaryCount?: number; // Controls the number of boundary pages on each end
  paginationClassName?: string;
  itemClassName?: string;
}

// Helper function to generate sequential page numbers
const generateSequentialPages = (start: number, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Adjusted ellipsis helper functions
const showStartEllipsis = (current: number, boundaryCount: number, siblingCount: number): boolean =>
  boundaryCount > 0 && siblingCount > 0 && current > boundaryCount + siblingCount + 1;
const showEndEllipsis = (current: number, total: number, boundaryCount: number, siblingCount: number): boolean =>
  boundaryCount > 0 && siblingCount > 0 && current < total - boundaryCount - siblingCount;

export function PagedPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  paginationClassName,
  itemClassName,
}: PagedPaginationnProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginationItems = useMemo(() => {
    const pages: PagedPaginationPaginationItemType = [];
    const startPages = generateSequentialPages(1, Math.min(boundaryCount, totalPages));
    const endPages = generateSequentialPages(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

    // Early return for simple pagination case
    if (totalPages <= 7 + siblingCount * 2 + boundaryCount * 2) {
      return generateSequentialPages(1, totalPages);
    }

    // Add boundary pages at the start
    pages.push(...startPages);

    // Conditionally add start ellipsis
    if (showStartEllipsis(currentPage, boundaryCount, siblingCount)) {
      pages.push('ellipsis');
    }

    // Add sibling pages around the current page
    const startSibling = Math.max(boundaryCount + 1, currentPage - siblingCount);
    const endSibling = Math.min(totalPages - boundaryCount, currentPage + siblingCount);
    pages.push(...generateSequentialPages(startSibling, endSibling));

    // Conditionally add end ellipsis
    if (showEndEllipsis(currentPage, totalPages, boundaryCount, siblingCount)) {
      pages.push('ellipsis');
    }

    // Add boundary pages at the end
    pages.push(...endPages);

    return pages;
  }, [currentPage, totalPages, siblingCount, boundaryCount]);

  return (
    <div className={styles.container}>
      <Pagination className={classNames(paginationClassName)}>
        <PaginationContent>
          <PaginationItem className={classNames(itemClassName)}>
            <PaginationButton
              buttonSymbol={<Icon icon={'mdi:chevron-left'} />}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>

          {paginationItems.map((page, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <PaginationItem key={index} className={classNames(itemClassName)}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationButton
                  isActive={page === currentPage}
                  buttonSymbol={String(page)}
                  onClick={() => onPageChange(page)}
                />
              )}
            </PaginationItem>
          ))}

          <PaginationItem className={classNames(itemClassName)}>
            <PaginationButton
              buttonSymbol={<Icon icon={'mdi:chevron-right'} />}
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
