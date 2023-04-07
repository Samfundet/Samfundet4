import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SamfundetLogoSpinner } from '~/Components';
import { getEvent } from '~/api';
import { EventDto } from '~/dto';
import { dbT } from '~/utils';
import styles from './EventPage.module.scss';
import { EventTable } from './components/EventTable';

export function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      getEvent(id).then((data) => {
        setEvent(data);
        setShowSpinner(false);
      });
    }
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
      <div className={styles.container_list}>{event && <EventTable event={event} />}</div>
      <div className={styles.description}>
        <p className={styles.text_title}> DESCRIPTION </p>
        <div className={styles.description}>
          <div className={styles.description_short}>
            <p className={styles.text_short}>{dbT(event, 'description_short')}</p>
          </div>
          <div className={styles.description_long}>
            <p>{dbT(event, 'description_long')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
