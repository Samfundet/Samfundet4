import { TableDto, ReservationTableDto } from '~/dto';
import styles from './ReservationTableRow.module.scss';
import { useEffect, useState } from 'react';
import { Reservation } from '../Reservation/Reservation';

type ReservationTableRowProps = {
  table: TableDto;
  start_time: string;
  end_time: string;
};

type columns = {
  size: number;
  reservation?: ReservationTableDto; // TODO replace with object
};

export function ReservationTableRow({ table, start_time, end_time }: ReservationTableRowProps) {
  const [cols, setCols] = useState<columns[]>([]);

  function getTimeObject(time: string) {
    const timeSplit = time.split(':');
    return new Date().setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1]), 0, 0);
  }

  useEffect(() => {
    let start_dt = getTimeObject(start_time);
    const end_dt = getTimeObject(end_time);
    const colList: columns[] = [];

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
    <div className={styles.timeHeader}>
      <div className={styles.table}>
        <p className={styles.tableText}>{table.id}</p>
      </div>
      {cols.map((col, index) => (
        <div className={styles.time} key={index} style={{ flex: col.size }}>
          {col.reservation && <Reservation reservation={col.reservation} />}
        </div>
      ))}
    </div>
  );
}
