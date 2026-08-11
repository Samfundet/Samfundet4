import { EventCard, H4, Skeleton } from '~/Components';
import type { EventDto } from '~/dto';
import styles from './EventCardContainer.module.scss';

type Props = {
  events: EventDto[];
  title?: string;
  skeletonCount?: number;
};

export function EventCardContainer({ events, title, skeletonCount }: Props) {
  return (
    <div className={styles.wrapper}>
      {title && <H4>{title}</H4>}

      {!events.length && skeletonCount && (
        <>
          <Skeleton width="14rem" height="2rem" marginBottom="0.5rem" />
          <div className={styles.container}>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value we can use here
              <Skeleton key={i} height="250px" width="330px" className={styles.card_container} />
            ))}
          </div>
        </>
      )}

      <div className={styles.container}>
        {events.map((event) => (
          <EventCard event={event} key={event.id} className={styles.card_container} />
        ))}
      </div>
    </div>
  );
}
