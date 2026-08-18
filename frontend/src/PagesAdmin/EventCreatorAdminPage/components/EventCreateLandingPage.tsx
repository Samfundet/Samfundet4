import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '~/Components';
import { getEvents } from '~/api';
import type { EventDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../../AdminPageLayout/AdminPageLayout';
import styles from '../EventCreatorAdminPage.module.scss';
import { EventTemplateSearch } from './EventTemplateSearch';

export function EventCreateLandingPage() {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const title = lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_event)}`);
  useTitle(title);

  function handleSelectEvent(event: EventDto) {
    navigate({
      url: reverse({
        pattern: ROUTES.frontend.admin_events_create_form,
        queryParams: { template: event.id },
      }),
    });
  }

  return (
    <AdminPageLayout title={title}>
      <div className={styles.landing}>
        <div className={styles.landing_row}>
          <Button theme="primary" onClick={() => navigate({ url: ROUTES.frontend.admin_events_create_form })}>
            <Icon icon="lucide:plus" />
            {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_event)}`)}
          </Button>
        </div>
        <div className={styles.landing_row}>
          <label className={styles.landing_header}>{t(KEY.event_copy_from_registered_event)}</label>
          <div className={styles.landing_search_wrapper}>
            <EventTemplateSearch events={events} onSelectEvent={handleSelectEvent} />
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
