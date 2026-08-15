import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getEventsPerDay } from '~/api';
import type { EventDto } from '~/dto';
import { eventKeys } from '~/queryKeys';

export function useGetEventsPerDay(props?: Partial<UseQueryOptions<EventDto[]>>) {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: getEventsPerDay,
    ...props,
  });
}
