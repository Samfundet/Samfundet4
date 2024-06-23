import { useTranslation } from 'react-i18next';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { EventTicketType } from '~/types';
import { dbT, getTicketTypeKey } from '~/utils';
import styles from './TicketTypeRow.module.scss';

type TicketTypeRowProps = {
  event: EventDto;
};

export function TicketTypeRow({ event }: TicketTypeRowProps) {
  const { t } = useTranslation();

  if (event.ticket_type !== EventTicketType.CUSTOM) {
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
