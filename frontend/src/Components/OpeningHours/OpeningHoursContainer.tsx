import { useQuery } from '@tanstack/react-query';
import { getClosedPeriods, getOpenVenues } from '~/api';
import type { ClosedPeriodDto, VenueDto } from '~/dto';
import { OpeningHours } from './OpeningHours';

export function OpeningHoursContainer() {
  const {
    data: openVenues,
    isLoading: isLoadingVenues,
    isError: isErrorVenues,
  } = useQuery<VenueDto[]>({
    queryKey: ['openVenues'],
    queryFn: getOpenVenues,
  });

  const {
    data: closedPeriods,
    isLoading: isLoadingPeriods,
    isError: isErrorPeriods,
  } = useQuery<ClosedPeriodDto[]>({
    queryKey: ['closedPeriods'],
    queryFn: getClosedPeriods,
  })

  return <OpeningHours closedPeriods={closedPeriods} venues={openVenues} isLoading={isLoadingVenues || isLoadingPeriods} isError={isErrorVenues || isErrorPeriods} />;
}
