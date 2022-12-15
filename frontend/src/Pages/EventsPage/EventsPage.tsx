import { useEffect, useState } from 'react';
import { EventsList } from './components/EventsList';
import { getEventsPerDay } from '~/api';
import { Page } from '~/Components/Page';

export function EventsPage() {
  const [events, setEvents] = useState({});
  useEffect(() => {
    getEventsPerDay().then((data) => {
      setEvents(data);
      console.log(typeof data);
    });
  }, []);
  return (
    <Page>
      <EventsList events={events} />
    </Page>
  );
}
