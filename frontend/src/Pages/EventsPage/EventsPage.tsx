import { useEffect, useState } from 'react';
import styles from './EventsPage.module.scss';

export function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/samfundet/api/events')
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.dates_container}>
        <div className={styles.events_container}>
          <p>jdsjdksj</p>
        </div>
        <div className={styles.events_container}></div>
        <div className={styles.events_container}></div>
      </div>
    </div>
  );
}
