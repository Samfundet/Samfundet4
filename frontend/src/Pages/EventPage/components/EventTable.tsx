import { Event } from '~/types';
import { getTimeStr } from '~/Pages/EventsPage/EventsPage';
import styles from './EventTable.module.scss';

type EventTableProps = {
  event: Event;
};

export function EventTable({ event }: EventTableProps) {
  const month: string = event.start_dt.toLocaleDateString('no', { month: 'long' });
  const monthday: number = event.start_dt.getDate();
  const time_field: string = getTimeStr(event.start_dt) + ' - ' + getTimeStr(event.end_dt);
  const ticket_field: string = event.price_group;
  return (
    <table className={styles.table_container}>
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
        <td className={styles.table_element_right}>{monthday + '. ' + month}</td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> TID </td>
        <td className={styles.table_element_right}> {time_field}</td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> BILLETT </td>
        <td className={styles.table_element_right}> {ticket_field} </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> ALDERSGRENSE </td>
        <td className={styles.table_element_right}> STORSALEN </td>
      </tr>
    </table>
  );
}
