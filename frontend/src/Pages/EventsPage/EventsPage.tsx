import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsPage.module.scss';

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [dates, setDates] = useState<Date[]>([]);
  useEffect(() => {
    fetch('http://localhost:8000/samfundet/api/events/')
      .then((response) => response.json())
      .then((data) => {
        const events = data;
        setEvents(events);
        console.log(events);
        events.map((event: any) => {
          if (dates.indexOf(event.start_dt) < 0) {
            setDates((prevEvents) => [...prevEvents, event.start_dt]);
            console.log('Added date: ' + event.start_dt.toString());
          }
        });
      });
  }, [dates]);
  return (
    <div className={styles.container}>
      {dates.map((date: any) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <div className={styles.dates_container}>
            <div className={styles.events_container}>
              <h2> {date.toString()} </h2>
              {events.map((event: any) => {
                if (event.start_dt == date) {
                  {
                    console.log(event.title);
                  }
                  // eslint-disable-next-line react/jsx-key
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Link to={'/events/' + event.id}>
                      {' '}
                      <p> {event.title}</p>{' '}
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
