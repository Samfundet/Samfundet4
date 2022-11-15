import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EventPage.module.scss';
import { Event } from '~/types';
import { ROUTES } from '~/routes';
import { EventTable } from './components/EventTable';

export function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event>();
  useEffect(() => {
    const url = ROUTES.backend.samfundet__events_detail + id;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const event = data;
        setEvent(event);
      });
  }, [id]);
  return (
    <>
      {event ? (
        <div className={styles.container}>
          <div>
            <img id="banner-link"></img>
          </div>
          <div className={styles.container_list}>
            <EventTable event={event} />
          </div>
          <div className={styles.description}>
            <p className={styles.text_title}> DESCRIPTION </p>
            <div className={styles.description}>
              <div className={styles.description_short}>
                <p className={styles.text_short}>{event?.description_short_no}</p>
              </div>
              <div className={styles.description_long}>
                <p> {event?.description_long_no}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      ;
    </>
  );
}
