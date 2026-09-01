import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import {
  type EventsUpcomingResponse,
  getBilligEvents,
  getEvent,
  getEventGroups,
  getEvents,
  getEventsPerDay,
  getEventsUpcomming,
  getEventsUpcommingPaginated,
} from '~/api';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import type { EventDto, EventGroupDto } from '~/dto';
import type { EventsPaginationType } from '~/types';
import { eventKeys } from './queryKeys';

// Derived from the API function so the two can't drift; this is the filter
// shape the upcoming-events endpoints actually accept.
export type Filters = NonNullable<Parameters<typeof getEventsUpcommingPaginated>[2]>;

export function useGetEventsPerDay(props?: Partial<UseQueryOptions<Record<string, EventDto[]>>>) {
  return useQuery({
    queryKey: eventKeys.all,
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

export function useGetEventsUpcomming(filters: Filters, props?: Partial<UseQueryOptions<EventsUpcomingResponse>>) {
  return useQuery({
    queryKey: eventKeys.list(filters),
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

export function useGetEvent(id?: string | number, props?: Partial<UseQueryOptions<EventDto>>) {
  return useQuery({
    queryKey: eventKeys.detail(id ?? 'no-id'),
    queryFn: () => getEvent(id as string | number),
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
    queryKey: eventKeys.billig,
    queryFn: getBilligEvents,
    ...props,
  });
}
