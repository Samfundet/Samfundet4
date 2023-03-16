import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useState } from 'react';
import { Children } from '~/types';
import styles from './Table.module.scss';

type TableProps = {
  className?: string;
  columns?: Children[];
  data: ITableCell[][];
};

export interface ITableCell {
  children: Children;
  compare?: (b: ITableCell) => number;
}

export class AlphabeticTableCell implements ITableCell {
  children: string | undefined;

  constructor(child?: string) {
    this.children = child;
  }

  // compare(other: ITableCell) {
  //   if (!this.children) {
  //     return 1;
  //   }

  // const child1 = this.children;
  // const child2 = other.children;

  // if (typeof child1 != 'string') {
  //   if (!('children' in child1.props)) {
  //     child1 = child1.props.timestamp;
  //   } else {
  //     child1 = child1.props.children;
  //   }
  // }

  // if (typeof child2 != 'string') {
  //   if (!('children' in child2.props)) {
  //     child2 = child2.props.timestamp; //Todo upgrade timestamp compare
  //   } else {
  //     child2 = child2.props.children;
  //   }
  // }
  // return child1.localeCompare(child2);

  // Returns 0 − If this and other matches 100%.
  // Returns 1 if no match, and the parameter value comes before the string object's value in the locale sort order.
  // Returns a negative value if no match,
  // and the parameter value comes after the string object's value in the local sort order.
  // }
}

export function Table({ className, columns, data }: TableProps) {
  const [sortColumn, setSortColumn] = useState(-1);
  const [sortInverse, setSortInverse] = useState(false);

  function isColumnSortable(index: number) {
    // Grabs the index-th element of each row, so we get a column. Sort of transpose.
    const column = data.map((row) => row[index]);

    // allCellsAreSortable is the previous value.
    // If allCellsAreSortable becomes false at any point the function will return false
    return column.reduce((allCellsAreSortable, cell) => {
      const hasCell = cell != undefined;
      const hasCompare = cell.compare != undefined;
      return hasCell && hasCompare && allCellsAreSortable;
    }, true);
  }

  function sort(column: number) {
    if (sortColumn === column) {
      setSortInverse(!sortInverse);
    }
    setSortInverse(false);
    setSortColumn(column);
  }

  function sortedData(data: ITableCell[][]): ITableCell[][] {
    if (sortColumn === -1 || !isColumnSortable(sortColumn)) {
      return data;
    }

    return [...data].sort((rowA, rowB) => {
      const cellA = rowA[sortColumn];
      const cellB = rowB[sortColumn];

      if (!cellA || !cellB) {
        return 0;
      }

      const comparedResult = cellA.compare?.(cellB) || 0;
      return sortInverse ? -comparedResult : comparedResult;
    });
  }

  function getSortableIcon(column: number): string {
    if (sortColumn != column) return 'carbon:chevron-sort';
    return sortInverse ? 'carbon:chevron-up' : 'carbon:chevron-down';
  }

  function getIconClass(column: number): string {
    if (sortColumn != column) return styles.icon;
    return classNames(styles.icon, styles.active_icon);
  }

  return (
    <>
      <table className={classNames(className ?? '', styles.table_samf)}>
        <thead>
          <tr>
            {columns &&
              columns?.map((value, index) => {
                if (isColumnSortable(index)) {
                  return (
                    <th key={index} className={styles.sortable_th} onClick={() => sort(index)}>
                      {value}
                      <span className={styles.sort_icons}>
                        <Icon icon={getSortableIcon(index)} className={getIconClass(index)} width={18}></Icon>
                      </span>
                    </th>
                  );
                } else {
                  return <th key={index}>{value}</th>;
                }
              })}
          </tr>
        </thead>
        <tbody>
          {sortedData(data).map((row, index1) => (
            <tr key={index1}>{row && row.map((cell, index2) => <td key={index2}>{cell.children}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
