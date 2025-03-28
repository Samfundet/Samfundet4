import { H4, Link, Table, type TableRow, TimeDisplay } from '~/Components';
import type { EventDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './EventDay.module.scss';
import { EventTimeLocation } from './EventTimeLocation/EventTimeLocation';
type EventTableProps = {
  date: string;
  events: EventDto[];
  isDesktop: boolean;
};

export function EventDay({ date, events, isDesktop }: EventTableProps) {
  const eventRows = (): TableRow[] => {
    return events.map((event: EventDto) => ({
      cells: [
        {
          content: (
            <Link
              className={styles.event_title_link}
              url={reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })}
            >
              {dbT(event, 'title')}
            </Link>
          ),
          value: dbT(event, 'title') ?? '',
        },
        {
          content: (
            <EventTimeLocation
              eventStart={event.start_dt}
              eventEnd={event.end_dt}
              eventLocation={event.location}
              isDesktop={isDesktop}
            />
          ),
        },
        {
          content: (
            <div className={styles.event_buy}>
              <H4>BUY</H4>
            </div>
          ),
        },
      ],
    }));
  };

  return (
    <div className={styles.event_day_item_wrapper}>
      <H4 className={styles.event_day_item_header}>
        <TimeDisplay timestamp={date} displayType="nice-date" />
      </H4>
      <Table className={styles.event_day_table} data={eventRows()} />
    </div>
  );
}
