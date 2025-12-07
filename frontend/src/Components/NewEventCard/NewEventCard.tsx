import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { NewBadge } from '~/Components';
import type { EventDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { dbT } from '~/utils';
import styles from './NewEventCard.module.scss';
import { BACKEND_DOMAIN } from "~/constants";
import { useMemo } from "react";
import eventPlaceholder from '~/assets/event_placeholder.jpg';

type Props = {
  event: EventDto;
};

export function NewEventCard({ event }: Props) {
  useTranslation(); // Necessary in order for dbT to work in this component

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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <a href={eventUrl} className={styles.card_inner}>
          <div className={styles.card_info}>
            <NewBadge theme="red" className={styles.badge}>
              <Icon icon="humbleicons:exclamation" />
              Snart utsolgt
            </NewBadge>
          </div>
          <div className={styles.card_info}>
            <div>22. aug kl. 23:59</div>
            <a href={eventUrl} className={styles.call_to_action}>
              Kjøp billett
              <Icon icon="line-md:arrow-up" width={16} rotate={1} />
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
