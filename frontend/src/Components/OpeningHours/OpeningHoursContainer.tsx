import { useQuery } from '@tanstack/react-query';
import { getOpenVenues } from '~/api';
import { VenueDto } from '~/dto';
import { OpeningHours } from './OpeningHours';

export function OpeningHoursContainer() {
  const { data: openVenues, isLoading, isError } = useQuery<VenueDto[]>({
    queryKey: ['openVenues'],
    queryFn: getOpenVenues,
  });

  return <OpeningHours venues={openVenues} isLoading={isLoading} isError={isError} />;
}
