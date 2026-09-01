import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ExpandableHeader, ExternalHostBox, H1, Image, Page } from '~/Components';
import { BuyEventTicket } from '~/Components/BuyEventTicket/BuyEventTicket';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { getEvent } from '~/api';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { eventKeys } from '~/queryKeys';
import { dbT, imageUrl } from '~/utils';
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
        {event && <Image src={imageUrl(event.image, 'large') ?? ''} className={styles.event_image} />}
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
              <SamfMarkdown markdown={dbT(event, 'description_long')} />
            </div>
          </div>
          <ExpandableHeader label={t(KEY.common_details)} className={styles.expandable_header}>
            {/* Info table */}
            <div className={styles.info_list}>{event && <EventTable event={event} />}</div>
          </ExpandableHeader>
        </div>
        {/* Social Media links */}
        <div>
          {event?.spotify_uri && (
            <a href={event.spotify_uri} target="_blank" rel="noopener noreferrer">
              {event.spotify_uri}
            </a>
          )}
          {event?.youtube_link && (
            <a href={event.youtube_link} target="_blank" rel="noopener noreferrer">
              {event.youtube_link}
            </a>
          )}
          {event?.facebook_link && (
            <a href={event.facebook_link} target="_blank" rel="noopener noreferrer">
              {event.facebook_link}
            </a>
          )}
          {event?.soundcloud_link && (
            <a href={event.soundcloud_link} target="_blank" rel="noopener noreferrer">
              {event.soundcloud_link}
            </a>
          )}
          {event?.instagram_link && (
            <a href={event.instagram_link} target="_blank" rel="noopener noreferrer">
              {event.instagram_link}
            </a>
          )}
          {event?.x_link && (
            <a href={event.x_link} target="_blank" rel="noopener noreferrer">
              {event.x_link}
            </a>
          )}
          {event?.lastfm_link && (
            <a href={event.lastfm_link} target="_blank" rel="noopener noreferrer">
              {event.lastfm_link}
            </a>
          )}
          {event?.vimeo_link && (
            <a href={event.vimeo_link} target="_blank" rel="noopener noreferrer">
              {event.vimeo_link}
            </a>
          )}
          {event?.general_link && (
            <a href={event.general_link} target="_blank" rel="noopener noreferrer">
              {event.general_link}
            </a>
          )}
        </div>
      </div>
    </Page>
  );
}
