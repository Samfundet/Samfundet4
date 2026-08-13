import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { type HTMLAttributes, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Link, TimeDisplay } from '~/Components';
import { buttonThemes } from '~/Components/Button/utils';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { EventTicketType } from '~/types';
import { dbT, formatCurrency, getCheapestPrice, getEventCategoryKey, imageUrl } from '~/utils';
import styles from './EventCard.module.scss';
import {
  EventCardBanner,
  EventCardDetail,
  EventCardDetailContainer,
  EventCardDetailGroup,
  EventCardImage,
} from './components';

type Props = HTMLAttributes<HTMLDivElement> & {
  event: EventDto;
};

export function EventCard({ event, className, ...props }: Props) {
  const { t } = useTranslation(); // Necessary in order for dbT to work in this component

  const eventUrl = reverse({
    pattern: ROUTES_FRONTEND.event,
    urlParams: { id: event.id },
  });

  const banners = useMemo(() => {
    if (event.billig?.is_sold_out) {
      return <EventCardBanner theme="gray">{t(KEY.common_sold_out)}</EventCardBanner>;
    }
    if (event.billig?.is_almost_sold_out) {
      return <EventCardBanner theme="red">{t(KEY.common_almost_sold_out)}</EventCardBanner>;
    }

    return null;
  }, [event, t]);

  const callToActionButton = useMemo(() => {
    if (event.ticket_type === EventTicketType.FREE) {
      return (
        <Link url={eventUrl} plain className={buttonThemes.ghost}>
          {t(KEY.common_ticket_type_free)}
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
          {t(KEY.event_call_to_action_register)}
        </Link>
      );
    }

    if (!event.billig) {
      return (
        <Link url={eventUrl} plain className={buttonThemes.ghost}>
          {t(KEY.common_read_more)}
        </Link>
      );
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
    <div className={classNames(styles.event_card, className)} {...props}>
      <Link url={eventUrl} plain>
        <div className={styles.header}>
          {banners}
          <EventCardImage imageUrl={imageUrl(event.image, 'small')} />
        </div>
      </Link>

      <div className={styles.footer}>
        <Link url={eventUrl} plain className={styles.title}>
          {dbT(event, 'title')}
        </Link>

        <EventCardDetailContainer>
          <EventCardDetailGroup>
            <EventCardDetail>
              <Icon icon="mingcute:location-line" />
              {event.location}
            </EventCardDetail>
            <EventCardDetail>
              <Icon icon="material-symbols:category-outline-rounded" />
              {t(getEventCategoryKey(event.category))}
            </EventCardDetail>
          </EventCardDetailGroup>
          <EventCardDetailGroup>
            <EventCardDetail className={styles.time_detail}>
              <Icon icon="mingcute:time-line" />
              <TimeDisplay timestamp={event.start_dt} displayType="event-datetime" />
            </EventCardDetail>
          </EventCardDetailGroup>
        </EventCardDetailContainer>

        <div className={styles.ticket_row}>
          {cheapestPrice !== null && (
            <EventCardDetail className={styles.ticket_price}>
              <Icon icon="tabler:tag" />
              <span>
                {t(KEY.common_from)} {formatCurrency(cheapestPrice)}
              </span>
            </EventCardDetail>
          )}

          {callToActionButton}
        </div>
      </div>
    </div>
  );
}
