import { Button, H2, H4, Link, Table, type TableRow, TimeDisplay } from '~/Components';
import { Badge } from '~/Components/Badge';
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
  const buyOrFree = (event: EventDto) => {
    if (event.billig) {
      return (
        <Button theme="samf" display="pill" onClick={() => alert('TODO: add buy modal')}>
          BUY
        </Button>
      );
    }
    return null;
  };

  const ticketInfo = (event: EventDto) => {
    if (event.billig) {
      return <div>TODO: add billig price</div>;
    }
    if (event.ticket_type === 'free') {
      return <Badge className={styles.free_badge} text="free" />;
    }
    if (event.ticket_type === 'included') {
      return <Badge className={styles.included_badge} text="included" />;
    }
    if (event.ticket_type === 'custom') {
      <div>
        {event.custom_tickets.map((ticket) => {
          return <Badge key={ticket.id} text={`${dbT(ticket, 'name')}: ${ticket.price}`} />;
        })}
      </div>;
    }
    if (event.ticket_type === 'registration') {
      return <Badge text="registration" />;
    }
  };

  const eventRowsMobile = (): TableRow[] => {
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
          content: <div className={styles.event_buy}>{buyOrFree(event)}</div>,
        },
      ],
    }));
  };

  const eventRowsDesktop = (): TableRow[] => {
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
          content: event.category,
        },
        {
          content: event.doors_time ? <div>Doors: {event.doors_time}</div> : null,
        },
        {
          content: ticketInfo(event),
        },
        {
          content: <div className={styles.event_buy}>{buyOrFree(event)}</div>,
        },
      ],
    }));
  };

  return (
    <div className={styles.event_day_item_wrapper}>
      {isDesktop ? (
        <H2 className={styles.event_day_item_header}>
          <TimeDisplay timestamp={date} displayType="nice-date" />
        </H2>
      ) : (
        <H4 className={styles.event_day_item_header}>
          <TimeDisplay timestamp={date} displayType="nice-date" />
        </H4>
      )}
      <Table className={styles.event_day_table} data={isDesktop ? eventRowsDesktop() : eventRowsMobile()} />
    </div>
  );
}
