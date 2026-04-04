import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Link, NewBadge, TimeDisplay } from '~/Components';
import { buttonThemes } from '~/Components/Button/utils';
import eventPlaceholder from '~/assets/event_placeholder.jpg';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { EventTicketType } from '~/types';
import { backgroundImageFromUrl, dbT, getCheapestPrice, getEventCategoryKey } from '~/utils';
import styles from './EventCard.module.scss';

type Props = {
  event: EventDto;
  containerClassName?: string;
  useDateBadge?: boolean;
};

export function EventCard({ event, containerClassName, useDateBadge = true }: Props) {
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
    if (event.ticket_type === EventTicketType.FREE || event.ticket_type === EventTicketType.REGISTRATION) {
      return (
        <NewBadge theme="green" className={styles.badge}>
          {t(KEY.common_ticket_type_free)}
        </NewBadge>
      );
    }

    return null;
  }, [event, t]);

  const callToAction = useMemo(() => {
    if (event.ticket_type === EventTicketType.FREE) {
      return (
        <Link url={eventUrl} plain className={buttonThemes.success}>
          {t(KEY.common_ticket_type_free)}!
        </Link>
      );
    }
    if (event.ticket_type === EventTicketType.INCLUDED) {
      return (
        <Link url={eventUrl} plain className={buttonThemes.ghost}>
          {t(KEY.common_ticket_type_included)}
        </Link>
      );
    }
    if (event.ticket_type === EventTicketType.REGISTRATION) {
      return (
        <Link url={eventUrl} plain className={buttonThemes.primary}>
          Meld på
        </Link>
      );
    }

    if (!event.billig) {
      return null;
    }

    if (event.billig.is_sold_out) {
      return (
        <Button theme="success" disabled>
          {t(KEY.common_sold_out)}
        </Button>
      );
    }

    // TODO: open buy modal instead
    return (
      <Link url={eventUrl} plain className={buttonThemes.primary}>
        {t(KEY.common_buy_ticket)}
      </Link>
    );
  }, [event, eventUrl, t]);

  const cheapestPrice = getCheapestPrice(event);

  return (
    <div className={styles.event_card}>
      <Link url={eventUrl} plain>
        <div className={styles.header}>
          {event.billig?.is_almost_sold_out && (
            <div className={styles.few_tickets_banner}>
              <div>{t(KEY.common_almost_sold_out)}</div>
            </div>
          )}
          {useDateBadge && (
            <div className={styles.date_badge}>
              <TimeDisplay timestamp={event.start_dt} displayType="short-day-of-week" />
              <TimeDisplay timestamp={event.start_dt} displayType="short-day-month" />
            </div>
          )}
          <div className={styles.img_container}>
            <div style={backgroundImageFromUrl(imageUrl)} className={styles.image} />
          </div>
        </div>
      </Link>

      <div className={styles.footer}>
        <Link url={eventUrl} plain className={styles.title}>
          {dbT(event, 'title')}
        </Link>

        <div className={styles.details}>
          <div className={styles.detail}>
            <Icon icon="mingcute:time-line" />
            <TimeDisplay timestamp={event.start_dt} displayType={useDateBadge ? 'time' : 'event-datetime'} />
          </div>
          <div className={styles.detail}>
            <Icon icon="mingcute:location-line" />
            {event.location}
          </div>
          <div className={styles.detail}>
            <Icon icon="material-symbols:category-outline-rounded" />
            {t(getEventCategoryKey(event.category))}
          </div>
        </div>

        <div className={styles.ticket_row}>
          {cheapestPrice !== null && (
            <div className={classNames(styles.ticket_price, styles.detail)}>
              <Icon icon="tabler:tag" />
              {t(KEY.common_from)} {cheapestPrice},-
            </div>
          )}

          {callToAction}
        </div>
      </div>
    </div>
  );
}
