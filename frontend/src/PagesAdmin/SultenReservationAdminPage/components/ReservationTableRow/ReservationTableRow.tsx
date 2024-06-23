import type { TableDto } from '~/dto';
import type { Column } from './types';
import styles from './ReservationTableRow.module.scss';
import { useEffect, useState } from 'react';
import { Reservation } from '../Reservation/Reservation';
import { dbT, getTimeObject } from '~/utils';
import classNames from 'classnames';

type ReservationTableRowProps = {
  table: TableDto;
  start_time: string;
  end_time: string;
};

export function ReservationTableRow({ table, start_time, end_time }: ReservationTableRowProps) {
  const [cols, setCols] = useState<Column[]>([]);
  const [hover, setHover] = useState<boolean>(false);

  useEffect(() => {
    let start_dt = getTimeObject(start_time);
    const end_dt = getTimeObject(end_time);
    const colList: Column[] = [];
    const quarterSecounds = 900000;
    table.reservations
      ?.sort((r1, r2) => r1.start_time.localeCompare(r2.start_time))
      .forEach((reservation) => {
        /*
          Method for creating an array with
          Reservation and its timespan
          with a width, which is how many whole quarters there is in a timespan
          Will get spaces for each reservation, and its width

          To be used for display and setting width of columns
        */
        const res_start_dt = getTimeObject(reservation.start_time);
        const res_end_dt = getTimeObject(reservation.end_time);
        // Fetch empty space before
        const empty_size = Math.floor((res_start_dt - start_dt) / quarterSecounds);
        // If there is an empty size, add it.
        if (empty_size > 0) {
          colList.push({
            size: empty_size,
          });
        }
        // Add reservation with its width
        colList.push({
          size: Math.floor((res_end_dt - res_start_dt) / quarterSecounds),
          reservation: reservation,
        });
        start_dt = res_end_dt;
      });
    // add empty size at end
    colList.push({ size: Math.floor((end_dt - start_dt) / 900000) });
    setCols(colList);
  }, [start_time, end_time, table]);

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
