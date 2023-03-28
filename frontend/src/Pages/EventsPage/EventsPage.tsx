import { useEffect, useState } from 'react';
import { getEventsPerDay } from '~/api';
import { SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { EventsList } from './components/EventsList';
import styles from './EventsPage.module.scss';

export function EventsPage() {
  const [events, setEvents] = useState({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  useEffect(() => {
    getEventsPerDay().then((data) => {
      setEvents(data);
      setShowSpinner(false);
    });
  }, []);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <EventsList events={events} />
    </Page>
  );
}
