import classNames from 'classnames';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '~/Components/Page';
import { getVenues, putVenue } from '~/api';
import { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ALL_DAYS } from '~/types';
import { getDayKey } from '~/utils';
import styles from './OpeningHoursAdminPage.module.scss';

export function OpeningHoursAdminPage() {
  const { t } = useTranslation();
  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [saveTimer, setSaveTimer] = useState<Record<string, NodeJS.Timeout>>({});
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  // We need a reference to read changed state inside timeout
  const venueRef = useRef(venues);

  // Get venues
  useEffect(() => {
    getVenues().then((venues) => {
      venueRef.current = venues;
      setVenues(venues);
    });
  }, []);

  // Save venue change
  function saveVenue(venue: VenueDto, field: keyof VenueDto) {
    // Get most recent edits if any
    const recent = venueRef.current.filter((v) => v.id === venue.id)[0];
    // Send field change to backend
    putVenue(venue.id, {
      [field]: recent[field],
    })
      // Success
      .then(() => {
        setInvalid({
          ...invalid,
          [`${venue.id}_${field}`]: false,
        });
      })
      // Failed
      .catch(() => {
        setInvalid({
          ...invalid,
          [`${venue.id}_${field}`]: true,
        });
      });
  }

  // Update view model on field
  function handleOnChange(venue: VenueDto, field: keyof VenueDto) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      // Calculate new venues
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

      // Update state and reference
      setVenues(newVenues);
      venueRef.current = newVenues;

      // Cancel old save timer if any
      const timer_id = `${venue.id}_${field}`;
      if (saveTimer[timer_id] !== undefined) {
        clearTimeout(saveTimer[timer_id]);
      }

      // Start a new save timer
      const timer = setTimeout(() => {
        saveVenue(venue, field);
      }, 1000);

      // Store timeout to allow cancel
      setSaveTimer({
        ...saveTimer,
        [timer_id]: timer,
      });
    };
  }

  /**
   * Box for a single venue
   * Shows open/close times for each day
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
              // Error checking
              const invalidOpen = invalid[`${venue.id}_${openField}`] === true;
              const invalidClose = invalid[`${venue.id}_${closeField}`] === true;
              // Edit tools
              return (
                <div key={day} className={styles.day_row}>
                  <div className={styles.day_label}>{t(getDayKey(day))}</div>
                  <div className={styles.day_edit}>
                    <input
                      type="time"
                      value={venue[openField]}
                      onChange={handleOnChange(venue, openField)}
                      onBlur={() => saveVenue(venue, openField)}
                      className={classNames(invalidOpen && styles.invalid)}
                    />
                    -
                    <input
                      type="time"
                      value={venue[closeField]}
                      onChange={handleOnChange(venue, closeField)}
                      onBlur={() => saveVenue(venue, closeField)}
                      className={classNames(invalidClose && styles.invalid)}
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

  return (
    <Page>
      <div className={styles.header}>{t(KEY.opening_hours)}</div>
      <div className={styles.subtitle}>{t(KEY.admin_opening_hours_hint)}</div>
      <div className={styles.venue_container}>{venues.map((venue) => venueBox(venue))}</div>
    </Page>
  );
}
