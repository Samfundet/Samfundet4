import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getOpenVenues } from '~/api';
import { Text } from '~/Components/Text';
import { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { OpeningHours } from './OpeningHours';

export function OpeningHoursContainer() {
  const { t } = useTranslation();
  const { data: openVenues, isLoading, isError } = useQuery<VenueDto[]>({
    queryKey: ['openVenues'],
    queryFn: getOpenVenues,
  });

  if (isLoading) {
    return <Text>{t(KEY.common_loading)}</Text>;
  }

  if (isError || !openVenues) {
    return <Text>{t(KEY.error_generic)}</Text>;
  }

  const today = new Date().toISOString().split('T')[0];
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  const venues = openVenues.map((venue) => {
    const openingTime = venue[`opening_${day}` as keyof VenueDto] as string;
    const closingTime = venue[`closing_${day}` as keyof VenueDto] as string;
    return {
      name: venue.name,
      opening: `${today}T${openingTime}`,
      closing: `${today}T${closingTime}`,
    };
  });

  return <OpeningHours venues={venues} />;
}
