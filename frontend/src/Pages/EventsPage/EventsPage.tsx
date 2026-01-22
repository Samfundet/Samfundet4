import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Page } from '~/Components';
import { getEventsPerDay } from '~/api';
import type { EventsPerDayDto } from '~/dto';
import { useDesktop, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import styles from './EventPage.module.scss';
import { EventGrid } from './components';
import { EventDay } from './components/EventDay';
import { EventFilter, type ViewType } from './components/EventFilter/EventFilter';

export function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EventsPerDayDto>({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [viewType, setViewType] = useState('table'); // Default view
  const isDesktop = useDesktop();
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

  const renderEventDays = () => {
    if (!events || Object.keys(events).length === 0) {
      return <p>{t(KEY.common_something_went_wrong)}</p>;
    }

    // Sort days in chronological order
    const sortedDays = Object.keys(events).sort();

    return sortedDays.map((day) => {
      const eventsForDay = events[day];
      return <EventDay key={day} date={day} events={eventsForDay} isDesktop={isDesktop} />;
    });
  };

  const handleSetViewType = (type: ViewType) => {
    setViewType(type);
  };

  return (
    <Page loading={showSpinner}>
      <div className={styles.events_container}>
        <EventFilter setViewType={handleSetViewType} />
        {viewType === 'grid' && <EventGrid events={events} />}
        {viewType === 'table' && <div className={styles.event_day_wrapper}>{renderEventDays()}</div>}
      </div>
    </Page>
  );
}
