import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import {
  type Slug,
  type VenueDaySchedule,
  type VenueDto,
  applyVenueDayScheduleChanges,
  diffVenueOpeningHours,
  extractVenueDaySchedule,
  isVenueDayScheduleValid,
  useGetVenues,
  useUpdateVenueOpeningHours,
} from '~/domain';

import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ALL_DAYS, type Day } from '~/types';
import { lowerCapitalize } from '~/utils';
import { AdminPage } from '../AdminPageLayout';
import styles from './OpeningHoursAdminPage.module.scss';
import { VenueOpeningHoursBox } from './VenueOpeningHoursBox';

export function OpeningHoursAdminPage() {
  const { t } = useTranslation();
  useTitle(lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_opening_hours)}`));

  const { data: venues = [], isLoading } = useGetVenues({
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });

  const [{ draftVenues, touchedDays }, setFormState] = useState<{
    draftVenues: VenueDto[] | null;
    touchedDays: Set<string>;
  }>({ draftVenues: null, touchedDays: new Set() });

  const displayedVenues = draftVenues ?? venues;
  const invalidDays = displayedVenues.flatMap((venue) =>
    ALL_DAYS.filter(
      (day) => touchedDays.has(`${venue.slug}:${day}`) && !isVenueDayScheduleValid(extractVenueDaySchedule(venue, day)),
    ).map((day) => `${venue.slug}:${day}`),
  );
  const updates = draftVenues ? diffVenueOpeningHours(venues, draftVenues) : [];

  const { mutate: saveOpeningHours, isPending } = useUpdateVenueOpeningHours();

  function commitDayChange(venueSlug: Slug, weekday: Day, changes: Partial<VenueDaySchedule>) {
    if (isPending) return;

    setFormState((current) => ({
      draftVenues: (current.draftVenues ?? venues).map((venue) =>
        venue.slug === venueSlug ? applyVenueDayScheduleChanges(venue, weekday, changes) : venue,
      ),
      touchedDays: new Set(current.touchedDays).add(`${venueSlug}:${weekday}`),
    }));
  }

  function resetDraft() {
    setFormState({ draftVenues: null, touchedDays: new Set() });
  }

  function handleSave() {
    if (invalidDays.length > 0 || updates.length === 0 || isPending) return;
    saveOpeningHours(updates, {
      onSuccess: ({ failedSlugs }) => {
        resetDraft();

        if (failedSlugs.length > 0) {
          toast.error(t(KEY.admin_opening_hours_partial_save_failure, { venues: failedSlugs.join(', ') }));
        } else {
          toast.success(t(KEY.common_save_successful));
        }
      },
    });
  }

  const header = (
    <div className={styles.actions}>
      <Button theme="secondary" disabled={isPending || updates.length === 0} onClick={resetDraft}>
        {t(KEY.admin_opening_hours_revert)}
      </Button>
      <Button type="submit" disabled={isPending || updates.length === 0 || invalidDays.length > 0}>
        {t(KEY.common_save)}
      </Button>
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
              invalidDays={invalidDays}
              disabled={isPending}
              onCommitDay={commitDayChange}
            />
          ))}
        </div>
      </AdminPage>
    </form>
  );
}
