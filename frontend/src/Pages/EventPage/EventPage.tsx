import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ExpandableHeader, ExternalHostBox, H1, Image, Page } from '~/Components';
import { EventEditButtons } from '~/Components';
import { BuyEventTicket } from '~/Components/BuyEventTicket/BuyEventTicket';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { getEvent } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import { useAuthContext } from '~/context/AuthContext';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { PERM } from '~/permissions';
import { eventKeys } from '~/queryKeys';
import { dbT } from '~/utils';
import { hasPerm } from '~/utils';
import styles from './EventPage.module.scss';
import { EventInformation } from './components/EventInformation/EventInformation';
import { EventTable } from './components/EventTable';

export function EventPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuthContext();
  const canChangeEvent = hasPerm({ user: user, permission: PERM.SAMFUNDET_CHANGE_EVENT, obj: id });

  const { data: event, isLoading } = useQuery({
    queryKey: id ? eventKeys.detail(Number(id)) : ['events', 'no-id'],
    queryFn: () => getEvent(id as string),
    enabled: !!id,
  });

  useTitle((event && dbT(event, 'title')) || t(KEY.common_event));
  return (
    <Page className={styles.container} loading={isLoading}>
      <div className={styles.image_wrapper}>
        {event && <Image src={BACKEND_DOMAIN + event.image_url} className={styles.event_image} />}
      </div>

      {canChangeEvent && (
        <div className={styles.admin_panel}>
          <EventEditButtons title={dbT(event, 'title')} id={id} icon_size={20} />
        </div>
      )}

      <H1 className={styles.text_title}>{dbT(event, 'title')}</H1>
      <div className={styles.content_row}>
        {event && <EventInformation event={event} />}
        {event && (
          /* Todo: (issue #1865) make this dynamic, after link is added to model and it is possible to add link in event form */
          /* Should only be rendered if the host is actually external */
          <ExternalHostBox
            host={'Gløshaugen Revy- og Teaterlag'}
            host_link={'https://www.facebook.com/glosrevyteater'}
          />
        )}
        {event?.billig && (
          <>
            <BuyEventTicket event={event} ticketSaleState={event.billig} />
          </>
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
