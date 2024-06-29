import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { getEventsPerDay } from '~/api';
import { KEY } from '~/i18n/constants';
import styles from './EventsPage.module.scss';
import { EventsList } from './components/EventsList';
import { useTitle } from '~/hooks';

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

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return <EventsList events={events} />;
}
