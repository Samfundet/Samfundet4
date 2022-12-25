import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { kitteh } from '~/assets';
import { TimeDisplay, Button, Link } from '~/Components';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './EventCard.module.scss';

type EventCardProps = {
  event: EventDto;
  className?: string;
};
export function EventCard({ event, className }: EventCardProps) {
  const { t } = useTranslation();
  classNames;
  return (
    <div className={classNames(styles.eventCard, className)}>
      <Link className={styles.eventCard} url={reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })}>
        <div className={styles.img} style={{ backgroundImage: `url(${kitteh})` }} />
      </Link>
      <div className={styles.row}>
        <p>{`${event.event_group.name} // ${event.location}`}</p>
        <TimeDisplay timestamp={event.start_dt} />
      </div>
      <div className={styles.row}>
        <h3 className={styles.title}>{event.title_no}</h3>
        <Button theme="samf" display="pill">
          {t(KEY.common_buy)}
        </Button>
      </div>
    </div>
  );
}
