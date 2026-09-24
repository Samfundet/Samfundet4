import axios, { type AxiosResponse } from 'axios';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto, EventGroupDto, EventWriteDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { EventsPaginationType } from '~/types';
import { buildPaginatedUrl } from '~/utils';
import type { Filters } from './queries';

/**
 * Groups events by day.
 *
 * @returns A Record of upcoming events grouped by the day they happen, eg: '2026-09-25': [eventDto, eventDto].
 */
export async function getEventsPerDay(): Promise<Record<string, EventDto[]>> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__eventsperday;
  const response = await axios.get<Record<string, EventDto[]>>(url, { withCredentials: true });

  return response.data;
}

export type EventsUpcomingBackendResponse = {
  events: EventDto[];
  categories: [string, string][];
  locations: string[];
};

export type EventsUpcomingResponse = {
  events: EventDto[];
  categories: string[];
  locations: string[];
};

/**
 * Get upcoming events from today and onwards.
 *
 * @param {Filters} filters Filters for fetched events
 *
 * @returns All upcoming events that match given filters
 */
export async function getEventsUpcoming(filters: Filters): Promise<EventsUpcomingResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__eventsupcoming;

  const response = await axios.get<EventsUpcomingBackendResponse>(url, {
    withCredentials: true,
    params: {
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.event_group ? { event_group: filters.event_group } : {}),
      ...(filters.venue ? { venue: filters.venue } : {}),
      ...(filters.ticket_type ? { ticket_type: filters.ticket_type } : {}),
      ...(filters.category ? { category: filters.category } : {}),
    },
  });

  const categories = response.data.categories.map((category: [string, string]) => category[0]);

  return {
    events: response.data.events,
    categories,
    locations: response.data.locations,
  };
}

/**
 * Get upcoming events from today and onwards, paginated.
 *
 * @param {number} page What page to fetch (page 2 with a page size of 10 would return events 11-20)
 * @param {number} pageSize How many events per page (backend defaults to 10, max 50)
 * @param {Filters} filters Filters for fetched events
 *
 * @returns The given page of upcoming events, with up to pageSize events
 * */
export async function getEventsUpcomingPaginated(
  page: number,
  pageSize?: number,
  filters?: Filters,
): Promise<EventsPaginationType<EventDto>> {
  const url = buildPaginatedUrl(BACKEND_DOMAIN + ROUTES.backend.samfundet__eventsupcoming, page, pageSize, {
    ...(filters?.search ? { search: filters.search } : {}),
    ...(filters?.venue ? { venue: filters.venue } : {}),
    ...(filters?.category ? { category: filters.category } : {}),
    ...(filters?.event_group ? { event_group: filters.event_group } : {}),
    ...(filters?.ticket_type ? { ticket_type: filters.ticket_type } : {}),
  });

  const response = await axios.get<EventsPaginationType<EventDto>>(url, { withCredentials: true });
  return response.data;
}

/**
 * Get all events in database
 *
 * @returns Array of EventDto
 * */
export async function getEvents(): Promise<EventDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__events_list;
  const response = await axios.get<EventDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function postEvent(data: Partial<EventWriteDto>): Promise<AxiosResponse<EventDto>> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__events_list;
  const response = await axios.post<EventDto>(url, data, { withCredentials: true });
  return response;
}

export async function putEvent(id: string | number, data: Partial<EventWriteDto>): Promise<AxiosResponse<EventDto>> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: id } });
  const response = await axios.put<EventDto>(url, data, { withCredentials: true });
  return response;
}

export async function deleteEvent(id: string | number): Promise<AxiosResponse<void>> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: id } });
  const response = await axios.delete<void>(url, { withCredentials: true });
  return response;
}

export async function getEvent(pk: string | number): Promise<EventDto> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__events_detail, urlParams: { pk: pk } });
  const response = await axios.get<EventDto>(url, { withCredentials: true });

  return response.data;
}

/**
 * Returns all event groups. An event group is an event that spans more than one day,
 * requiring multiple events to be created in the database. Those events are then put into an event group.
 *
 * @returns Array of all upcoming event groups
 * */
export async function getEventGroups(): Promise<EventGroupDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__eventgroups_list;
  const response = await axios.get<EventGroupDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getBilligEvents(): Promise<BilligEventDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__billig_event_list;
  const response = await axios.get<BilligEventDto[]>(url, { withCredentials: true });
  return response.data;
}

/**
 * Get a copy of an event without unique properties, used as a starting point when cloning.
 *
 * @param {string | number} pk Id of the event to copy
 *
 * @returns Copy of the event
 * */
export async function getEventForCloning(pk: string | number): Promise<Partial<EventDto>> {
  const url = BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__event_clone, urlParams: { pk: pk } });
  const response = await axios.get<Partial<EventDto>>(url, { withCredentials: true });

  return response.data;
}
