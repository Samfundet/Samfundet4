import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { kitteh } from '~/assets';
import { TimeDisplay, Button, Link } from '~/Components';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './EventSlip.module.scss';

type EventSlipProps = {
  event: EventDto;
  className?: string;
};
export function EventSlip({ event, className }: EventSlipProps) {
  const { t } = useTranslation();

  return (
    <div className={classNames(styles.container, className)}>
      <Link className={styles.imgContainer} url={reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })}>
        <div className={styles.img} style={{ backgroundImage: `url(${kitteh})` }}></div>
      </Link>
      <div className={styles.info}>
        <div className={styles.row}>
          <p>{`${event.event_group.name} // ${event.location}`}</p>
          <TimeDisplay timestamp={event.start_dt} displayType="nice-datetime" />
        </div>
        <div className={styles.row}>
          <h3 className={styles.title}>{event.title_no}</h3>
          <Button theme="darksamf" display="pill" className={styles.button}>
            {t(KEY.common_buy)}
          </Button>
        </div>
      </div>
    </div>
  );
}
