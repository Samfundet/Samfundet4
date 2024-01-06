import { TableDto } from '~/dto';
import { Column } from './types';
import styles from './ReservationTableRow.module.scss';
import { useEffect, useState } from 'react';
import { Reservation } from '../Reservation/Reservation';
import { dbT } from '~/utils';
import classNames from 'classnames';

type ReservationTableRowProps = {
  table: TableDto;
  start_time: string;
  end_time: string;
};

export function ReservationTableRow({ table, start_time, end_time }: ReservationTableRowProps) {
  const [cols, setCols] = useState<Column[]>([]);
  const [hover, setHover] = useState<boolean>(false);

  function getTimeObject(time: string) {
    const timeSplit = time.split(':');
    return new Date().setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1]), 0, 0);
  }

  useEffect(() => {
    let start_dt = getTimeObject(start_time);
    const end_dt = getTimeObject(end_time);
    const colList: Column[] = [];

    table.reservations
      ?.sort((r1, r2) => r1.start_time.localeCompare(r2.start_time))
      .forEach((reservation) => {
        const res_start_dt = getTimeObject(reservation.start_time);
        const res_end_dt = getTimeObject(reservation.end_time);
        const empty_size = Math.floor((res_start_dt - start_dt) / 900000);
        if (empty_size > 0) {
          colList.push({
            size: empty_size,
          });
        }
        colList.push({
          size: Math.floor((res_end_dt - res_start_dt) / 900000),
          reservation: reservation,
        });
        start_dt = res_end_dt;
      });

    colList.push({ size: Math.floor((end_dt - start_dt) / 900000) });
    setCols(colList);
  }, []);

  return (
    <div className={styles.row}>
      <div className={styles.table} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div style={{ position: 'relative' }}>
          <p className={styles.tableText}>
            {table.id} ({table.seating})
          </p>
          <div className={classNames(styles.tableInfo, !hover && styles.hidden)}>{dbT(table, 'description')}</div>
        </div>
      </div>
      {cols.map((col, index) => (
        <div className={styles.time} key={index} style={{ flex: col.size }}>
          {col.reservation && <Reservation reservation={col.reservation} />}
        </div>
      ))}
    </div>
  );
}
