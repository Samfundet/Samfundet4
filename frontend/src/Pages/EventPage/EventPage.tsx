import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ExpandableHeader, ExternalHostBox, H1, Image, Page } from '~/Components';
import { BuyButton } from '~/Components/BuyButton/BuyButton';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { getEvent } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { eventKeys } from '~/queryKeys';
import { dbT } from '~/utils';
import styles from './EventPage.module.scss';
import { EventInformation } from './components/EventInformation/EventInformation';
import { EventTable } from './components/EventTable';

export function EventPage() {
  const { t } = useTranslation();
  const { id } = useParams();

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
        {event && event.billig && (
          <>
            <BuyButton
              event={event}
              ticketSaleState={event.billig}
            />
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
