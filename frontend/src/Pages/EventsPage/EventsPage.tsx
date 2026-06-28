import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Page } from '~/Components';
import { getEventsPerDay } from '~/api';
import type { EventDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import type { EventCategoryValue } from '~/types';
import { EventsList } from './components/EventsList';

export function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Record<string, EventDto[]>>({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [venues, setVenues] = useState<string[] | null>([]);
  const [categories, setCategories] = useState<EventCategoryValue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryValue | null>(null);

  useTitle(t(KEY.common_events));

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    getEventsPerDay()
      .then((data) => {
        setEvents(data);

        const allEvents = Object.values(data).flat();
        setVenues([...new Set(allEvents.map((event) => event.location))]);
        setCategories([...new Set(allEvents.map((event) => event.category))]);

        setShowSpinner(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, []);

  return (
    <Page loading={showSpinner}>
      <EventsList
        events={events}
        categories={categories}
        venues={venues}
        selectedVenue={selectedVenue}
        setSelectedVenue={setSelectedVenue}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </Page>
  );
}
