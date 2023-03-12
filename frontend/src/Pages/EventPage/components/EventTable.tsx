import { TimeDisplay, TimeDuration } from '~/Components';
import { EventDto } from '~/dto';
import styles from './EventTable.module.scss';

type EventTableProps = {
  event: EventDto | undefined;
};

export function EventTable({ event }: EventTableProps) {
  const ticket_field = event?.price_group;
  return (
    <table className={styles.table_container}>
      <tr>
        <td className={styles.table_element_left}> LOKALE </td>
        <td className={styles.table_element_right}> {event?.location} </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> ARRANGØR </td>
        <td className={styles.table_element_right}> {event?.host} </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> DATO </td>
        <td className={styles.table_element_right}>
          <TimeDisplay timestamp={event?.start_dt.toLocaleString() || ''} displayType="date-nice" />{' '}
        </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> TID </td>
        <td className={styles.table_element_right}>
          <TimeDuration start={event?.start_dt.toLocaleString() || ''} end={event?.end_dt?.toLocaleString() || ''} />
        </td>
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
