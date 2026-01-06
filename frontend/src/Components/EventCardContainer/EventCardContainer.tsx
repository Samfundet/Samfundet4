import classNames from 'classnames';
import { EventCard, H4 } from '~/Components';
import type { EventDto } from '~/dto';
import styles from './EventCardContainer.module.scss';

type Props = {
  events: EventDto[];
  title?: string;
  squareCards?: boolean;
};

export function EventCardContainer({ events, title, squareCards = false }: Props) {
  return (
    <div className={styles.wrapper}>
      {title && <H4>{title}</H4>}
      <div className={styles.container}>
        {events.map((event) => (
          <EventCard
            event={event}
            key={event.id}
            containerClassName={styles.card_container}
            squareCard={squareCards}
            cardClassName={classNames({ [styles.card]: !squareCards })}
            titleClassName={styles.card_title}
          />
        ))}
      </div>
    </div>
  );
}
