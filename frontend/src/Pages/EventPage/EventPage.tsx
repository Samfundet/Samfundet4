import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { getEvent } from '~/api';
import type { EventDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { Splash } from '../HomePage/components/Splash/Splash';
import styles from './EventPage.module.scss';
import { EventTable } from './components/EventTable';

export function EventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (id) {
      getEvent(id)
        .then((data) => {
          setEvent(data);
          setShowSpinner(false);
        })
        .catch((error) => {
          if (error.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.not_found);
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
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
      {/* TODO splash should be its own component rather than homepage subcomponent */}
      <Splash events={event && [event]} />
      <div className={styles.text_title}>{dbT(event, 'title')}</div>
      <div className={styles.content_row}>
        {/* Info table */}
        <div className={styles.info_list}>{event && <EventTable event={event} />}</div>

        {/* Text */}
        <div className={styles.text_container}>
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
    </div>
  );
}
