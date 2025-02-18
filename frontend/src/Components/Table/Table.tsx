import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { Fragment, useState } from 'react';
import { Skeleton, TimeDisplay } from '~/Components';
import type { Children } from '~/types';
import styles from './Table.module.scss';

// Supported cell values for sorting
type TableCellValue = string | number | Date | boolean;

// Table Column
type TableColumn = {
  sortable?: boolean;
  hideSortButton?: boolean;
  content: Children;
};

type TableCell = {
  // Value used for sorting, eg number 24 or string "some string"
  value?: TableCellValue;
  // Content in cell, eg <b>24 hours</b>
  // If missing, uses value instead.
  content?: Children;
  style?: string;
};

// Type shorthands
export type TableRow = {
  cells: Array<TableCell | TableCellValue | undefined>;
  childTable?: TableProps;
};

type TableDataType = TableRow[];

type TableProps = {
  className?: string;
  headerColumnClassName?: string;
  cellClassName?: string;
  headerClassName?: string;
  bodyRowClassName?: string;
  bodyClassName?: string;
  columns?: (TableColumn | string | undefined)[];
  // Data can either be a table cell with separated value and content, or just the raw value
  // For instance ["a", "b"] or [ {value: "a", content: <div>a</div>}, {value: "b", content: <div>b</div>} ]
  data: TableDataType;
  defaultSortColumn?: number;
  isChildTable?: boolean;
  isLoading?: boolean;
  skeletonRowCount?: number;
};

export function Table({
  className,
  headerClassName,
  headerColumnClassName,
  bodyClassName,
  bodyRowClassName,
  cellClassName,
  columns,
  data,
  defaultSortColumn = -1,
  isChildTable,
  isLoading = false,
  skeletonRowCount = 10,
}: TableProps) {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortInverse, setSortInverse] = useState(false);
  const [isOpen, setIsOpen] = useState<number | null>(null);

  function sort(column: number) {
    if (sortColumn === column) {
      setSortInverse(!sortInverse);
    } else {
      setSortInverse(false);
      setSortColumn(column);
    }
  }

  function isColumnSortable(column?: TableColumn | string) {
    if (column === undefined || typeof column === 'string') return false;
    return (column as TableColumn).sortable === true;
  }

  function getCellValue(cell: TableCell | TableCellValue) {
    if (cell instanceof Date) {
      return cell;
    }
    if (typeof cell === 'object') {
      return (cell as TableCell).value;
    }
    return cell;
  }

  function sortedData(data: TableDataType): TableDataType {
    if (sortColumn === -1 || !isColumnSortable(columns?.[sortColumn])) {
      return data;
    }

    return [...data].sort((rowA, rowB) => {
      const cellA = getCellValue(rowA.cells[sortColumn] ?? '');
      const cellB = getCellValue(rowB.cells[sortColumn] ?? '');

      // Not same type, force sort as string type
      if (typeof cellA !== typeof cellB) {
        const diff = (cellA?.toString() ?? '').localeCompare(cellB?.toString() ?? '');
        return sortInverse ? -diff : diff;
      }
      const cellType = typeof cellA;

      // Custom sort handling for dates
      if (cellA instanceof Date && cellB instanceof Date) {
        const diff = (cellA as Date).getTime() - (cellB as Date).getTime();
        return sortInverse ? -diff : diff;
      }

      // Compare by primitive type
      let result = 0;
      switch (cellType) {
        case 'number':
          result = (cellA as number) - (cellB as number);
          break;
        case 'string':
          result = (cellA as string).localeCompare(cellB as string);
          break;
        case 'boolean':
          result = cellA === cellB ? 0 : cellA ? 1 : -1;
          break;
      }
      // Return inversed/normal
      return sortInverse ? -result : result;
    });
  }

  function isHideSortButton(column: TableColumn | string | undefined): boolean {
    const hideSortButton = (column as TableColumn)?.hideSortButton;
    return hideSortButton === undefined ? false : hideSortButton;
  }

  function getSortableIcon(column: number): string {
    if (sortColumn !== column) return 'carbon:chevron-sort';
    return sortInverse ? 'carbon:chevron-up' : 'carbon:chevron-down';
  }

  function getIconClass(column: number): string {
    if (sortColumn !== column) return styles.icon;
    return classNames(styles.icon, styles.active_icon);
  }

  function getCellContent(cell: TableCell | TableCellValue) {
    if (cell instanceof Date) {
      return <TimeDisplay timestamp={cell.toString()} />;
    }
    if (typeof cell === 'object') {
      const content = (cell as TableCell).content;
      if (content !== undefined) {
        return content;
      }
      return (cell as TableCell).value as string;
    }
    return cell.toString();
  }

  function getCellStyle(cell: TableCell | TableCellValue) {
    if (typeof cell === 'object') {
      const style = (cell as TableCell).style;
      if (style !== undefined) {
        return style;
      }
    }
    return null;
  }

  function getColumnContent(col?: TableColumn | string) {
    if (col === undefined) {
      return '';
    }
    if (typeof col === 'object') {
      return (col as TableColumn).content as string;
    }
    return col;
  }

  function hasChildTable(data: TableDataType): boolean {
    return data.some((row) => row.childTable !== undefined);
  }

  function renderSkeletonRows() {
    return Array(skeletonRowCount)
      .fill(null)
      .map((_, rowIndex) => (
        <tr
          key={`skeleton-${
            // biome-ignore lint/suspicious/noArrayIndexKey: no guarantee for unique value except for index
            rowIndex
          }`}
          className={bodyRowClassName}
        >
          {(isChildTable || data.some((row) => row.childTable !== undefined)) && (
            <td className={cellClassName}>
              <Skeleton width="1em" height="1em" />
            </td>
          )}
          {columns?.map((_, colIndex) => (
            <td
              key={`skeleton-cell-${
                // biome-ignore lint/suspicious/noArrayIndexKey: required for tab focus
                colIndex
              }`}
              className={cellClassName}
            >
              <Skeleton width={`${Math.floor(Math.random() * 40 + 60)}%`} height="1.2em" />
            </td>
          ))}
        </tr>
      ));
  }

  return (
    <>
      <table className={classNames(className ?? '', styles.table_samf)}>
        <thead className={headerClassName}>
          <tr>
            {(hasChildTable(data) || isChildTable) && <th />}
            {columns?.map((col, index) => {
              if (isColumnSortable(col)) {
                return (
                  <th
                    // biome-ignore lint/suspicious/noArrayIndexKey: no guarantee for unique value except for index
                    key={index}
                    className={classNames(headerColumnClassName, styles.sortable_th)}
                    onClick={() => sort(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        sort(index);
                      }
                    }}
                    // biome-ignore lint/a11y/noNoninteractiveTabindex: Sortable header needs to be focusable for keyboard navigation
                    tabIndex={0}
                  >
                    {getColumnContent(col)}
                    {!isHideSortButton(col) && (
                      <span className={styles.sort_icons}>
                        <Icon icon={getSortableIcon(index)} className={getIconClass(index)} width={18} />
                      </span>
                    )}
                  </th>
                );
              }
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: no guarantee for unique value except for index
                <th className={headerColumnClassName} key={index}>
                  {getColumnContent(col)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {isLoading
            ? renderSkeletonRows()
            : sortedData(data).map((row, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: no guarantee for unique value except for index
                <Fragment key={index}>
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: Click handling is handled by parent row element */}
                  <tr
                    className={`${bodyRowClassName} ${row.childTable !== undefined ? styles.expandableRow : ''}`}
                    onClick={() => (isOpen === index ? setIsOpen(null) : setIsOpen(index))}
                  >
                    {row.childTable !== undefined && (
                      <td
                        className={classNames(cellClassName)}
                        key={`arrow-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: no guarantee for unique value except for index
                          index
                        }`}
                      >
                        <Icon icon={isOpen === index ? 'carbon:chevron-down' : 'carbon:chevron-right'} />
                      </td>
                    )}
                    {row?.cells.map((cell, cellIndex) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: no guarantee for unique value except for index
                      <td className={classNames(cellClassName, getCellStyle(cell ?? ''))} key={cellIndex}>
                        {getCellContent(cell ?? '')}
                      </td>
                    ))}
                  </tr>
                  {row.childTable !== undefined && isOpen === index && (
                    <tr className={styles.childTableContainer}>
                      <td colSpan={row.cells.length + 1} className={`${styles.childTable} ${cellClassName}`}>
                        <Table {...row.childTable} isChildTable />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
        </tbody>
      </table>
    </>
  );
}
