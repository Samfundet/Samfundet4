import { useTranslation } from 'react-i18next';
import { TimeDisplay, TimeDuration } from '~/Components';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
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
          <td className={styles.table_element_left}> {t(KEY.common_ticket_type).toUpperCase()} </td>
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

  function ageLimitType() {
    const ageRestrictions = {
      none: KEY.none,
      eighteen: KEY.eighteen,
      twenty: KEY.twenty,
      mixed: KEY.mix,
    };

    const ageRestrictionKey = ageRestrictions[event.age_restriction];

    return (
      <tr>
        <td className={styles.table_element_left}>{t(KEY.common_age_limit).toUpperCase()}</td>
        <td className={styles.table_element_right}>{t(ageRestrictionKey)}</td>
      </tr>
    );
  }

  return (
    <table className={styles.table_container}>
      <tr>
        <td className={styles.table_element_left}> {t(KEY.common_venue).toUpperCase()} </td>
        <td className={styles.table_element_right}> {event.location} </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> {t(KEY.admin_organizer).toUpperCase()} </td>
        <td className={styles.table_element_right}> {event.host} </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> {t(KEY.common_date).toUpperCase()} </td>
        <td className={styles.table_element_right}>
          <TimeDisplay timestamp={event.start_dt} displayType="nice-date" />
        </td>
      </tr>
      <tr>
        <td className={styles.table_element_left}> {t(KEY.common_time).toUpperCase()} </td>
        <td className={styles.table_element_right}>
          <TimeDuration start={event.start_dt} end={event.end_dt} />
        </td>
      </tr>
      {ticketType()}
      {ageLimitType()}
    </table>
  );
}
