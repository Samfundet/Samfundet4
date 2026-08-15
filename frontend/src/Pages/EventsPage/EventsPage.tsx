import { useTranslation } from 'react-i18next';
import { Page } from '~/Components';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { EventsList } from './components/EventsList';
import { useGetEventsPerDay } from '~/domain/events/queries';

export function EventsPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_events));

  const { data: events, isLoading } = useGetEventsPerDay();

  return (
    <Page loading={isLoading}>
      <EventsList events={events ?? []} />
    </Page>
  );
}
