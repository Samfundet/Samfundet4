import { Text, TimeDisplay } from '~/Components';
import styles from './EventTimeLocation.module.scss';

type EventTimeLocationProps = {
  eventStart: string;
  eventEnd: string;
  eventLocation: string;
  isDesktop: boolean;
};

export function EventTimeLocation({ eventStart, eventEnd, eventLocation, isDesktop }: EventTimeLocationProps) {
  return (
    <div className={styles.event_time_wrapper}>
      <Text as="strong">{eventLocation}</Text>
      <div className={styles.event_time}>
        <TimeDisplay timestamp={eventStart} displayType="time" />
        -
        <TimeDisplay timestamp={eventEnd} displayType="time" />
      </div>
    </div>
  );
}
