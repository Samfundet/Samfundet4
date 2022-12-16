import { useTranslation } from 'react-i18next';
import { TimeDisplay, Button, Link } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from './EventCard.module.scss';

type EventCardProps = {
  event: {
    title: string;
    venue: string;
    startTime: string;
    category: string;
    img: string;
  };
};
export function EventCard({ event }: EventCardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.eventCard}>
      <Link url={event.title}>
        <div className={styles.img} style={{ backgroundImage: `url(${event.img})` }} />
      </Link>
      <div className={styles.row}>
        <p>{`${event.category} // ${event.venue}`}</p>
        <TimeDisplay timestamp={event.startTime} />
      </div>
      <div className={styles.row}>
        <Link className={styles.title} url={event.title}>
          {event.title}
        </Link>
        <Button theme="samf" className={styles.button}>
          {t(KEY.common_buy)}
        </Button>
      </div>
    </div>
  );
}
