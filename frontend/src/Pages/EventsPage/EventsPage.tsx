import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsPage.module.scss';

const monthNames = [
  'Januar',
  'Februar',
  'Mars',
  'April',
  'May',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [dates, setDates] = useState<string[]>([]);
  useEffect(() => {
    fetch('http://localhost:8000/samfundet/api/events/')
      .then((response) => response.json())
      .then((data) => {
        const events = data;
        setEvents(events);
        const dates_arr: string[] = [];
        events.map((event: any) => {
          const dateStr =
            event.start_dt.toString().split('-')[1] + '-' + event.start_dt.toString().split('-')[2].split('T')[0];
          if (dates_arr.indexOf(dateStr) == -1) {
            dates_arr.push(dateStr);
          }
        });
        setDates(dates_arr);
      });
  }, []);
  return (
    <div className={styles.container}>
      {dates.map((date: string) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <div className={styles.dates_container}>
            <div className={styles.events_container}>
              <h2>{date.split('-')[1] + '. ' + monthNames[Number(date.split('-')[0]) - 1]}</h2>
              {events.map((event: any) => {
                if (
                  event.start_dt.toString().split('-')[1] +
                    '-' +
                    event.start_dt.toString().split('-')[2].split('T')[0] ==
                  date
                ) {
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
