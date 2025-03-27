import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Page } from '~/Components';
import { BuyButton } from '~/Components/BuyButton/BuyButton';
import { BuyTicketModal } from '~/Components/BuyTicketModal';
import { getEvent } from '~/api';
import type { EventDto } from '~/dto';
import { useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { Splash } from '../HomePage/components/Splash/Splash';
import styles from './EventPage.module.scss';
import { EventTable } from './components/EventTable';

export function EventPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventDto>();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);

  useTitle((event && dbT(event, 'title')) || t(KEY.common_event));

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
            navigate(ROUTES.frontend.not_found, { replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }, [id]);

  return (
    <Page className={styles.container} loading={showSpinner}>
      {/* TODO splash should be its own component rather than homepage subcomponent */}
      <Splash events={event && [event]} />
      <div className={styles.text_title}>{dbT(event, 'title')}</div>
      <div className={styles.content_row}>
        {/* Info table */}
        <div className={styles.info_list}>{event && <EventTable event={event} />}</div>
        {event?.billig && (
          <>
            <BuyButton
              eventId={event.id}
              billigId={event.billig.id}
              ticketSaleState={event.billig.ticket_groups}
              onClick={() => setShowModal(true)}
            />
            <BuyTicketModal event={event} isOpen={showModal} onClose={() => setShowModal(false)} />
          </>
        )}
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
    </Page>
  );
}
