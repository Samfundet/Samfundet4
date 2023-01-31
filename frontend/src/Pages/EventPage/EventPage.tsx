import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EventPage.module.scss';
import { dbT } from '~/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { EventTable } from './components/EventTable';
import { getEvent } from '~/api';
import { EventDto } from '~/dto';
import { SamfundetLogoSpinner } from '~/Components';

export function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { i18n } = useTranslation();

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
            <p className={styles.text_short}>{dbT(event, 'description_short', i18n.language)}</p>
          </div>
          <div className={styles.description_long}>
            <p>{dbT(event, 'description_long', i18n.language)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
