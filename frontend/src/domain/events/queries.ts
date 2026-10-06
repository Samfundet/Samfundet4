import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
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
import type { EventDto, EventGroupDto, EventId, EventsPaginationType, Filters } from './types';

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

export function useGetEventsUpcomingPaginated(
  page: number,
  pageSize?: number,
  filters: Filters = {},
  props?: Partial<UseQueryOptions<EventsPaginationType<EventDto>>>,
) {
  return useQuery({
    queryKey: eventKeys.upcomingPaginated(page, pageSize, filters),
    queryFn: () => getEventsUpcomingPaginated(page, pageSize, filters),
    ...props,
  });
}

export function useGetEvent(id: EventId, props?: Partial<UseQueryOptions<EventDto>>) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => getEvent(id),
    ...props,
    enabled: !!id && (props?.enabled ?? true),
  });
}

export function useGetEventForCloning(id: EventId, props?: Partial<UseQueryOptions<Partial<EventDto>>>) {
  return useQuery({
    queryKey: eventKeys.clone(id),
    queryFn: () => getEventForCloning(id),
    ...props,
    enabled: !!id && (props?.enabled ?? true),
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
