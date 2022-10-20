import classNames from 'classnames';
import { Children } from 'types';
import styles from './Table.module.scss';

type TableProps = {
  className?: string;
  columns?: Children[];
  data?: Children[][];
};

export function Table({ className, columns, data }: TableProps) {
  return (
    <>
      <table className={classNames(className ?? '', styles.table_samf)}>
        <tr>
          <td>jibberish</td>
          <td>jibberish</td>
        </tr>
        <tr>
          <th>Month</th>
          <th>Savings</th>
        </tr>
        <tr>
          <td>January</td>
          <td>$100</td>
        </tr>
        <tr>
          <td>February</td>
          <td>$80</td>
        </tr>
      </table>
    </>
  );
}
