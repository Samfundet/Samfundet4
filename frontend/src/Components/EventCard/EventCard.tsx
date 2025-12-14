import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NewBadge, TimeDisplay } from '~/Components';
import eventPlaceholder from '~/assets/event_placeholder.jpg';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { EventTicketType } from '~/types';
import { dbT } from '~/utils';
import styles from './EventCard.module.scss';

type Props = {
  event: EventDto;
};

export function EventCard({ event }: Props) {
  const { t } = useTranslation(); // Necessary in order for dbT to work in this component

  const eventUrl = reverse({
    pattern: ROUTES_FRONTEND.event,
    urlParams: { id: event.id },
  });

  const imageUrl = useMemo(() => {
    if (event.image_url) {
      if (event.image_url.startsWith('http')) {
        return event.image_url;
      }
      return BACKEND_DOMAIN + event.image_url;
    }
    return eventPlaceholder;
  }, [event]);

  const badges = useMemo(() => {
    if (event.billig?.is_sold_out) {
      return (
        <NewBadge theme="gray" className={styles.badge}>
          {t(KEY.common_sold_out)}
        </NewBadge>
      );
    }
    if (event.billig?.is_almost_sold_out) {
      return (
        <NewBadge theme="red" className={styles.badge}>
          <Icon icon="humbleicons:exclamation" />
          {t(KEY.common_almost_sold_out)}
        </NewBadge>
      );
    }
    if (event.ticket_type === EventTicketType.FREE) {
      return (
        <NewBadge theme="blue" className={styles.badge}>
          {t(KEY.common_ticket_type_free)}
        </NewBadge>
      );
    }

    return null;
  }, [event, t]);

  const callToAction = useMemo(() => {
    if (!event.billig) return null;
    if (event.billig.is_sold_out) return null;

    // TODO: implement actual CTA logic here

    return (
      <>
        {t(KEY.common_buy_ticket)}
        <Icon icon="line-md:arrow-up" width={16} rotate={1} />
      </>
    );
  }, [event, t]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <a href={eventUrl} className={styles.card_inner}>
          <div className={styles.card_info}>{badges}</div>
          <div className={styles.card_info}>
            <div>
              <TimeDisplay timestamp={event.start_dt} displayType="event-datetime" />
              <div className={styles.location}>{event.location}</div>
            </div>
            <a href={eventUrl} className={styles.call_to_action}>
              {callToAction}
            </a>
          </div>
        </a>
        <div className={styles.gradient_overlay} />
        <div className={styles.image_container}>
          <img src={imageUrl} className={styles.image} alt="" />
        </div>
      </div>

      <a href={eventUrl} className={styles.title}>
        {dbT(event, 'title')}
      </a>
    </div>
  );
}
