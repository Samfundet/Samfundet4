import { useGetOpenVenues } from '~/domain';
import { OpeningHours } from './OpeningHours';

export function OpeningHoursContainer() {
  const { data: openVenues, isLoading, isError } = useGetOpenVenues();

  return <OpeningHours venues={openVenues} isLoading={isLoading} isError={isError} />;
}
