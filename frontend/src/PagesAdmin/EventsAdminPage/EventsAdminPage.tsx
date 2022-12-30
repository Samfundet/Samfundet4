import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EventQuery, Link, SamfundetLogoSpinner, TimeDisplay } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './EventsAdminPage.module.scss';
import { EventDto } from '~/dto';
import { getEventsUpcomming } from '~/api';
import { Table, AlphabeticTableCell, ITableCell } from '~/Components/Table';
import { reverse } from '~/named-urls';

export function EventsAdminPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [allEvents, setAllEvents] = useState<EventDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  //TODO add permissions on render
  useEffect(() => {
    getEventsUpcomming()
      .then((data) => {
        setEvents(data);
        setAllEvents(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }, []);

  function deletePage(slug_field: string) {
    /**
    deleteInformationPage(slug_field).then((response) => {
      console.log(response);
      getevents()
        .then((data) => {
          E(data);
          setShowSpinner(false);
        })
        .catch(console.error);
    });
     */
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
        <Link target="backend" url={ROUTES.backend.admin__samfundet_eventgroup_changelist}>
          View in backend
        </Link>
      </div>
      <EventQuery allEvents={allEvents} setEvents={setEvents} />
      <div className={styles.tableContainer}>
        <Table
          columns={[t(KEY.common_title), t(KEY.start_time), t(KEY.event_type), t(KEY.organizer), t(KEY.venue), '']}
          data={events.map(function (element, key) {
            return [
              new AlphabeticTableCell(
                (
                  <Link
                    url={reverse({
                      pattern: ROUTES.frontend.event,
                      urlParams: { id: element.id },
                    })}
                  >
                    {element.title_no}
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
                    <Button theme="blue" display="block">
                      {t(KEY.edit)}
                    </Button>
                    <Button theme="samf" display="block">
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
