import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/Components';
import { BuyEventTicket } from '~/Components/BuyEventTicket/BuyEventTicket';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { EventTicketType } from '~/types';
import { dbT, getTicketTypeKey } from '~/utils';
import { getEventAgeRestrictionKey } from '../AgeLimitRow/utils';
import styles from './EventInformation.module.scss';

type EventInformationProps = {
  event: EventDto;
};

export function EventInformation({ event }: EventInformationProps) {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const date = new Date(event.start_dt);
  const locale = i18n.language === 'nb' ? 'nb-NO' : 'en-US';
  const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date).replace('.', '');
  const fullDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);
  const startTime = new Intl.DateTimeFormat('nb-NO', { hour: '2-digit', minute: '2-digit' }).format(date);
  const endTime = new Intl.DateTimeFormat('nb-NO', { hour: '2-digit', minute: '2-digit' }).format(
    new Date(event.end_dt),
  );
  const doorsTime = event.doors_time?.split(':').slice(0, 2).join(':');
  const ticketPrices = event.billig?.ticket_groups.flatMap((group) => group.price_groups) ?? [];

  async function shareEvent() {
    const shareData = { title: dbT(event, 'title'), url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // The native share dialog may be dismissed without sharing.
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
    }
  }

  return (
    <div className={styles.event_information_wrapper}>
      <div className={styles.date_row}>
        <div className={styles.date_tile} aria-hidden="true">
          <span>{month}</span>
          <strong>{date.getDate()}</strong>
        </div>
        <div className={styles.date_details}>
          <strong>{fullDate}</strong>
          <span>
            {startTime}–{endTime}
            {doorsTime && ` · ${t(KEY.common_doors_date).toLowerCase()} ${doorsTime}`}
          </span>
        </div>
      </div>

      <div className={styles.ticket_action}>
        {event.billig && <BuyEventTicket event={event} ticketSaleState={event.billig} className={styles.buy_button} />}
        {!event.billig && event.registration_url && (
          <a className={styles.registration_button} href={event.registration_url} target="_blank" rel="noreferrer">
            {t(KEY.common_ticket_type_registration)}
          </a>
        )}
        <Button theme="secondary" className={styles.share_button} onClick={shareEvent}>
          <Icon icon="mdi:share-variant-outline" />
          {copied ? t(KEY.common_link_copied) : t(KEY.common_share)}
        </Button>
      </div>

      <div className={styles.detail_row}>
        <Icon icon="mdi:map-marker" className={styles.detail_icon} />
        <div>
          <span className={styles.detail_label}>{t(KEY.common_venue)}</span>
          <span>{event.location}</span>
        </div>
      </div>

      <div className={styles.detail_row}>
        <Icon icon="mdi:ticket" className={styles.detail_icon} />
        <div>
          <span className={styles.detail_label}>{t(KEY.common_ticket)}</span>
          {event.ticket_type === EventTicketType.CUSTOM && event.custom_tickets.length > 0 ? (
            event.custom_tickets.map((ticket) => (
              <span key={ticket.id}>{`${dbT(ticket, 'name')} · ${ticket.price} kr`}</span>
            ))
          ) : ticketPrices.length > 0 ? (
            ticketPrices.map((price) => <span key={price.id}>{`${price.name} · ${price.price} kr`}</span>)
          ) : (
            <span>{t(getTicketTypeKey(event.ticket_type))}</span>
          )}
        </div>
      </div>

      <div className={styles.detail_row}>
        <Icon icon="mdi:card-account-details" className={styles.detail_icon} />
        <div>
          <span className={styles.detail_label}>{t(KEY.common_age_limit)}</span>
          <span>{t(getEventAgeRestrictionKey(event.age_restriction))}</span>
        </div>
      </div>

      <div className={styles.detail_row}>
        <Icon icon="mdi:account-group" className={styles.detail_icon} />
        <div>
          <span className={styles.detail_label}>{t(KEY.admin_organizer)}</span>
          <span>{event.host}</span>
        </div>
      </div>
    </div>
  );
}
