import { Icon } from '@iconify/react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, IconButton, InputField, Link, TimeDisplay } from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { ImageCard } from '~/Components/ImageCard';
import { Table, type TableRow } from '~/Components/Table';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { useDesktop } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { EventCategoryValue, SetState } from '~/types';
import { COLORS } from '~/types';
import { dbT, lowerCapitalize } from '~/utils';
import styles from './EventsList.module.scss';

type EventsListProps = {
  events: Record<string, EventDto[]>;
  categories: EventCategoryValue[] | null;
  venues: string[] | null;
  selectedVenue: string | null;
  setSelectedVenue: SetState<string | null>;
  selectedCategory: EventCategoryValue | null;
  setSelectedCategory: SetState<EventCategoryValue | null>;
};

export function EventsList({
  events,
  categories,
  venues,
  selectedVenue,
  setSelectedVenue,
  selectedCategory,
  setSelectedCategory,
}: EventsListProps) {
  const { t, i18n } = useTranslation();
  const [tableView, setTableView] = useState(false);
  const [query, setQuery] = useState('');
  const isDesktop = useDesktop();

  const categoryOptions: DropdownOption<string | null>[] = (categories ?? []).map((category) => {
    return { label: category, value: category } as DropdownOption<string>;
  });
  const venueOptions: DropdownOption<string | null>[] = (venues ?? []).map((venue) => {
    return { label: venue, value: venue } as DropdownOption<string>;
  });

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

  // TODO debounce and move header/filtering stuff to a separate component
  function filteredEvents() {
    const allEvents = Object.keys(events).flatMap((k: string) => events[k]);
    const normalizedSearch = query.trim().toLowerCase();
    const keywords = normalizedSearch.split(' ');

    return allEvents.filter((event) => {
      const title = (dbT(event, 'title', i18n.language) as string)?.toLowerCase() ?? '';
      const matchesSearch = query === '' || keywords.every((kw) => title.includes(kw));
      const matchesVenue = !selectedVenue || event.location === selectedVenue;
      const matchesCategory = !selectedCategory || event.category === selectedCategory;

      return matchesSearch && matchesVenue && matchesCategory;
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
          <Dropdown
            options={categoryOptions}
            onChange={(val) => setSelectedCategory(val as EventCategoryValue)}
            className={styles.element}
            nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.event_type)}`) }}
          />
          <Dropdown
            options={venueOptions}
            onChange={(val) => setSelectedVenue(val as string)}
            className={styles.element}
            nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_venue)}`) }}
          />
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
