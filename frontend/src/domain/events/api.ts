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
 * @returns A map from day (formatted "YYYY-MM-DD") to the events on that day.
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
 * Get events for current day and forward.
 *
 * @param {Filters} params Filters for fetched events
 *
 * @returns All upcoming events that match given filters
 */
export async function getEventsUpcoming(params: Filters): Promise<EventsUpcomingResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__eventsupcoming;

  const response = await axios.get<EventsUpcomingBackendResponse>(url, {
    withCredentials: true,
    params: {
      ...(params.search ? { search: params.search } : {}),
      ...(params.event_group ? { event_group: params.event_group } : {}),
      ...(params.venue ? { venue: params.venue } : {}),
      ...(params?.ticket_type ? { ticket_type: params.ticket_type } : {}),
      ...(params.category ? { category: params.category } : {}),
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
 * Get events for current day and forward, paginated
 *
 * @param {number} page What page to fetch (page 2 with a page size of 10 would return events 11-20)
 * @param {number} pageSize How many events per page
 * @param {Filters} params Filters for fetched events
 *
 * @returns Given page of size pageSize of upcoming events
 * */
export async function getEventsUpcomingPaginated(
  page: number,
  pageSize?: number,
  params?: Filters,
): Promise<EventsPaginationType<EventDto>> {
  const url = buildPaginatedUrl(BACKEND_DOMAIN + ROUTES.backend.samfundet__eventsupcoming, page, pageSize, {
    ...(params?.search ? { search: params.search } : {}),
    ...(params?.venue ? { venue: params.venue } : {}),
    ...(params?.category ? { category: params.category } : {}),
    ...(params?.event_group ? { event_group: params.event_group } : {}),
    ...(params?.ticket_type ? { ticket_type: params.ticket_type } : {}),
  });

  const response = await axios.get<EventsPaginationType<EventDto>>(url, { withCredentials: true });
  return response.data;
}

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
