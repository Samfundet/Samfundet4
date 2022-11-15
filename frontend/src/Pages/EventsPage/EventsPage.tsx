import { useEffect, useState } from 'react';
import styles from './EventsPage.module.scss';
import { ROUTES } from '~/routes';
import { Event } from '~/types';
import { EventsList } from './components/EventsList';

/** get date on format hh.mm */
export function getTimeStr(date: Date) {
  return (date.getHours() + '.' + date.getMinutes()).toString();
}

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [dates, setDates] = useState<string[]>([]);
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
    <div className={styles.root_container}>
      <EventsList event_list={events} date_list={dates} />
    </div>
  );
}
