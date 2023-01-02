import classNames from 'classnames';
import { useState } from 'react';
import { Children } from 'types';
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
  children: string;
  constructor(child: string) {
    this.children = child;
  }
  compare(other: ITableCell) {
    if (!this.children) {
      return 1;
    }
    let child1 = this.children;
    let child2 = other.children;
    if (typeof child1 != 'string') {
      if (!('children' in child1.props)) {
        child1 = child1.props.timestamp;
      } else {
        child1 = child1.props.children;
      }
    }
    if (typeof child2 != 'string') {
      if (!('children' in child2.props)) {
        child2 = child2.props.timestamp; //Todo upgrade timestamp compare
      } else {
        child2 = child2.props.children;
      }
    }
    return child1.localeCompare(child2);
    //Returns 0 − If this and other matches 100%.
    //Returns 1 if no match, and the parameter value comes before the string object's value in the locale sort order.
    //Returns a negative value if no match,
    // and the parameter value comes after the string object's value in the local sort order.
  }
}

export function Table({ className, columns, data }: TableProps) {
  const [sortColumn, setSortColumn] = useState(-1);
  const [sortInverse, setSortInverse] = useState(false);

  function isColumnSortable(index: number) {
    //Grabs the index-th element of each row, so we get a column. Sort of transpose
    const column: ITableCell[] = data.map((row) => row[index]);
    return column.reduce((othersSortable: boolean, cell: ITableCell) => {
      return cell != null && cell.compare != null && othersSortable;
    }, true);
    //othersSortble is the previous value.
    //If othersSortable becomes False at any point the function will return False
  }

  function sort(column: number) {
    if (sortColumn === column) {
      setSortInverse(!sortInverse);
    } else {
      setSortInverse(false);
      setSortColumn(column);
    }
  }

  function sortedData(data: ITableCell[][]): ITableCell[][] {
    if (sortColumn === -1 || !isColumnSortable(sortColumn)) {
      return data;
    } else {
      return [...data].sort((rowA: ITableCell[], rowB: ITableCell[]) => {
        if (rowA == null || rowA[sortColumn] == null) return 0;
        if (sortInverse) {
          return -rowA[sortColumn].compare?.(rowB[sortColumn]);
        } else {
          return rowA[sortColumn].compare?.(rowB[sortColumn]);
        }
      });
    }
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
                    <th key={index}>
                      <a key={index} onClick={() => sort(index)}>
                        {value}
                      </a>
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
