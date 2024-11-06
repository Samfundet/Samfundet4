import { Icon } from '@iconify/react';
import type { ButtonDisplay, ButtonTheme } from '../Button';
import styles from './DrfPagination.module.scss';
import { Pagination, PaginationContent, PaginationControl, PaginationEllipsis, PaginationItem } from './components';
interface DRFPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemClassName?: string;
  buttonTheme?: ButtonTheme;
  buttonDisplay?: ButtonDisplay;
  rounded?: boolean;
  navButtonTheme?: ButtonTheme; // separate theme for Previous/Next buttons
}

export const DrfPagination: React.FC<DRFPaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className,
  itemClassName,
  buttonTheme = 'basic',
  buttonDisplay = 'basic',
  rounded = false,
  navButtonTheme = 'basic',
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const generatePagination = () => {
    const pages: (number | 'ellipsis')[] = [];

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
  };

  return (
    <div className={styles.container}>
      <Pagination className={className}>
        <PaginationContent>
          <PaginationItem className={itemClassName}>
            <PaginationControl
              controlSymbol={<Icon icon={'mdi:chevron-left'} />}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              theme={navButtonTheme}
              display={buttonDisplay}
              rounded={rounded}
            />
          </PaginationItem>

          {generatePagination().map((page, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <PaginationItem key={index} className={itemClassName}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationControl
                  isActive={page === currentPage}
                  controlSymbol={String(page)}
                  onClick={() => onPageChange(page)}
                  theme={buttonTheme}
                  display={buttonDisplay}
                  rounded={rounded}
                />
              )}
            </PaginationItem>
          ))}

          <PaginationItem className={itemClassName}>
            <PaginationControl
              controlSymbol={<Icon icon={'mdi:chevron-right'} />}
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              theme={navButtonTheme}
              display={buttonDisplay}
              rounded={rounded}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
