import { Event, monthNamesNo } from 'types';
import { getTimeStr } from '../../EventsPage/EventsPage';
import styles from './EventTable.module.scss';

type EventTableProps = {
  event: Event;
};

export function EventTable({ event }: EventTableProps) {
  const date_field: string = event.start_dt.getDate() + '. ' + monthNamesNo[event.start_dt.getMonth()];
  const time_field: string = getTimeStr(event.start_dt) + ' - ' + getTimeStr(event.end_dt);
  return (
    <table>
      <tr>
        <td className={styles.table_element_left}> LOKALE </td>
        <td className={styles.table_element_right}> {event.location} </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> ARRANGØR </td>
        <td className={styles.table_element_right}> {event.host} </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> DATO </td>
        <td className={styles.table_element_right}>{date_field}</td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> TID </td>
        <td className={styles.table_element_right}> {time_field}</td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> BILLETT </td>
        <td className={styles.table_element_right}> STORSALEN </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> ALDERSGRENSE </td>
        <td className={styles.table_element_right}> STORSALEN </td>
      </tr>
    </table>
  );
}
