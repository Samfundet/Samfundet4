import { useTranslation } from 'react-i18next';
import { TimeDisplay, TimeDuration } from '~/Components';
import { EventDto } from '~/dto';
import { dbT, getTicketTypeKey } from '~/utils';
import styles from './EventTable.module.scss';

type EventTableProps = {
  event: EventDto;
};

export function EventTable({ event }: EventTableProps) {
  const { t } = useTranslation();

  function ticketType() {
    if (event.ticket_type !== 'custom') {
      return (
        <tr>
          <td className={styles.table_element_left}> BILLETT </td>
          <td className={styles.table_element_right}> {t(getTicketTypeKey(event.ticket_type))} </td>
        </tr>
      );
    }
    return (
      <>
        {event.custom_tickets.map((ticket, index) => (
          <tr key={ticket.id}>
            <td className={styles.table_element_left}>{index === 0 ? 'BILLETT' : <>&nbsp;</>}</td>
            <td className={styles.table_element_right}>
              <b> {dbT(ticket, 'name')} </b>
              <br></br>
              <span> {ticket.price},- </span>
            </td>
          </tr>
        ))}
      </>
    );
  }

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
        <td className={styles.table_element_right}>
          <TimeDisplay timestamp={event.start_dt} displayType="nice-date" />
        </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> TID </td>
        <td className={styles.table_element_right}>
          <TimeDuration start={event.start_dt} end={event.end_dt} />
        </td>
      </tr>
      {ticketType()}
      <tr>
        <td className={styles.table_element_left}> ALDERSGRENSE </td>
        <td className={styles.table_element_right}> {event?.age_restriction} </td>
      </tr>
    </table>
  );
}
