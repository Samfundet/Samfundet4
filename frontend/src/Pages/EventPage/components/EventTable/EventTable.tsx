import { useTranslation } from 'react-i18next';
import { TimeDisplay, TimeDuration } from '~/Components';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { AgeLimitRow } from '../AgeLimitRow';
import { TicketTypeRow } from '../TicketTypeRow';
import styles from './EventTable.module.scss';

type EventTableProps = {
  event: EventDto;
};

export function EventTable({ event }: EventTableProps) {
  const { t } = useTranslation();

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
      <TicketTypeRow event={event} />
      <AgeLimitRow event={event} />
    </table>
  );
}
