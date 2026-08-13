import { useQuery } from '@tanstack/react-query';
import { getActiveClosedPeriods, getClosedPeriod, getClosedPeriods } from '~/api';
import { closedPeriodKeys } from './queryKeys';

export function useGetClosedPeriod(id: number) {
  return useQuery({
    queryKey: closedPeriodKeys.detail(id),
    queryFn: () => getClosedPeriod(id),
  });
}

export function useGetClosedPeriods() {
  return useQuery({
    queryKey: closedPeriodKeys.all,
    queryFn: getClosedPeriods,
  });
}

export function useGetActiveClosedPeriods() {
  return useQuery({
    queryKey: closedPeriodKeys.all,
    queryFn: getActiveClosedPeriods,
  });
}
