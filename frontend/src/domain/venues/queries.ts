import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getOpenVenues, getVenues } from './api';
import { venueKeys } from './queryKeys';
import type { VenueDto } from './types';

export function useGetVenues(props?: Partial<UseQueryOptions<VenueDto[]>>) {
  return useQuery({
    queryKey: venueKeys.list([]),
    queryFn: getVenues,
    ...props,
  });
}

export function useGetOpenVenues(props?: Partial<UseQueryOptions<VenueDto[]>>) {
  return useQuery({
    queryKey: venueKeys.open(),
    queryFn: getOpenVenues,
    ...props,
  });
}
