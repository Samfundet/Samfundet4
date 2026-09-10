import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { ClosedPeriodDto } from '~/dto';
import { getActiveClosedPeriods, getClosedPeriod, getClosedPeriods } from './api';
import { closedPeriodKeys } from './queryKeys';

export function useGetClosedPeriod(id: number, props?: Partial<UseQueryOptions<ClosedPeriodDto>>) {
  return useQuery({
    queryKey: closedPeriodKeys.detail(id),
    queryFn: () => getClosedPeriod(id),
    enabled: !!id,
    ...props,
  });
}

export function useGetClosedPeriods(props?: Partial<UseQueryOptions<ClosedPeriodDto[]>>) {
  return useQuery({
    queryKey: closedPeriodKeys.all,
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
