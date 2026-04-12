import { useTranslation } from 'react-i18next';
import { Page } from '~/Components';
import { useTitle } from '~/hooks';
import { useState } from 'react';
import { getVenues } from '~/api';
import { useQuery } from '@tanstack/react-query';
import { venueKeys } from '~/queryKeys';
import { KEY } from '~/i18n/constants';

export function WeeklyOpeningPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_opening_hours))

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });
  console.log(venues)


  return <Page loading={isLoading}>Test</Page>;
}
