import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Button, EventQuery, TimeDisplay } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { PagedPagination } from '~/Components/Pagination';
import { Table } from '~/Components/Table';
import { deleteEvent, getEventsUpcommingPaginated } from '~/api';
import type { EventDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { eventKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import type { EventCategoryValue } from '~/types';
import { dbT, getTicketTypeKey, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './EventsAdminPage.module.scss';

const PAGE_SIZE = 20;

export function EventsAdminPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryValue | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const { t, i18n } = useTranslation();
  useTitle(t(KEY.admin_events_administrate));

  const [venues, setVenues] = useState<string[] | null>(null);
  const [categories, setCategories] = useState<EventCategoryValue[]>([]);
  const [ticketTypes, setTicketTypes] = useState<string[]>([]);

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchInput]);

  // Reset to page 1 when filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedVenue, selectedCategory, selectedTicketType]);

  // Fetch paginated events
  const { data, isLoading } = useQuery({
    queryKey: eventKeys.paginatedList(currentPage, PAGE_SIZE, {
      search: debouncedSearch || undefined,
      venue: selectedVenue || undefined,
      category: selectedCategory || undefined,
      ticket_type: selectedTicketType || undefined,
    }),
    queryFn: () =>
      getEventsUpcommingPaginated(currentPage, PAGE_SIZE, {
        search: debouncedSearch || undefined,
        venue: selectedVenue || undefined,
        category: selectedCategory || undefined,
        ticket_type: selectedTicketType || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const events = data?.results ?? [];
  const totalCount = data?.count ?? 0;

  // Extract metadata from API response
  useEffect(() => {
    if (data) {
      if (data.categories) {
        const rawCats = data.categories as (string | [string, string])[];
        setCategories(rawCats.map((cat) => (Array.isArray(cat) ? cat[0] : cat)) as EventCategoryValue[]);
      }
      if (data.locations) {
        setVenues(data.locations as string[]);
      }
      if (data.ticket_types) {
        const rawTts = data.ticket_types as (string | [string, string])[];
        setTicketTypes(rawTts.map((tt) => (Array.isArray(tt) ? tt[0] : tt)));
      }
    }
  }, [data]);

  function deleteSelectedEvent(id: number) {
    deleteEvent(id)
      .then(() => {
        // Refetch the current page
        toast.success(t(KEY.eventsadminpage_successful_delete_toast));
        // Force a refetch by triggering the query again
        navigate(ROUTES.frontend.admin_events);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  const tableColumns = [
    { content: t(KEY.common_title) },
    { content: t(KEY.start_time) },
    { content: t(KEY.category) },
    { content: t(KEY.admin_organizer) },
    { content: t(KEY.common_venue) },
    { content: t(KEY.common_ticket_type) },
    '', // Buttons
  ];

  const tableData = events.map((event: EventDto) => ({
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
              const msg = lowerCapitalize(`${t(KEY.form_confirm)} ${t(KEY.common_delete)}`);
              if (window.confirm(`${msg} ${dbT(event, 'title')}`)) {
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
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={isLoading}>
      <EventQuery
        venues={venues}
        categories={categories}
        ticketTypes={ticketTypes}
        selectedVenue={selectedVenue}
        setSelectedVenue={setSelectedVenue}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTicketType={selectedTicketType}
        setSelectedTicketType={setSelectedTicketType}
        search={searchInput}
        setSearch={setSearchInput}
      />
      <div className={styles.tableContainer}>
        <Table columns={tableColumns} data={tableData} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <PagedPagination
          currentPage={currentPage}
          totalItems={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminPageLayout>
  );
}
