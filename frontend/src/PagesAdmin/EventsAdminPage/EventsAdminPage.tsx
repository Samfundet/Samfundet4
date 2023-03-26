import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { deleteEvent, getEventsUpcomming } from '~/api';
import { Button, EventQuery, Link, SamfundetLogoSpinner } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Page } from '~/Components/Page';
import { AlphabeticTableCell, ITableCell, Table } from '~/Components/Table';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './EventsAdminPage.module.scss';

export function EventsAdminPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [allEvents, setAllEvents] = useState<EventDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t, i18n } = useTranslation();

  function getEvents() {
    getEventsUpcomming()
      .then((data) => {
        setEvents(data);
        setAllEvents(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }

  // Stuff to do on first render.
  // TODO add permissions on render

  useEffect(() => {
    getEvents();
  }, []);

  function deleteSelectedEvent(id: number) {
    deleteEvent(id).then(() => {
      getEvents();
    });
  }

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const data = events.map(function (event: EventDto) {
    return [
      new AlphabeticTableCell(
        // <Link
        //   url={reverse({
        //     pattern: ROUTES.frontend.event,
        //     urlParams: { id: event.id },
        //   })}
        // >
        //   {dbT(event, 'title')}
        // </Link>
        dbT(event, 'title'),
      ),
      // new AlphabeticTableCell(<TimeDisplay timestamp={event.start_dt} />),
      new AlphabeticTableCell(event.start_dt.toLocaleString()),
      //new AlphabeticTableCell(event.event_group.name),
      new AlphabeticTableCell(event.host),
      new AlphabeticTableCell(event.location),
      {
        children: (
          <CrudButtons
            onEdit={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.admin_events_edit,
                  urlParams: { id: event.id },
                }),
              );
            }}
            onDelete={() => {
              // TODO custom modal confirm
              if (window.confirm(`${t(KEY.form_confirm)} ${t(KEY.delete)} ${dbT(event, 'title')}`)) {
                // TODO toast component? A bit too easy to delete events
                deleteSelectedEvent(event.id);
              }
            }}
          />
        ),
      } as ITableCell,
    ];
  });

  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>
          {t(KEY.edit)} {t(KEY.common_event)}
        </h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_event_changelist}>
          View in backend
        </Link>
      </div>
      <EventQuery allEvents={allEvents} setEvents={setEvents} />
      <div className={styles.tableContainer}>
        <Table columns={[t(KEY.common_title), t(KEY.start_time), t(KEY.organizer), t(KEY.venue), '']} data={data} />
      </div>
    </Page>
  );
}
