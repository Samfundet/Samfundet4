import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputTime } from '~/Components';
import { Badge, useDynamicBadge } from '~/Components/Badge';
import { getVenues, patchVenue } from '~/api';
import type { VenueDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import { ALL_DAYS } from '~/types';
import { getDayKey, lowerCapitalize } from '~/utils';
import { AdminPage } from '../AdminPageLayout';
import styles from './OpeningHoursAdminPage.module.scss';

export function OpeningHoursAdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [saveTimer, setSaveTimer] = useState<Record<string, NodeJS.Timeout>>({});
  const { badgeState, showSuccess, showError } = useDynamicBadge({
    defaultDuration: 3000,
  });
  useTitle(lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_opening_hours)}`));

  // Use React Query to fetch venues
  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
    // Sort venues by name for a stable order
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });

  // We need a reference to read changed state inside timeout
  const venueRef = useRef(venues);

  // Use React Query mutation to update venues
  const updateVenueMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<VenueDto> }) => patchVenue(slug, data),
    // Update cache in place instead of invalidating
    onSuccess: (updated: VenueDto, vars) => {
      queryClient.setQueryData<VenueDto[]>(venueKeys.all, (oldVenues = []) =>
        oldVenues.map((venue) => (venue.slug === vars.slug ? { ...venue, ...vars.data } : venue)),
      );

      // Show success badge
      showSuccess(t(KEY.common_save_successful));
    },
    onError: (error) => {
      // Show error badge
      showError(t(KEY.common_something_went_wrong));
      console.error('Error updating venue:', error);
    },
  });

  // Update venueRef when venues data changes
  venueRef.current = venues;

  // Save venue change using React Query mutation
  function saveVenue(venue: VenueDto, field: keyof VenueDto, value: string) {
    // Update optimistic state
    const updatedVenues = venues.map((v) => (v.id === venue.id ? { ...v, [field]: value } : v));
    venueRef.current = updatedVenues;

    // Send field change to backend using mutation
    updateVenueMutation.mutate({
      slug: venue.slug,
      data: { [field]: value },
    });
  }

  // Update view model on field with optimistic updates
  function handleOnChange(venue: VenueDto, field: keyof VenueDto) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      // Optimistically update the query cache
      queryClient.setQueryData(venueKeys.all, (oldVenues: VenueDto[] | undefined) => {
        if (!oldVenues) return [];
        return oldVenues.map((v) => {
          if (v.id === venue.id) {
            return { ...v, [field]: value };
          }
          return v;
        });
      });

      // Cancel old save timer if any
      const timer_id = `${venue.id}_${field}`;
      if (saveTimer[timer_id] !== undefined) {
        clearTimeout(saveTimer[timer_id]);
      }

      // Start a new save timer
      const timer = setTimeout(() => {
        saveVenue(venue, field, value);
      }, 1000);

      // Store timeout to allow cancel
      setSaveTimer({
        ...saveTimer,
        [timer_id]: timer,
      });
    };
  }

  /**
   * Box for a single venue.
   * Shows open/close times for each day.
   * */
  function venueBox(venue: VenueDto) {
    return (
      <div className={styles.venue_box} key={venue.id}>
        <div className={styles.venue_header}>{venue.name}</div>
        <div className={styles.venue_content}>
          <div className={styles.input_row}>
            {ALL_DAYS.map((day) => {
              const openField: keyof VenueDto = `opening_${day}`;
              const closeField: keyof VenueDto = `closing_${day}`;
              // Edit tools
              return (
                <div key={day} className={styles.day_row}>
                  <div className={styles.day_label}>{t(getDayKey(day))}</div>
                  <div className={styles.day_edit}>
                    <InputTime
                      value={venue[openField]}
                      onChange={() => handleOnChange(venue, openField)}
                      onBlur={(formattedTime) => saveVenue(venue, openField, formattedTime)}
                    />
                    <p>-</p>
                    <InputTime
                      value={venue[closeField]}
                      onChange={() => handleOnChange(venue, closeField)}
                      onBlur={(formattedTime) => saveVenue(venue, closeField, formattedTime)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const header = (
    <div>
      <div className={styles.subtitle}>{t(KEY.admin_opening_hours_hint)}</div>
      {badgeState.show && <Badge text={badgeState.text} type={badgeState.type} animated={true} />}
    </div>
  );

  return (
    <AdminPage title={t(KEY.common_opening_hours)} header={header} loading={isLoading}>
      <div className={styles.venue_container}>{venues.map((venue) => venueBox(venue))}</div>
    </AdminPage>
  );
}
