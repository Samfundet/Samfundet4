import classNames from 'classnames';
import { useState } from 'react';
import { Children } from 'types';
import { Button } from '../Button';
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
  children: String;
  constructor(child: String) {
    this.children = child;
  }
  compare(other: ITableCell) {
    return this.children.localeCompare(other.children!.toString());
  }
}

export function Table({ className, columns, data }: TableProps) {

  const [sortColumn, setSortColumn] = useState(-1);
  const [sortInverse, setSortInverse] = useState(false);

  function isColumnSortable(index: number) {
    const column: ITableCell[] = data.map((row) => row[index]);
    return column.reduce((othersSortable: boolean, cell: ITableCell) => {
      return cell != null && cell.compare != null && othersSortable;
    }, true);
  }

  function sortButton(column: number): Children {
    return <Button onClick={() => {
      if (sortColumn === column) {
        setSortInverse(!sortInverse)
      } else {
        setSortInverse(false)
        setSortColumn(column)
      }
    }}>
      {sortInverse ? "V" : "^"}
    </Button>;
  }

  function sortedData(data: ITableCell[][]): ITableCell[][] {
    if (sortColumn === -1 || !isColumnSortable(sortColumn)) {
      return data;
    } else {
      return [...data].sort(
        (rowA: ITableCell[], rowB: ITableCell[]) => {
          if (rowA == null || rowA[sortColumn] == null)
            return 0;
          if (sortInverse)
            return -rowA[sortColumn].compare!(rowB[sortColumn])
          else
            return rowA[sortColumn].compare!(rowB[sortColumn])
        }
      );
    }
  }


  return (
    <>
      <table className={classNames(className ?? '', styles.table_samf)}>
        <thead>
          <tr>
            {columns &&
              columns?.map((value, index) => {
                return (
                  <th key={index}>
                    {value}
                    {isColumnSortable(index) && sortButton(index)}
                  </th>
                );
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
