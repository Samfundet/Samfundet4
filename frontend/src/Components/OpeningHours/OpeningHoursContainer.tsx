import { useQuery } from '@tanstack/react-query';
import { getOpenVenues } from '~/api';
import { type VenueDto, venueKeys } from '~/domain';
import { OpeningHours } from './OpeningHours';

export function OpeningHoursContainer() {
  const {
    data: openVenues,
    isLoading,
    isError,
  } = useQuery<VenueDto[]>({
    queryKey: venueKeys.open(),
    queryFn: getOpenVenues,
  });

  return <OpeningHours venues={openVenues} isLoading={isLoading} isError={isError} />;
}
