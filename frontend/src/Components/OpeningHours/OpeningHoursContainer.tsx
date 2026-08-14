import { useQuery } from '@tanstack/react-query';
import { getVenues } from '~/api';
import { venueKeys } from '~/queryKeys';
import { getVenueDay, getVenueDaySchedule } from '~/utils';
import { OpeningHours } from './OpeningHours';

export function OpeningHoursContainer() {
  const {
    data: venues,
    isLoading,
    isError,
  } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
  });

  const day = getVenueDay();
  const openVenues = venues?.filter((v) => getVenueDaySchedule(v, day).isOpen);

  return <OpeningHours venues={openVenues} isLoading={isLoading} isError={isError} />;
}
