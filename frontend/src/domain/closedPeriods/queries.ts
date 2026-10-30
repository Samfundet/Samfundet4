import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { ID } from '../types';
import { getActiveClosedPeriods, getClosedPeriod, getClosedPeriods } from './api';
import { closedPeriodKeys } from './queryKeys';
import type { ClosedPeriodDto } from './types';

export function useGetClosedPeriod(id: ID, props?: Partial<UseQueryOptions<ClosedPeriodDto>>) {
  return useQuery({
    queryKey: closedPeriodKeys.detail(id),
    queryFn: () => getClosedPeriod(id),
    enabled: !!id,
    ...props,
  });
}

export function useGetClosedPeriods(props?: Partial<UseQueryOptions<ClosedPeriodDto[]>>) {
  return useQuery({
    queryKey: closedPeriodKeys.list(),
    queryFn: getClosedPeriods,
    ...props,
  });
}

export function useGetActiveClosedPeriods(props?: Partial<UseQueryOptions<ClosedPeriodDto[]>>) {
  return useQuery({
    queryKey: closedPeriodKeys.active(),
    queryFn: getActiveClosedPeriods,
    ...props,
  });
}
