import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { ExpandableHeader, H1, Image, Page } from '~/Components';
import { BuyButton } from '~/Components/BuyButton/BuyButton';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { getEvent } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './EventPage.module.scss';
import { EventInformation } from './components/EventInformation/EventInformation';
import { EventTable } from './components/EventTable';

export function EventPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventDto>();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

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
      <div className={styles.image_wrapper}>
        {event && <Image src={BACKEND_DOMAIN + event.image_url} className={styles.event_image} />}
      </div>

      <H1 className={styles.text_title}>{dbT(event, 'title')}</H1>
      <div className={styles.content_row}>
        {event && <EventInformation event={event} />}
        {event?.billig && (
          <BuyButton ticketSaleState={event.billig.ticket_groups} eventId={event.id} billigId={event.billig.id} />
        )}
        {/* Text */}
        <div className={styles.text_container}>
          <div className={styles.description}>
            <div className={styles.description_short}>
              <p className={styles.text_short}>{dbT(event, 'description_short')}</p>
            </div>
            <div className={styles.description_long}>
              <SamfMarkdown>{dbT(event, 'description_long')}</SamfMarkdown>
            </div>
          </div>
          <ExpandableHeader label={t(KEY.common_details)} className={styles.expandable_header}>
            {/* Info table */}
            <div className={styles.info_list}>{event && <EventTable event={event} />}</div>
          </ExpandableHeader>
        </div>
      </div>
    </Page>
  );
}
