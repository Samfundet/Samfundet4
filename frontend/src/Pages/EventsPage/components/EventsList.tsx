import { Link } from 'react-router-dom';
import { TimeDisplay } from '~/Components';
import { EventDto } from '~/dto';
import styles from './EventsList.module.scss';

type EventsListProps = {
  event_list: Object;
};

function getTimeStr(str) {
  return "";
}
export function EventsList({ events }: EventsListProps) {
  /** check if dates are equal */
  return (
    <div className={styles.container}>
      {Object.keys(events).map(function (date_str: string, key: number) {
        return (
          <div key={key} className={styles.dates_container}>
            <TimeDisplay timestamp={date_str}/>
            {events[date_str].map(function (event: EventDto, key: number) {
              return (
                <div className={styles.events_container} key={key}>
                  <div className={styles.event_row}>
                    <div className={styles.column_title}>
                      <Link to={'/events/' + event.id}>
                        <p> {event.title_no}</p>
                      </Link>
                    </div>
                    <div className={styles.column_area_time}>
                      <div className={styles.time_wrapper}>
                        <p>{`${getTimeStr(event?.start_dt)} - ${getTimeStr(event?.end_dt)}`}</p>
                      </div>
                      <p> {event?.location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * {date_list.map((date_str: string, index: number) => {
        const date: Date = new Date(date_str);
        const month: string = date.toLocaleDateString('no', { month: 'long' });
        const weekday: string = date.toLocaleDateString('no', { weekday: 'long' });
        const monthday: number = date.getDate();

        return (
          <div key={index} className={styles.dates_container}>
            <h2 className={styles.date_header}>{weekday + ' ' + monthday + '.' + month}</h2>
            {event_list.map((event: Event, index: number) => {
              if (compareDates(event.start_dt, date_str)) {
                return (
                  <div className={styles.events_container} key={index}>
                    <div className={styles.event_row}>
                      <div className={styles.column_title}>
                        <Link to={'/events/' + event.id}>
                          <p> {event.title_no}</p>
                        </Link>
                      </div>
                      <div className={styles.column_area_time}>
                        <div className={styles.time_wrapper}>
                          <p>{`${getTimeStr(event?.start_dt)} - ${getTimeStr(event?.end_dt)}`}</p>
                        </div>
                        <p> {event?.location}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );
      })}
 */
