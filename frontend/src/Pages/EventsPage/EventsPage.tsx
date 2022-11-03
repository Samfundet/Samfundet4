import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsPage.module.scss';
import { ROUTES } from ':./../routes';
import { Event, monthNamesNo, weekDayNamesNo } from '../../types';

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [dates, setDates] = useState<string[]>([]);
  // check if dates are equal
  const compareDates = (event_date: Date, array_date: string) => {
    let is_similar = false;
    const event_date_str = event_date.toISOString();
    if (event_date_str.includes(array_date)) is_similar = true;
    return is_similar;
  };
  // get date on format hh.mm
  const getTimeStr = (date: Date) => {
    return (date.getHours() + '.' + date.getMinutes()).toString();
  };
  useEffect(() => {
    fetch(ROUTES.backend.events)
      .then((response) => response.json())
      .then((data) => {
        const events = data;
        setEvents(events);
        const dates_arr: string[] = [];
        events.map((event: Event) => {
          const dateStr = event.start_dt.toISOString().split('T')[0]; // format: YYYY-MM-DD
          if (dates_arr.indexOf(dateStr) == -1) {
            dates_arr.push(dateStr);
          }
        });
        setDates(dates_arr);
      });
  }, []);
  return (
    <div className={styles.container}>
      {dates.map((date_str: string, index: number) => {
        const date: Date = new Date(date_str);
        const month: number = date.getMonth();
        const day_week: number = date.getDay();
        const day_month: number = date.getDate();

        return (
          <div key={index} className={styles.dates_container}>
            <h2>{weekDayNamesNo[day_week] + ' ' + day_month + '.' + monthNamesNo[month]}</h2>
            {events.map((event: Event, index: number) => {
              if (compareDates(event.start_dt, date_str)) {
                return (
                  <div className={styles.events_container} key={index}>
                    {' '}
                    <div className={styles.event_row}>
                      <div className={styles.column_title}>
                        <Link to={'/events/' + event.id}>
                          <p> {event.title_no}</p>{' '}
                        </Link>
                      </div>
                      <div className={styles.column_area_time}>
                        <div className={styles.time_wrapper}>
                          <p>{getTimeStr(event?.start_dt) + ' - ' + getTimeStr(event?.end_dt)}</p>
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
    </div>
  );
}
