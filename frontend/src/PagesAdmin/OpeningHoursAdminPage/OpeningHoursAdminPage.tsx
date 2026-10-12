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
  getVenueDaySchedule,
  getVenueOpeningHoursChanges,
  getVenues,
  isVenueDayScheduleValid,
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

  const [{ draftVenues, invalidDays }, setFormState] = useState<{
    draftVenues: VenueDto[] | null;
    invalidDays: Set<string>;
  }>({ draftVenues: null, invalidDays: new Set() });

  const displayedVenues = draftVenues ?? venues;
  const updates = draftVenues ? getVenueOpeningHoursChanges(venues, draftVenues) : [];

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
      resetDraft();

      if (failedSlugs.length > 0) {
        toast.error(t(KEY.admin_opening_hours_partial_save_failure, { venues: failedSlugs.join(', ') }));
      } else {
        toast.success(t(KEY.common_save_successful));
      }
    },
  });

  function commitDayChange(venueSlug: string, weekday: Day, changes: Partial<VenueDaySchedule>) {
    if (saveMutation.isPending) return;

    setFormState((current) => {
      const currentVenues = current.draftVenues ?? venues;
      const venue = currentVenues.find((venue) => venue.slug === venueSlug);
      if (!venue) return current;

      const updatedVenue = applyVenueDayScheduleChanges(venue, weekday, changes);
      const nextInvalidDays = new Set(current.invalidDays);
      const dayKey = `${venueSlug}:${weekday}`;

      if (isVenueDayScheduleValid(getVenueDaySchedule(updatedVenue, weekday))) {
        nextInvalidDays.delete(dayKey);
      } else {
        nextInvalidDays.add(dayKey);
      }

      return {
        draftVenues: currentVenues.map((venue) => (venue.slug === venueSlug ? updatedVenue : venue)),
        invalidDays: nextInvalidDays,
      };
    });
  }

  function resetDraft() {
    setFormState({ draftVenues: null, invalidDays: new Set() });
  }

  function handleSave() {
    if (invalidDays.size > 0 || updates.length === 0 || saveMutation.isPending) return;
    saveMutation.mutate(updates);
  }

  const header = (
    <div className={styles.actions}>
      <Button theme="secondary" disabled={saveMutation.isPending || updates.length === 0} onClick={resetDraft}>
        {t(KEY.admin_opening_hours_revert)}
      </Button>
      <Button type="submit" disabled={saveMutation.isPending || updates.length === 0 || invalidDays.size > 0}>
        {t(KEY.common_save)}
      </Button>
      <div className={styles.validation_errors}>
        {invalidDays.size > 0 && (
          <>
            <strong>{t(KEY.admin_opening_hours_invalid)}</strong>
            <ul>
              {[...invalidDays].map((dayKey) => (
                <li key={dayKey}>{dayKey}</li>
              ))}
            </ul>
            <p>{t(KEY.admin_opening_hours_validation_hint)}</p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      <AdminPage title={t(KEY.common_opening_hours)} header={header} loading={isLoading}>
        <div className={styles.venue_container}>
          {displayedVenues.map((venue) => (
            <VenueOpeningHoursBox
              key={venue.slug}
              venue={venue}
              disabled={saveMutation.isPending}
              onCommitDay={commitDayChange}
            />
          ))}
        </div>
      </AdminPage>
    </form>
  );
}
