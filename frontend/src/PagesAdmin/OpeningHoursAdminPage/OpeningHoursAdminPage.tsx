import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVenues } from '~/api';
import type { VenueDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import type { Day } from '~/types';
import { lowerCapitalize } from '~/utils';
import { AdminPage } from '../AdminPageLayout';
import styles from './OpeningHoursAdminPage.module.scss';
import { VenueOpeningHoursBox } from './VenueOpeningHoursBox';
import type { VenueDaySchedule } from './types';
import { getVenueDaySchedule, updateVenueDaySchedule } from './utils';

export function OpeningHoursAdminPage() {
  const { t } = useTranslation();
  useTitle(lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_opening_hours)}`));

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });

  const [draftVenues, setDraftVenues] = useState<VenueDto[] | null>(null);
  const displayedVenues = draftVenues ?? venues;

  function handleChangeDay(venueSlug: string, weekday: Day, changes: Partial<VenueDaySchedule>) {
    setDraftVenues((currentDraft) => {
      const currentVenues = currentDraft ?? venues;

      return currentVenues.map((venue) => {
        if (venue.slug !== venueSlug) return venue;

        const currentSchedule = getVenueDaySchedule(venue, weekday);
        return updateVenueDaySchedule(venue, weekday, { ...currentSchedule, ...changes });
      });
    });
  }

  return (
    <AdminPage title={t(KEY.common_opening_hours)} loading={isLoading}>
      <div className={styles.venue_container}>
        {displayedVenues.map((venue) => (
          <VenueOpeningHoursBox key={venue.slug} venue={venue} onChangeDay={handleChangeDay} />
        ))}
      </div>
    </AdminPage>
  );
}
