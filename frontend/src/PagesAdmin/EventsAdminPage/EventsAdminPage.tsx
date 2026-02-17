import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Button, Carousel, EventQuery, ImageCard, TimeDisplay } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { PagedPagination } from '~/Components/Pagination';
import { Table } from '~/Components/Table';
import { deleteEvent, getEventsUpcomming } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { EventCategoryValue } from '~/types';
import { dbT, getTicketTypeKey, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './EventsAdminPage.module.scss';

const PAGE_SIZE = 20;

export function EventsAdminPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [allEvents, setAllEvents] = useState<EventDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t, i18n } = useTranslation();
  useTitle(t(KEY.admin_events_administrate));

  const [venues, setVenues] = useState<string[] | null>(null);
  const [categories, setCategories] = useState<EventCategoryValue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryValue | null>(null);
  const [search, setSearch] = useState<string>('');

  function getEvents(venue?: string | null, category?: EventCategoryValue | null) {
    getEventsUpcomming({ venue: venue ?? undefined, category: category ?? undefined })
      .then((data) => {
        setCategories(data.categories as EventCategoryValue[]);
        setVenues(data.locations);
        setEvents(data.events);
        setAllEvents(data.events);
        setShowSpinner(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  function filterEvents(): EventDto[] {
    const normalizedSearch = search.trim().toLowerCase();
    if (search === '') return events;
    const keywords = normalizedSearch.split(' ');

    return events.filter((event: EventDto) => {
      const title = (dbT(event, 'title', i18n.language) as string)?.toLowerCase() ?? '';
      return keywords.every((kw) => title.includes(kw));
    });
  }

  // Stuff to do on first render.
  // TODO add permissions on render
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getEvents(selectedVenue, selectedCategory);
  }, [selectedVenue, selectedCategory]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [events, search]);

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

  const filteredEvents = filterEvents();

  // Calculate paginated events
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  const data = paginatedEvents.map((event: EventDto) => ({
    cells: [
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
              const msg = lowerCapitalize(`${t(KEY.form_confirm)} ${t(KEY.common_delete)}`);
              if (window.confirm(`${msg} ${dbT(event, 'title')}`)) {
                // TODO toast component? A bit too easy to delete events
                deleteSelectedEvent(event.id);
              }
            }}
          />
        ),
      },
    ],
  }));

  const title = t(KEY.admin_events_administrate);
  const backendUrl = ROUTES.backend.admin__samfundet_event_changelist;
  const header = (
    <>
      <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_events_create)}>
        {lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_event)}`)}
      </Button>
    </>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <Carousel spacing={2} header="" className={styles.carousel} itemContainerClass={styles.carousel_item}>
        {allEvents.slice(0, Math.min(allEvents.length, 10)).map((event) => {
          return (
            <ImageCard
              key={event.id}
              title={dbT(event, 'title')}
              date={event.start_dt}
              subtitle=""
              imageUrl={BACKEND_DOMAIN + event.image_url}
              compact={true}
              ticket_type={event.ticket_type}
              host={event.host}
            />
          );
        })}
      </Carousel>
      <EventQuery
        venues={venues}
        categories={categories}
        selectedVenue={selectedVenue}
        setSelectedVenue={setSelectedVenue}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
      />
      <div className={styles.tableContainer}>
        <Table columns={tableColumns} data={data} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <PagedPagination
          currentPage={currentPage}
          totalItems={filteredEvents.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminPageLayout>
  );
}
