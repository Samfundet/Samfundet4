import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, EventQuery, TimeDisplay } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { deleteEvent, getEventsUpcomming } from '~/api';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, getTicketTypeKey } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
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
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  // Stuff to do on first render.
  // TODO add permissions on render

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function deleteSelectedEvent(id: number) {
    deleteEvent(id)
      .then(() => {
        getEvents();
        toast.success(t(KEY.eventsadminpage_successful_delete_toast));
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  const tableColumns = [
    { content: t(KEY.common_title), sortable: true },
    { content: t(KEY.start_time), sortable: true },
    { content: t(KEY.category), sortable: true },
    { content: t(KEY.admin_organizer), sortable: true },
    { content: t(KEY.common_venue), sortable: true },
    { content: t(KEY.common_ticket_type), sortable: true },
    '', // Buttons
  ];

  const data = events.map(function (event: EventDto) {
    return [
      dbT(event, 'title', i18n.language) as string,
      { content: <TimeDisplay timestamp={event.start_dt} />, value: event.start_dt },
      event.category,
      event.host,
      event.location,
      t(getTicketTypeKey(event.ticket_type)),
      {
        content: (
          <CrudButtons
            onView={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.event,
                  urlParams: { id: event.id },
                }),
              );
            }}
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
              if (window.confirm(`${t(KEY.form_confirm)} ${t(KEY.common_delete)} ${dbT(event, 'title')}`)) {
                // TODO toast component? A bit too easy to delete events
                deleteSelectedEvent(event.id);
              }
            }}
          />
        ),
      },
    ];
  });

  const title = `${t(KEY.common_edit)} ${t(KEY.common_event).toLowerCase()}`;
  const backendUrl = ROUTES.backend.admin__samfundet_event_changelist;
  const header = (
    <>
      <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_events_create)}>
        {t(KEY.common_create)} {t(KEY.common_events)}
      </Button>
    </>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <EventQuery allEvents={allEvents} setEvents={setEvents} />
      <div className={styles.tableContainer}>
        <Table columns={tableColumns} data={data} />
      </div>
    </AdminPageLayout>
  );
}
