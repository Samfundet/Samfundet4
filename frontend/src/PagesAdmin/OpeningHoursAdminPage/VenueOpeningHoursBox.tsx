import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { InputTime } from '~/Components';
import { Checkbox } from '~/Components/Checkbox';
import type { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ALL_DAYS, type Day } from '~/types';
import { getDayKey } from '~/utils';
import styles from './OpeningHoursAdminPage.module.scss';
import type { VenueDaySchedule } from './dto';
import { getVenueDaySchedule } from './utils';

type VenueOpeningHoursBoxProps = {
  venue: VenueDto;
  onSaveDay: (venue: VenueDto, weekday: Day, changes: Partial<VenueDaySchedule>) => void;
};

export function VenueOpeningHoursBox({ venue, onSaveDay }: VenueOpeningHoursBoxProps) {
  const { t } = useTranslation();
  const headingId = `venue-opening-hours-${venue.slug}`;

  return (
    <section className={styles.venue_box} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.venue_header}>
        {venue.name}
      </h2>
      <div className={styles.venue_content}>
        <div className={styles.day_row_header}>
          <div className={styles.day_label}>{t(KEY.admin_opening_hours_day)}</div>
          <div className={styles.day_edit}>
            <span className={styles.time_label}>{t(KEY.common_from)}</span>
            <span className={styles.time_label}>{t(KEY.common_to)}</span>
            <div className={styles.open_label}>{t(KEY.admin_opening_hours_open)}</div>
          </div>
        </div>

        {ALL_DAYS.map((weekday) => {
          const dayLabel = t(getDayKey(weekday));
          const schedule = getVenueDaySchedule(venue, weekday);
          const openingLabel = t(KEY.admin_opening_hours_opening_time, { day: dayLabel });
          const closingLabel = t(KEY.admin_opening_hours_closing_time, { day: dayLabel });

          return (
            <div key={weekday} className={classNames(styles.day_row, !schedule.is_open && styles.row_disabled)}>
              <div className={styles.day_label}>{dayLabel}</div>
              <div className={styles.day_edit}>
                <InputTime
                  className={styles.time_input}
                  value={schedule.opening}
                  disabled={!schedule.is_open}
                  ariaLabel={openingLabel}
                  hourAriaLabel={t(KEY.admin_opening_hours_hours_input, { field: openingLabel })}
                  minuteAriaLabel={t(KEY.admin_opening_hours_minutes_input, { field: openingLabel })}
                  onBlur={(opening) => onSaveDay(venue, weekday, { opening })}
                />
                <InputTime
                  className={styles.time_input}
                  value={schedule.closing}
                  disabled={!schedule.is_open}
                  ariaLabel={closingLabel}
                  hourAriaLabel={t(KEY.admin_opening_hours_hours_input, { field: closingLabel })}
                  minuteAriaLabel={t(KEY.admin_opening_hours_minutes_input, { field: closingLabel })}
                  onBlur={(closing) => onSaveDay(venue, weekday, { closing })}
                />
                <div className={styles.checkbox_wrapper}>
                  <Checkbox
                    aria-label={t(KEY.admin_opening_hours_day_is_open, { day: dayLabel })}
                    checked={schedule.is_open}
                    onChange={(event) => onSaveDay(venue, weekday, { is_open: event.target.checked })}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
