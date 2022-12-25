import { Link } from 'react-router-dom';
import { Button, EventCard, EventSlip, TimeDisplay } from '~/Components';
import { TimeDuration } from '~/Components/TimeDuration';
import { EventDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './EventsBoxes.module.scss';

type EventsBoxesProps = {
  events: unknown;
};

export function EventsBoxes({ events }: EventsBoxesProps) {
  /** check if dates are equal */
  return (
    <div className={styles.container}>
      {Object.keys(events).map(function (date_str: string, key: number) {
        return (
          <div key={key} className={styles.dates_container}>
            <div className={styles.dateHeader}>
              <TimeDisplay className={styles.dateHeaderText} timestamp={date_str} displayType="nice-date" />
            </div>
            <div className={styles.eventBoxes}>
            {events[date_str].map(function (event: EventDto, key: number) {
              return <EventSlip event={event} />
            })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
