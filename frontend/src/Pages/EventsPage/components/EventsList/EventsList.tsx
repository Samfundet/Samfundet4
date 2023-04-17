import { Icon } from '@iconify/react';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Link, TimeDisplay } from '~/Components';
import { ImageCard } from '~/Components/ImageCard';
import { Table, TableRow } from '~/Components/Table';
import { BACKEND_DOMAIN } from '~/constants';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './EventsList.module.scss';

type EventsListProps = {
  events: Record<string, EventDto[]>;
};

export function EventsList({ events }: EventsListProps) {
  const { t } = useTranslation();
  const [tableView, setTableView] = useState(false);

  const eventColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: t(KEY.common_date), sortable: true },
    t(KEY.common_from),
    { content: t(KEY.common_to) },
    { content: t(KEY.common_venue), sortable: true },
    { content: t(KEY.category), sortable: true },
    t(KEY.common_buy),
  ];

  // TODO improve table view for events
  function getEventRows(events: Record<string, EventDto[]>): TableRow[] {
    const rows: TableRow[] = [];

    Object.keys(events).forEach((date: string) => {
      events[date].forEach((event: EventDto) => {
        rows.push([
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
          { content: <TimeDisplay timestamp={event.start_dt} displayType="time" />, value: new Date(date) },
          { content: <TimeDisplay timestamp={event.end_dt} displayType="time" />, value: new Date(event.end_dt) },
          event.location,
          event.category,
          event.ticket_type,
        ]);
      });
    });

    return rows;
  }

  function getEventCards(date: string): ReactNode[] {
    return events[date].map((event: EventDto, key: number) => {
      return (
        <ImageCard
          key={key}
          date={event.start_dt.toString()}
          imageUrl={BACKEND_DOMAIN + event.image_url}
          title={dbT(event, 'title') ?? ''}
          subtitle={event.location}
          description={dbT(event, 'description_short') ?? ''}
          compact={true}
          url={reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })}
        />
      );
    });
  }

  function getButton(title: string, icon: string, func: () => void, chosen: boolean) {
    return (
      <Button rounded={true} onClick={func} theme={chosen ? 'black' : 'outlined'}>
        <span style={{ display: 'flex', gap: '1em' }}>
          {title}
          <Icon icon={icon} />
        </span>
      </Button>
    );
  }

  return (
    <>
      {/* TODO make "tabs" component and cleanup local css */}
      <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', marginTop: '1em' }}>
        {getButton('Dager', 'mdi:grid', () => setTableView(false), !tableView)}
        {getButton('Liste', 'material-symbols:view-list', () => setTableView(true), tableView)}
      </div>

      <div style={{ height: '1em' }} />

      {/* Table view */}
      {tableView && <Table columns={eventColumns} data={getEventRows(events)} />}

      {/* Grid view */}
      {!tableView && (
        <div className={styles.event_container}>
          {Object.keys(events).map((date_str: string, key: number) => (
            <div className={styles.event_group} key={key}>
              <div className={styles.date_header}>
                <TimeDisplay className={styles.dateHeaderText} timestamp={date_str} displayType="nice-date" />
              </div>
              <div className={styles.event_row}>{getEventCards(date_str)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
