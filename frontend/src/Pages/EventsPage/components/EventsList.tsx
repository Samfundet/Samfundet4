import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, TimeDisplay } from '~/Components';
import { TimeDuration } from '~/Components/TimeDuration';
import { EventDto } from '~/dto';
import { dbT } from '~/i18n/i18n';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './EventsList.module.scss';

type EventsListProps = {
  events: unknown;
};

export function EventsList({ events }: EventsListProps) {
  /** check if dates are equal */
  const { i18n } = useTranslation();
  return (
    <div className={styles.container}>
      {Object.keys(events).map(function (date_str: string, key: number) {
        return (
          <div key={key} className={styles.dates_container}>
            <div className={styles.dateHeader}>
              <TimeDisplay className={styles.dateHeaderText} timestamp={date_str} displayType="nice-date" />
            </div>
            <div className={styles.events_container}>
              {events[date_str].map(function (event: EventDto, key: number) {
                return (
                  <div key={key} className={styles.event_row}>
                    <div className={styles.column_title}>
                      <Link
                        to={reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })}
                        className={styles.link}
                      >
                        {dbT(event, 'title', i18n.language)}
                      </Link>
                    </div>
                    <div className={styles.column_area_time}>
                      <div>
                        <TimeDuration start={event.start_dt} end={event.end_dt} />
                      </div>
                      <p>{event?.location}</p>
                    </div>
                    <div className={styles.column_price}>
                      <p>{event?.price_group}</p>
                    </div>
                    <div className={styles.column_buy}>
                      <Button theme="samf">Kjøp</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
