import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Block,
  BlockContainer,
  BlockFooter,
  BlockHeader,
  BlockImage,
  BlockTitle,
  NewBadge,
  TimeDisplay,
} from '~/Components';
import eventPlaceholder from '~/assets/event_placeholder.jpg';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { EventTicketType } from '~/types';
import { dbT, getEventCategoryKey } from '~/utils';
import styles from './EventCard.module.scss';

type Props = {
  event: EventDto;
  containerClassName?: string;
};

export function EventCard({ event, containerClassName }: Props) {
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
    if (
      event.ticket_type === EventTicketType.FREE ||
      event.ticket_type === EventTicketType.INCLUDED ||
      event.ticket_type === EventTicketType.REGISTRATION // TODO: make own CTA for registrations, something like "Sign up now!"
    ) {
      return null;
    }
    if (!event.billig) return null;
    if (event.billig.is_sold_out) return null;

    // TODO: implement more comprehensive CTA logic here

    return (
      <a href={eventUrl} className={styles.call_to_action}>
        {t(KEY.common_buy_ticket)}
        <Icon icon="mingcute:arrow-up-line" width={16} rotate={1} />
      </a>
    );
  }, [event, eventUrl, t]);

  return (
    <BlockContainer className={containerClassName}>
      <Block square={false}>
        <a href={eventUrl} tabIndex={-1}>
          <BlockHeader gradient={badges !== null}>{badges}</BlockHeader>
          <BlockFooter className={styles.footer} gradient={callToAction !== null}>
            {callToAction}
          </BlockFooter>
          <BlockImage src={imageUrl} />
        </a>
      </Block>
      <BlockTitle>
        <a href={eventUrl}>{dbT(event, 'title')}</a>
      </BlockTitle>
      <div className={styles.details}>
        <div>
          {t(getEventCategoryKey(event.category))} // {event.location}
        </div>
        <TimeDisplay timestamp={event.start_dt} displayType="event-datetime" />
      </div>
    </BlockContainer>
  );
}
