import { Icon } from '@iconify/react';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Button, Dropdown, InputField, Link, TimeDisplay } from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { ImageCard } from '~/Components/ImageCard';
import { Table, type TableRow } from '~/Components/Table';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { EventCategoryValue, EventTicketTypeValue } from '~/types';
import { dbT, getEventCategoryKey, getTicketTypeKey, imageUrl, lowerCapitalize } from '~/utils';
import styles from './EventsList.module.scss';

type EventsListProps = {
  events: Record<string, EventDto[]>;
};

export function EventsList({ events }: EventsListProps) {
  const { t, i18n } = useTranslation();
  const [tableView, setTableView] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();
  const [query, setQuery] = useState(searchParam.get('q') ?? '');
  const [category, setCategory] = useState(searchParam.get('category') ?? '');
  const [place, setPlace] = useState(searchParam.get('place') ?? '');
  const [ticketType, setTicketType] = useState(searchParam.get('ticket_type') ?? '');

  const eventColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: t(KEY.common_date), sortable: true },
    t(KEY.common_from),
    { content: t(KEY.common_to) },
    { content: t(KEY.common_venue), sortable: true },
    { content: t(KEY.category), sortable: true },
    { content: t(KEY.admin_organizer), sortable: true },
    { content: t(KEY.common_buy), sortable: true },
  ];

  const allEvents = Object.values(events).flat();
  const venues = [...new Set(allEvents.map((event) => event.location).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
  const categories = [...new Set(allEvents.map((event) => event.category))].sort();
  const ticketTypes = [...new Set(allEvents.map((event) => event.ticket_type))].sort();

  const venueOptions: DropdownOption<string>[] = venues.map((venue) => ({ label: venue, value: venue }));
  const categoryOptions: DropdownOption<EventCategoryValue>[] = categories.map((eventCategory) => ({
    label: t(getEventCategoryKey(eventCategory)),
    value: eventCategory,
  }));
  const ticketTypeOptions: DropdownOption<EventTicketTypeValue>[] = ticketTypes.map((eventTicketType) => ({
    label: t(getTicketTypeKey(eventTicketType)),
    value: eventTicketType,
  }));

  function filteredEvents() {
    const normalizedCategory = category.trim().toLowerCase();
    const normalizedPlace = place.trim().toLowerCase();
    const normalizedTicketType = ticketType.trim().toLowerCase();
    const normalizedSearch = query.trim().toLowerCase();
    const keywords = normalizedSearch ? normalizedSearch.split(/\s+/) : [];

    const matchesText = (event: EventDto) => {
      const searchableText = [
        dbT(event, 'title', i18n.language),
        dbT(event, 'description_short', i18n.language),
        dbT(event, 'description_long', i18n.language),
        event.location,
        event.host,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return keywords.every((kw) => searchableText.includes(kw));
    };

    return allEvents.filter((event) => {
      const matchesCategory = !normalizedCategory || event.category.toLowerCase() === normalizedCategory;
      const matchesPlace = !normalizedPlace || (event.location ?? '').toLowerCase().includes(normalizedPlace);
      const matchesTicketType = !normalizedTicketType || event.ticket_type.toLowerCase() === normalizedTicketType;
      const matchesQuery = matchesText(event);

      return matchesCategory && matchesPlace && matchesTicketType && matchesQuery;
    });
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
        event.host,
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
            imageUrl={imageUrl(event.image, 'small')}
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

  useEffect(() => {
    setQuery(searchParam.get('q') ?? '');
    setCategory(searchParam.get('category') ?? '');
    setPlace(searchParam.get('place') ?? '');
    setTicketType(searchParam.get('ticket_type') ?? '');
  }, [searchParam]);

  useEffect(() => {
    setSearchParam((prev) => {
      const next = new URLSearchParams(prev);
      if (query) {
        next.set('q', query);
      } else {
        next.delete('q');
      }
      if (category) {
        next.set('category', category);
      } else {
        next.delete('category');
      }
      if (place) {
        next.set('place', place);
      } else {
        next.delete('place');
      }
      if (ticketType) {
        next.set('ticket_type', ticketType);
      } else {
        next.delete('ticket_type');
      }
      return next;
    });
  }, [category, place, query, setSearchParam, ticketType]);

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
          <Dropdown
            value={place || null}
            options={venueOptions}
            onChange={(value) => setPlace(value ?? '')}
            className={styles.filter_select}
            sortAlphabetic={true}
            nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_venue)}`) }}
          />
          <Dropdown
            value={(category || null) as EventCategoryValue | null}
            options={categoryOptions}
            onChange={(value) => setCategory(value ?? '')}
            className={styles.filter_select}
            sortAlphabetic={true}
            nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.category)}`) }}
          />
          <Dropdown
            value={(ticketType || null) as EventTicketTypeValue | null}
            options={ticketTypeOptions}
            onChange={(value) => setTicketType(value ?? '')}
            className={styles.filter_select}
            sortAlphabetic={true}
            nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_ticket)}`) }}
          />
          <div className={styles.button_row}>
            {getButton(t(KEY.common_card), 'material-symbols:grid-view-rounded', () => setTableView(false), !tableView)}
            {getButton(t(KEY.common_sheet), 'material-symbols:view-list', () => setTableView(true), tableView)}
          </div>
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
