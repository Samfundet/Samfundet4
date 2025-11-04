import { useQuery } from '@tanstack/react-query';
import { getOpenVenues } from '~/api';
import type { VenueDto } from '~/dto';
import { OpeningHours } from './OpeningHours';

export function OpeningHoursContainer() {
  const {
    data: openVenues,
    isLoading,
    isError,
  } = useQuery<VenueDto[]>({
    queryKey: venueKeys.list(['open']),
    queryFn: getOpenVenues,
  });

  return <OpeningHours venues={openVenues} isLoading={isLoading} isError={isError} />;
}
