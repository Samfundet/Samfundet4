import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { getEvent } from '~/api';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import { Splash } from '../HomePage/components/Splash/Splash';
import styles from './EventPage.module.scss';
import { EventTable } from './components/EventTable';

export function EventPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      getEvent(id)
        .then((data) => {
          setEvent(data);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Splash className={classNames(styles.splash_fade)} events={event && [event]} showButtons={false} size="small" />
      <div className={styles.content_row}>
        <div className={styles.text_title}>{dbT(event, 'title')}</div>
        <div className={styles.description_short}>{dbT(event, 'description_short')}</div>
        <div className={styles.text_container}>
          <div>
            <div className={styles.info_list}>{event && <EventTable event={event} />}</div>
            <button>KNAPP🌷</button>
          </div>
          <div className={styles.description_long}>
            <p>{dbT(event, 'description_long')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
