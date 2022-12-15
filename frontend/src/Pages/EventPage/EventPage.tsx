import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EventPage.module.scss';
import { EventTable } from './components/EventTable';
import { getEvent } from '~/api';
import { EventDto } from '~/dto';
import { SamfundetLogoSpinner } from '~/Components';

export function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  useEffect(() => {
    getEvent(id).then((data) => {
      setEvent(data);
      setShowSpinner(false);
    });
  }, [id]);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
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
  );
}
