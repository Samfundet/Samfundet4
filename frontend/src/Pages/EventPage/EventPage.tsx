import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { H1, Image, Page } from '~/Components';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { getEvent } from '~/api';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { eventKeys } from '~/queryKeys';
import { dbT, imageUrl } from '~/utils';
import styles from './EventPage.module.scss';
import { EventInformation } from './components/EventInformation/EventInformation';

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
      {event && (
        <>
          <div className={styles.image_wrapper}>
            <Image
              src={imageUrl(event.image, 'large') ?? ''}
              alt={dbT(event, 'title')}
              className={styles.event_image}
            />
          </div>

          <main className={styles.content_panel}>
            <H1 className={styles.text_title}>{dbT(event, 'title')}</H1>
            <EventInformation event={event} />
            <div className={styles.description_section}>
              <div className={styles.description}>
                {dbT(event, 'description_short') && (
                  <p className={styles.text_short}>{dbT(event, 'description_short')}</p>
                )}
                <SamfMarkdown markdown={dbT(event, 'description_long')} />
              </div>
            </div>
          </main>
        </>
      )}
    </Page>
  );
}
