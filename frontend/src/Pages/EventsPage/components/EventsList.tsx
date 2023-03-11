import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageCard } from '~/Components/ImageCard';
import { ITableCell, Table } from '~/Components/Table';
import { EventDto } from '~/dto';
import { dbT } from '~/i18n/i18n';
import styles from './EventsList.module.scss';

type EventsListProps = {
  events: unknown;
};

export function EventsList({ events }: EventsListProps) {
  /** check if dates are equal */
  const { i18n } = useTranslation();

  const eventColumns = [
    "Dato", "Arrangement", "Lokale", "Type", "Kjøp"
  ]

  function getEventRows(events: unknown[]): ITableCell[][] {
    let rows: ITableCell[][] = [];
    
    Object.keys(events).forEach((date: string) => {
      

      events[date].forEach((event: EventDto) => {
        let row: ITableCell[] = [];
        rows.push([
          {children: <span>{date}</span>} as ITableCell,
          {children: <span>{dbT(event, 'title', i18n.language)}</span>} as ITableCell,
          {children: <span>{event.location}</span>} as ITableCell,
          {children: <span>{event.event_group?.name}</span>} as ITableCell,
          {children: <span>{event.price_group}</span>} as ITableCell,
        ] as ITableCell[]);
      })
      
    })


    return rows;
  }

  function getEventCards(date: string): ReactNode[] {
    return events[date].map((event: EventDto, key: number) => {
      return (
        <div className={styles.event_container}>
          <ImageCard key={key} compact={true} />
        </div>
      );
    })
  }

  return (
    <Table columns={eventColumns} data={getEventRows(events)} />
    /*
    <div className={styles.event_container}>
      {Object.keys(events).map((date_str: string) => (
        <div className={styles.event_group}>
          <div className={styles.date_header}>
              <TimeDisplay className={styles.dateHeaderText} timestamp={date_str} displayType="nice-date" />
          </div>
          <div className={styles.event_row}>
            {getEventCards(date_str)}
          </div>
        </div>
      ))}
    </div>
    */
    /*
    <div className={styles.container}>
      {Object.keys(events).map(function (date_str: string, key: number) {
        return (
          <div key={key} className={styles.dates_container}>
            <div className={styles.dateHeader}>
              <TimeDisplay className={styles.dateHeaderText} timestamp={date_str} displayType="nice-date" />
            </div>
            <div className={styles.events_container}>
              {events[date_str].map(function (event: EventDto, key: number) {
                return (
                  <div key={key} className={styles.event_row}>
                    <div className={styles.column_title}>
                      <Link
                        to={reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } })}
                        className={styles.link}
                      >
                        {dbT(event, 'title', i18n.language)}
                      </Link>
                    </div>
                    <div className={styles.column_area_time}>
                      <div>
                        <TimeDuration start={event.start_dt} end={event.end_dt} />
                      </div>
                      <p>{event?.location}</p>
                    </div>
                    <div className={styles.column_price}>
                      <p>{event?.price_group}</p>
                    </div>
                    <div className={styles.column_buy}>
                      <Button theme="samf">Kjøp</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
    */
  );
}
