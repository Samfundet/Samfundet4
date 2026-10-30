import { type UseQueryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import type { ID } from '../types';
import {
  getBilligEvents,
  getEvent,
  getEventForCloning,
  getEventGroups,
  getEvents,
  getEventsPerDay,
  getEventsUpcomingPaginated,
} from './api';
import { billigKeys, eventKeys } from './queryKeys';
import type { EventDto, EventFilters, EventGroupDto, EventsPaginationType } from './types';

export function useGetEventsPerDay(props?: Partial<UseQueryOptions<Record<string, EventDto[]>>>) {
  return useQuery({
    queryKey: eventKeys.perDay(),
    queryFn: getEventsPerDay,
    ...props,
  });
}

export function useGetEvents(props?: Partial<UseQueryOptions<EventDto[]>>) {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn: getEvents,
    ...props,
  });
}

export function useGetEventsUpcomingPaginated(
  page: number,
  pageSize?: number,
  filters: EventFilters = {},
  props?: Partial<UseQueryOptions<EventsPaginationType<EventDto>>>,
) {
  return useQuery({
    queryKey: eventKeys.upcomingPaginated(page, pageSize, filters),
    queryFn: () => getEventsUpcomingPaginated(page, pageSize, filters),
    ...props,
  });
}

export function useGetEvent(id: ID | undefined) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: id !== undefined ? () => getEvent(id) : skipToken,
  });
}

export function useGetEventForCloning(id: ID | undefined) {
  return useQuery({
    queryKey: eventKeys.clone(id),
    queryFn: id !== undefined ? () => getEventForCloning(id) : skipToken,
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
