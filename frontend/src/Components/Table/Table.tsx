import classnames from 'classnames';
import styles from './Table.module.scss';


type TableProps = {
  cols: Array;
};

/*
  Cols: array, array of tuples, first is the title of the col, secound is the span
*/
export function Table({ cols, children }: TableProps) {
  const colSum = cols.reduce((partialSum, c) => partialSum + c[1], 0);
  const colWidths = cols.map(function (element) { return (element[1]/colSum)*100 + '%'})
  return (
    <table className={styles.samfTable}>
      <colgroup className={styles.cols}>
        {cols.map(function (element, key) {
          return <col key={key} span="1" style={{width:colWidths[key]}} />;
        })}
      </colgroup>
      <thead className={styles.tableHeader}>
        {cols.map(function (element, key) {
          return <th key={key}>{element[0]}</th>;
        })}
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
