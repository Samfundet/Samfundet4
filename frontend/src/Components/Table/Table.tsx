import classNames from 'classnames';
import { Children } from 'types';
import styles from './Table.module.scss';

type TableProps = {
  className?: string;
  columns?: Children[];
  data: ITableCell[][];
};

export interface ITableCell {
  children: Children
  compare?: (a: ITableCell, b: ITableCell) => number
}

export function Table({ className, columns, data }: TableProps) {

  function isColumnSortable(index: number) {
    let column: ITableCell[] = data.map(row => row[index]);
    return column.reduce((othersSortable: boolean, cell: ITableCell) => {
      return cell.compare != undefined && othersSortable;
    }, true)
  }
  
  return (
    <>
      <table className={classNames(className ?? '', styles.table_samf)}>
        <thead>
          <tr>
            {columns && columns?.map((value, index) => {
                return (
                  <th key={index}>
                    {value}
                    {isColumnSortable(index) && "Sort button"}
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {data && data.map((row, index1) => (
            <tr key={index1}>
              {row && row.map((cell, index2) => <td key={index2}>{cell.children}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
