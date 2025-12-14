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
      return <NewBadge theme="gray">{t(KEY.common_sold_out)}</NewBadge>;
    }
    if (event.billig?.is_almost_sold_out) {
      return (
        <NewBadge theme="red">
          <Icon icon="humbleicons:exclamation" />
          {t(KEY.common_almost_sold_out)}
        </NewBadge>
      );
    }
    if (event.ticket_type === EventTicketType.FREE || event.ticket_type === EventTicketType.REGISTRATION) {
      return <NewBadge theme="blue">{t(KEY.common_ticket_type_free)}</NewBadge>;
    }

    return null;
  }, [event, t]);

  const callToAction = useMemo(() => {
    if (!event.billig) return null;
    if (event.billig.is_sold_out) return null;

    // TODO: implement actual CTA logic here

    return (
      <a href={eventUrl} className={styles.call_to_action}>
        {t(KEY.common_buy_ticket)}
        <Icon icon="line-md:arrow-up" width={16} rotate={1} />
      </a>
    );
  }, [event, eventUrl, t]);

  return (
    <BlockContainer className={styles.event_card}>
      <Block>
        <a href={eventUrl} tabIndex={-1}>
          <BlockHeader gradient>{badges}</BlockHeader>
          <BlockFooter className={styles.footer} gradient>
            <div>
              <TimeDisplay timestamp={event.start_dt} displayType="event-datetime" />
              <div className={styles.category_and_location}>
                {event.category} // {event.location}
              </div>
            </div>
            {callToAction}
          </BlockFooter>
          <BlockImage src={imageUrl} />
        </a>
      </Block>
      <BlockTitle>
        <a href={eventUrl}>{dbT(event, 'title')}</a>
      </BlockTitle>
    </BlockContainer>
  );
}
