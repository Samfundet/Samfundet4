import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import {
  type EventsUpcomingResponse,
  getBilligEvents,
  getEvent,
  getEventGroups,
  getEventsPerDay,
  getEventsUpcomming,
  getEventsUpcommingPaginated,
} from '~/api';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import type { EventDto, EventGroupDto } from '~/dto';
import type { EventsPaginationType } from '~/types';
import { eventKeys } from './queryKeys';

export interface Filters {
  search?: string;
  event_group?: string;
  venue?: string;
  category?: string;
}

export function useGetEventsPerDay(props?: Partial<UseQueryOptions<Record<string, EventDto[]>>>) {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: getEventsPerDay,
    ...props,
  });
}

export function useGetEventsUpcomming(filters: Filters, props?: Partial<UseQueryOptions<EventsUpcomingResponse>>) {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: () => getEventsUpcomming(filters),
    ...props,
  });
}

export function useGetEventsUpcommingPaginated(
  page: number,
  pageSize?: number,
  filters: Filters = {},
  props?: Partial<UseQueryOptions<EventsPaginationType<EventDto>>>,
) {
  return useQuery({
    queryKey: eventKeys.paginatedList(page, pageSize, filters),
    queryFn: () => getEventsUpcommingPaginated(page, pageSize, filters),
    ...props,
  });
}

export function useGetEvent(id: string | number = 'no-id', props?: Partial<UseQueryOptions<EventDto>>) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => getEvent(id),
    enabled: !!id,
    ...props,
  });
}

export function useGetEventGroups(props?: Partial<UseQueryOptions<EventGroupDto[]>>) {
  return useQuery({
    queryKey: eventKeys.details(),
    queryFn: getEventGroups,
    ...props,
  });
}

export function useGetBilligEvents(props?: Partial<UseQueryOptions<BilligEventDto[]>>) {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: getBilligEvents,
    ...props,
  });
}
