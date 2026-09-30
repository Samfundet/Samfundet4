import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
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

type ShareFeedback = 'copied' | 'shared' | 'unavailable';

export function EventInformation({ event }: EventInformationProps) {
  const { t, i18n } = useTranslation();
  const [shareFeedback, setShareFeedback] = useState<{ kind: ShareFeedback; id: number } | null>(null);
  const date = new Date(event.start_dt);
  const locale = i18n.language === 'nb' ? 'nb-NO' : 'en-US';
  const fullDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);
  const shortMonth = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date).replace('.', '').toLowerCase();
  const startTime = new Intl.DateTimeFormat('nb-NO', { hour: '2-digit', minute: '2-digit' }).format(date);
  const endTime = new Intl.DateTimeFormat('nb-NO', { hour: '2-digit', minute: '2-digit' }).format(
    new Date(event.end_dt),
  );
  const doorsTime = event.doors_time?.split(':').slice(0, 2).join(':');
  const ticketPrices = event.billig?.ticket_groups.flatMap((group) => group.price_groups) ?? [];

  useEffect(() => {
    if (!shareFeedback) return;
    const timeout = window.setTimeout(() => setShareFeedback(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [shareFeedback]);

  function showShareFeedback(feedback: ShareFeedback) {
    setShareFeedback((previous) => ({ kind: feedback, id: (previous?.id ?? 0) + 1 }));
  }

  async function shareEvent() {
    const shareData = { title: dbT(event, 'title'), url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showShareFeedback('shared');
      } catch {
        // The native share dialog may be dismissed without sharing.
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        showShareFeedback('copied');
      } catch {
        showShareFeedback('unavailable');
      }
    } else {
      showShareFeedback('unavailable');
    }
  }

  const shareLabel =
    shareFeedback?.kind === 'copied'
      ? t(KEY.common_link_copied)
      : shareFeedback?.kind === 'shared'
        ? t(KEY.common_shared)
        : shareFeedback?.kind === 'unavailable'
          ? t(KEY.common_share_unavailable)
          : t(KEY.common_share);

  return (
    <section className={styles.information_card}>
      <div className={styles.date_header}>
        <div className={styles.date_badge} aria-hidden="true">
          <span>{shortMonth}</span>
          <strong>{date.getDate()}</strong>
        </div>
        <div className={styles.date_summary}>
          <time dateTime={event.start_dt} className={styles.full_date}>
            {fullDate}
          </time>
          <span className={styles.time_summary}>
            {startTime}–{endTime}
            {doorsTime && ` · ${t(KEY.common_doors_date)} ${doorsTime}`}
          </span>
        </div>
      </div>

      <div className={styles.details_list}>
        <div className={styles.detail}>
          <div className={styles.detail_icon}>
            <Icon icon="mdi:map-marker" />
          </div>
          <div className={styles.detail_content}>
            <span className={styles.detail_label}>{t(KEY.common_venue)}</span>
            <span>{event.location}</span>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={styles.detail_icon}>
            <Icon icon="mdi:ticket" />
          </div>
          <div className={styles.detail_content}>
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
        <div className={styles.detail}>
          <div className={styles.detail_icon}>
            <Icon icon="mdi:calendar-blank-outline" />
          </div>
          <div className={styles.detail_content}>
            <span className={styles.detail_label}>{t(KEY.common_age_limit)}</span>
            <span>{t(getEventAgeRestrictionKey(event.age_restriction))}</span>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={styles.detail_icon}>
            <Icon icon="mdi:account-group-outline" />
          </div>
          <div className={styles.detail_content}>
            <span className={styles.detail_label}>{t(KEY.admin_organizer)}</span>
            <span>{event.host}</span>
          </div>
        </div>
      </div>

      <div className={styles.ticket_actions}>
        {event.billig && <BuyEventTicket event={event} ticketSaleState={event.billig} className={styles.buy_button} />}
        {!event.billig && event.registration_url && (
          <a className={styles.registration_button} href={event.registration_url} target="_blank" rel="noreferrer">
            {t(KEY.common_ticket_type_registration)}
          </a>
        )}
        <Button theme="secondary" className={styles.share_button} onClick={shareEvent}>
          <Icon icon="mdi:arrow-top-right" />
          <span
            key={shareFeedback?.id ?? 0}
            className={shareFeedback ? styles.share_feedback : undefined}
            aria-live="polite"
          >
            {shareLabel}
          </span>
        </Button>
      </div>
    </section>
  );
}
