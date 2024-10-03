import { Icon } from '@iconify/react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, InputField, Link, TimeDisplay } from '~/Components';
import { eventQuery } from '~/Components/EventQuery/utils';
import { ImageCard } from '~/Components/ImageCard';
import { Table, type TableRow } from '~/Components/Table';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { useDesktop } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { COLORS } from '~/types';
import { dbT } from '~/utils';
import styles from './EventsList.module.scss';

type EventsListProps = {
  events: Record<string, EventDto[]>;
};

export function EventsList({ events }: EventsListProps) {
  const { t } = useTranslation();
  const [tableView, setTableView] = useState(false);
  const [query, setQuery] = useState('');
  const isDesktop = useDesktop();

  const eventColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: t(KEY.common_date), sortable: true },
    t(KEY.common_from),
    { content: t(KEY.common_to) },
    { content: t(KEY.common_venue), sortable: true },
    { content: t(KEY.category), sortable: true },
    t(KEY.common_buy),
  ];

  // TODO debounce and move header/filtering stuff to a separate component
  function filteredEvents() {
    const allEvents = Object.keys(events).flatMap((k: string) => events[k]);
    return eventQuery(allEvents, query);
  }

  // TODO improve table view for events
  function getEventRows(): TableRow[] {
    return filteredEvents().map((event) => ({
      cells: [
        {
          content: (
            <Link
              url={reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })}
              className={styles.link}
            >
              {dbT(event, 'title')}
            </Link>
          ),
          value: dbT(event, 'title') ?? '',
        },
        {
          content: <TimeDisplay timestamp={event.start_dt} displayType="event-date" />,
          value: new Date(event.start_dt),
        },
        { content: <TimeDisplay timestamp={event.start_dt} displayType="time" />, value: new Date(event.start_dt) },
        { content: <TimeDisplay timestamp={event.end_dt} displayType="time" />, value: new Date(event.end_dt) },
        event.location,
        event.category,
        event.ticket_type,
      ],
    }));
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
          />
        </div>
      );
    });
  }

  function getButton(title: string, icon: string, func: () => void, chosen: boolean) {
    return (
      <Button rounded={true} onClick={func} theme={chosen ? 'blue' : 'secondary'}>
        {title}
        <Icon icon={icon} />
      </Button>
    );
  }

  return (
    <>
      <div className={styles.header_row}>
        <div className={styles.header}>{t(KEY.common_events)}</div>

        {/* Search bar */}
        <div className={styles.filter_row}>
          <InputField
            icon="mdi:search"
            labelClassName={styles.search_bar}
            inputClassName={styles.search_bar_field}
            onChange={setQuery}
            value={query}
          />
          {isDesktop && (
            <span className={styles.filter_button}>
              <IconButton
                icon="fluent:options-24-filled"
                title="Filter"
                color={COLORS.black}
                onClick={() => alert('TODO legg til tinius sitt filter')}
              />
            </span>
          )}
        </div>

        {/* TODO translate */}
        <div className={styles.button_row}>
          {getButton(t(KEY.common_card), 'material-symbols:grid-view-rounded', () => setTableView(false), !tableView)}
          {getButton(t(KEY.common_table), 'material-symbols:view-list', () => setTableView(true), tableView)}
        </div>
      </div>

      <div className={styles.event_view_container}>
        {/* Table view */}
        {tableView && <Table columns={eventColumns} data={getEventRows()} />}

        {/* Grid view */}
        {!tableView && <div className={styles.event_grid}>{getEventCards()}</div>}
      </div>
    </>
  );
}
