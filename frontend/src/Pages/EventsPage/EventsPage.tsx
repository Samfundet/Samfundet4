import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Page } from '~/Components';
import { getEventsPerDay } from '~/api';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { EventsList } from './components/EventsList';

export function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  useTitle(t(KEY.common_events));

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    getEventsPerDay()
      .then((data) => {
        setEvents(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, []);

  return (
    <Page loading={showSpinner}>
      <EventsList events={events} />
    </Page>
  );
}
