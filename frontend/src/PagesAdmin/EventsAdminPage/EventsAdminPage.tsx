import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EventQuery, Link, SamfundetLogoSpinner, TimeDisplay } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './EventsAdminPage.module.scss';
import { EventDto } from '~/dto';
import { deleteEvent, getEventsUpcomming } from '~/api';
import { Table, AlphabeticTableCell, ITableCell } from '~/Components/Table';
import { reverse } from '~/named-urls';
import { dbT } from '~/i18n/i18n';

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

  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>
          {t(KEY.edit)} {t(KEY.event)}
        </h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_event_changelist}>
          View in backend
        </Link>
      </div>
      <EventQuery allEvents={allEvents} setEvents={setEvents} />
      <div className={styles.tableContainer}>
        <Table
          columns={[t(KEY.common_title), t(KEY.start_time), t(KEY.event_type), t(KEY.organizer), t(KEY.venue), '']}
          data={events.map(function (element) {
            return [
              new AlphabeticTableCell(
                (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.event,
                      urlParams: { id: element.id },
                    })}
                  >
                    {dbT(element, 'title', i18n.language)}
                  </Link>
                ),
              ),
              new AlphabeticTableCell(<TimeDisplay timestamp={element.start_dt} />),
              new AlphabeticTableCell(element.event_group.name),
              new AlphabeticTableCell(element.host),
              new AlphabeticTableCell(element.location),
              {
                children: (
                  <div>
                    <Button
                      theme="blue"
                      display="block"
                      onClick={() => {
                        navigate(
                          reverse({
                            pattern: ROUTES.frontend.admin_events_edit,
                            urlParams: { id: element.id },
                          }),
                        );
                      }}
                    >
                      {t(KEY.edit)}
                    </Button>
                    <Button
                      theme="samf"
                      display="block"
                      onClick={() => {
                        if (
                          window.confirm(
                            `${t(KEY.form_confirm)} ${t(KEY.delete)} ${dbT(element, 'title', i18n.language)}`,
                          )
                        ) {
                          deleteSelectedEvent(element.id);
                        }
                      }}
                    >
                      {t(KEY.delete)}
                    </Button>{' '}
                  </div>
                ),
              } as ITableCell,
            ];
          })}
        />
      </div>
    </Page>
  );
}
