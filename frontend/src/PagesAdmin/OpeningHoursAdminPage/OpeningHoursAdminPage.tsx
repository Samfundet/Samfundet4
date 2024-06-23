import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { InputTime } from '~/Components';
import { getVenues, putVenue } from '~/api';
import type { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ALL_DAYS } from '~/types';
import { getDayKey } from '~/utils';
import { AdminPage } from '../AdminPageLayout';
import styles from './OpeningHoursAdminPage.module.scss';

export function OpeningHoursAdminPage() {
  const { t } = useTranslation();
  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [saveTimer, setSaveTimer] = useState<Record<string, NodeJS.Timeout>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // We need a reference to read changed state inside timeout
  const venueRef = useRef(venues);

  // Get venues
  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    getVenues()
      .then((venues) => {
        venueRef.current = venues;
        setVenues(venues);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  // Save venue change.
  function saveVenue(venue: VenueDto, field: keyof VenueDto, value: string) {
    // Get most recent edits if any
    const updatedVenues = venues.map((v) => (v.id === venue.id ? { ...v, [field]: value } : v));
    venueRef.current = updatedVenues;
    // Send field change to backend
    putVenue(venue.slug, {
      [field]: value,
    });
  }

  // Update view model on field.
  function handleOnChange(venue: VenueDto, field: keyof VenueDto) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      // Calculate new venues.
      const value = e.currentTarget.value;
      const newVenues = venues.map((v) => {
        if (v.id === venue.id) {
          return {
            ...v,
            [field]: value,
          };
        }
        return v;
      });
      // Update state and reference.
      setVenues(newVenues);
      venueRef.current = newVenues;

      // Cancel old save timer if any.
      const timer_id = `${venue.id}_${field}`;
      if (saveTimer[timer_id] !== undefined) {
        clearTimeout(saveTimer[timer_id]);
      }

      // Start a new save timer.
      const timer = setTimeout(() => {
        saveVenue(venue, field, value);
      }, 1000);

      // Store timeout to allow cancel.
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

  const header = <div className={styles.subtitle}>{t(KEY.admin_opening_hours_hint)}</div>;

  return (
    <AdminPage title={t(KEY.common_opening_hours)} header={header} loading={isLoading}>
      <div className={styles.venue_container}>{venues.map((venue) => venueBox(venue))}</div>
    </AdminPage>
  );
}
