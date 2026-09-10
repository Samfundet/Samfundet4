import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { InputTime } from '~/Components';
import { Checkbox } from '~/Components/Checkbox';
import type { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ALL_DAYS } from '~/types';
import { getDayKey, getVenueDaySchedule } from '~/utils';
import styles from './OpeningHoursAdminPage.module.scss';

type Props = {
  venue: VenueDto;
  onSave: (venue: VenueDto, field: keyof VenueDto, value: string | boolean) => void;
};

export function VenueOpeningHoursBox({ venue, onSave }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.venue_box}>
      <div className={styles.venue_header}>{venue.name}</div>
      <div className={styles.venue_content}>
        <div className={styles.row_container}>
          <div className={styles.day_row_header}>
            <div className={styles.day_label}>{t(KEY.common_day)}</div>
            <div className={styles.day_edit}>
              <span className={styles.time_label}>{t(KEY.common_from)}</span>
              <span className={styles.time_label}>{t(KEY.common_to)}</span>
              <div className={styles.open_label}>{t(KEY.common_open)}</div>
            </div>
          </div>

          {ALL_DAYS.map((day) => {
            const openField: keyof VenueDto = `opening_${day}`;
            const closeField: keyof VenueDto = `closing_${day}`;
            const isOpenField: keyof VenueDto = `is_open_${day}`;
            const { opening, closing, isOpen } = getVenueDaySchedule(venue, day);
            return (
              <div key={`${venue.slug}-${day}`} className={classNames(styles.day_row, !isOpen && styles.row_disabled)}>
                <div className={styles.day_label}>{t(getDayKey(day))}</div>
                <div className={styles.day_edit}>
                  <InputTime
                    className={styles.time_input}
                    value={opening}
                    onBlur={(formattedTime) => onSave(venue, openField, formattedTime)}
                    disabled={!isOpen}
                  />
                  <InputTime
                    className={styles.time_input}
                    value={closing}
                    onBlur={(formattedTime) => onSave(venue, closeField, formattedTime)}
                    disabled={!isOpen}
                  />
                  <div className={styles.checkbox_wrapper}>
                    <Checkbox
                      aria-label={`Mark ${day} as open`}
                      checked={isOpen}
                      onChange={() => onSave(venue, isOpenField, !isOpen)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
