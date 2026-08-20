import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getActiveClosedPeriods, getClosedPeriod, getClosedPeriods } from '~/api';
import { closedPeriodKeys } from './queryKeys';
import type { ClosedPeriodDto } from '~/dto';

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
