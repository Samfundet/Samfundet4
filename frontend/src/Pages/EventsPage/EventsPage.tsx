import { useEffect, useState } from 'react';
import { getEventsUpcomming } from '~/api';
import { Page } from '~/Components/Page';
import { Button, EventQuery, SamfundetLogoSpinner } from '~/Components';
import styles from './EventsPage.module.scss';
import { EventDto } from '~/dto';
import { EventsBoxes, EventsList } from './components';

export function EventsPage() {
  const SIMPLE = 'simple';
  const BOXES = 'boxes';

  const [events, setEvents] = useState({});
  const [allEvents, setAllEvents] = useState<EventDto>({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [currentDisplayType, setCurrentDisplayType] = useState<string>(BOXES);

  useEffect(() => {
    console.log('lolp');
    getEventsUpcomming().then((data) => {
      setAllEvents(data);
      dateifyEvents(data);
      setShowSpinner(false);
    });
  }, []);

  function dateifyEvents(data) {
    data = data.sort(function (a, b) {
      return new Date(a.start_dt) - new Date(b.start_dt);
    });
    const dates = data.reduce(function (a, d) {
      if (a.indexOf(d.start_dt.toString().substring(0, 10)) === -1) {
        a.push(d.start_dt.toString().substring(0, 10));
      }
      return a;
    }, []);
    setEvents(
      Object.assign(
        {},
        ...dates.map((x) => ({ [x]: data.filter((d) => d.start_dt.toString().substring(0, 10) === x) })),
      ),
    );
  }

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <div className={styles.header}>
        <EventQuery allEvents={allEvents} setEvents={dateifyEvents} />
        <Button onClick={() => setCurrentDisplayType(SIMPLE)}>Simple</Button>
        <Button onClick={() => setCurrentDisplayType(BOXES)}>Boxes</Button>
      </div>
      {currentDisplayType === SIMPLE && <EventsList events={events} />}
      {currentDisplayType === BOXES && <EventsBoxes events={events} />}
    </Page>
  );
}
