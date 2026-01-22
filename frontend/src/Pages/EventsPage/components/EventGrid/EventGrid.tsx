import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeDisplay } from '~/Components';
import { eventQuery } from '~/Components/EventQuery/utils';
import { ImageCard } from '~/Components/ImageCard';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { useDesktop } from '~/hooks';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './EventGrid.module.scss';

type EventsListProps = {
  events: Record<string, EventDto[]>;
};

export function EventGrid({ events }: EventsListProps) {
  const { t } = useTranslation();
  const [tableView, setTableView] = useState(true);
  const [query, setQuery] = useState('');
  const isDesktop = useDesktop();

  // TODO debounce and move header/filtering stuff to a separate component
  function filteredEvents() {
    const allEvents = Object.keys(events).flatMap((k: string) => events[k]);
    return eventQuery(allEvents, query);
  }

  function getEventCards(): ReactNode[] {
    return filteredEvents().map((event: EventDto) => {
      const time_display = <TimeDisplay timestamp={event.start_dt} displayType="event-datetime" />;
      return (
        <div className={styles.event_container} key={event.id}>
          <ImageCard
            date={event.start_dt.toString()}
            imageUrl={BACKEND_DOMAIN + event.image_url}
            title={dbT(event, 'title') ?? ''}
            subtitle={time_display}
            description={dbT(event, 'description_short') ?? ''}
            compact={true}
            url={reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })}
            ticket_type={event.ticket_type}
            host={event.host}
          />
        </div>
      );
    });
  }

  return (
    <>
      <div className={styles.event_grid}>{getEventCards()}</div>
    </>
  );
}
