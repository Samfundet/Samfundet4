import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import type { EventDto, EventGroupDto } from '~/dto';
import type { EventsPaginationType } from '~/types';
import {
  type EventsUpcomingResponse,
  getBilligEvents,
  getEvent,
  getEventForCloning,
  getEventGroups,
  getEvents,
  getEventsPerDay,
  getEventsUpcoming,
  getEventsUpcomingPaginated,
} from './api';
import { billigKeys, eventCloneKeys, eventKeys } from './queryKeys';

export interface Filters {
  search?: string;
  event_group?: string;
  ticket_type?: string;
  venue?: string;
  category?: string;
}

export function useGetEventsPerDay(props?: Partial<UseQueryOptions<Record<string, EventDto[]>>>) {
  return useQuery({
    queryKey: eventKeys.perDay(),
    queryFn: getEventsPerDay,
    ...props,
  });
}

export function useGetEvents(props?: Partial<UseQueryOptions<EventDto[]>>) {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: getEvents,
    ...props,
  });
}

export function useGetEventsUpcoming(filters: Filters, props?: Partial<UseQueryOptions<EventsUpcomingResponse>>) {
  return useQuery({
    queryKey: eventKeys.upcoming(filters),
    queryFn: () => getEventsUpcoming(filters),
    ...props,
  });
}

export function useGetEventsUpcomingPaginated(
  page: number,
  pageSize?: number,
  filters: Filters = {},
  props?: Partial<UseQueryOptions<EventsPaginationType<EventDto>>>,
) {
  return useQuery({
    queryKey: eventKeys.paginated(page, pageSize, filters),
    queryFn: () => getEventsUpcomingPaginated(page, pageSize, filters),
    ...props,
  });
}

export function useGetEvent(id: string, props?: Partial<UseQueryOptions<EventDto>>) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => getEvent(id),
    enabled: !!id,
    ...props,
  });
}

export function useGetEventForCloning(id: string, props?: Partial<UseQueryOptions<Partial<EventDto>>>) {
  return useQuery({
    queryKey: eventCloneKeys.detail(id),
    queryFn: () => getEventForCloning(id),
    enabled: !!id,
    ...props,
  });
}

export function useGetEventGroups(props?: Partial<UseQueryOptions<EventGroupDto[]>>) {
  return useQuery({
    queryKey: eventKeys.groups(),
    queryFn: getEventGroups,
    ...props,
  });
}

export function useGetBilligEvents(props?: Partial<UseQueryOptions<BilligEventDto[]>>) {
  return useQuery({
    queryKey: billigKeys.all,
    queryFn: getBilligEvents,
    ...props,
  });
}
