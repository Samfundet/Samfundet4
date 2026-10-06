import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import {
  type VenueDaySchedule,
  type VenueDto,
  type VenueOpeningHoursUpdate,
  applyVenueDayScheduleChanges,
  getVenueOpeningHoursChanges,
  getVenues,
  patchVenue,
  venueKeys,
} from '~/domain';

import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import type { Day } from '~/types';
import { lowerCapitalize } from '~/utils';
import { AdminPage } from '../AdminPageLayout';
import styles from './OpeningHoursAdminPage.module.scss';
import { VenueOpeningHoursBox } from './VenueOpeningHoursBox';

export function OpeningHoursAdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  useTitle(lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_opening_hours)}`));

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });

  const [draftVenues, setDraftVenues] = useState<VenueDto[] | null>(null);
  const displayedVenues = draftVenues ?? venues;
  const updates = draftVenues ? getVenueOpeningHoursChanges(venues, draftVenues) : [];
  const hasChanges = updates.length > 0;

  const saveMutation = useMutation({
    mutationFn: (updates: VenueOpeningHoursUpdate[]) =>
      Promise.allSettled(updates.map(({ slug, changes }) => patchVenue(slug, changes))),
    onSuccess: async (results, updates) => {
      const failedSlugs: string[] = [];

      for (const [index, result] of results.entries()) {
        if (result.status === 'rejected') {
          failedSlugs.push(updates[index].slug);
          console.error(`Error updating venue ${updates[index].slug}:`, result.reason);
        }
      }

      await queryClient.invalidateQueries({ queryKey: venueKeys.all });
      setDraftVenues(null);

      if (failedSlugs.length > 0) {
        toast.error(t(KEY.admin_opening_hours_partial_save_failure, { venues: failedSlugs.join(', ') }));
      } else {
        toast.success(t(KEY.common_save_successful));
      }
    },
  });

  function handleChangeDay(venueSlug: string, weekday: Day, changes: Partial<VenueDaySchedule>) {
    if (saveMutation.isPending) return;
    setDraftVenues((currentDraft) => {
      const currentVenues = currentDraft ?? venues;

      return currentVenues.map((venue) => {
        if (venue.slug !== venueSlug) return venue;

        return applyVenueDayScheduleChanges(venue, weekday, changes);
      });
    });
  }

  const header = (
    <div className={styles.actions}>
      <Button theme="secondary" disabled={!hasChanges || saveMutation.isPending} onClick={() => setDraftVenues(null)}>
        {t(KEY.admin_opening_hours_revert)}
      </Button>
      <Button disabled={!hasChanges || saveMutation.isPending} onClick={() => saveMutation.mutate(updates)}>
        {t(KEY.common_save)}
      </Button>
    </div>
  );

  return (
    <AdminPage title={t(KEY.common_opening_hours)} header={header} loading={isLoading}>
      <div className={styles.venue_container}>
        {displayedVenues.map((venue) => (
          <VenueOpeningHoursBox
            key={venue.slug}
            venue={venue}
            disabled={saveMutation.isPending}
            onChangeDay={handleChangeDay}
          />
        ))}
      </div>
    </AdminPage>
  );
}
