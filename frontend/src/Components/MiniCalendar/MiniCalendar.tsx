import { useEffect, useState } from 'react';
import styles from './MiniCalendar.module.scss';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { addDays, isMonday, isSunday, lastDayOfMonth, nextSunday, previousMonday } from 'date-fns';
import classNames from 'classnames';
import { TimeDisplay } from '~/Components';

export type CalendarMarker = {
  date: Date;
  className?: string;
};

type MiniCalendarProps = {
  baseDate: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | null) => void;
  displayLabel?: boolean;
  markers?: CalendarMarker[];
};

const DAYS_I18N_KEYS = [
  KEY.common_day_monday_short,
  KEY.common_day_tuesday_short,
  KEY.common_day_wednesday_short,
  KEY.common_day_thursday_short,
  KEY.common_day_friday_short,
  KEY.common_day_saturday_short,
  KEY.common_day_sunday_short,
];

export function MiniCalendar({ baseDate, minDate, maxDate, onChange, displayLabel, markers }: MiniCalendarProps) {
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { t } = useTranslation();

  const getMarker = (d: Date | null) => {
    if (!d || !markers) {
      return null;
    }
    return markers.find((m) => m.date.toDateString() === d.toDateString());
  };

  const dateValid = (d: Date) => {
    return !((minDate && d.getTime() < minDate.getTime()) || (maxDate && d.getTime() > maxDate.getTime()));
  };

  useEffect(() => {
    const setup = () => {
      const monthStart = new Date(baseDate);
      monthStart.setDate(1);
      const monthEnd = lastDayOfMonth(baseDate);

      const padStart = isMonday(monthStart) ? monthStart : previousMonday(monthStart);
      const padEnd = isSunday(monthEnd) ? monthEnd : nextSunday(monthEnd);

      const d = [];
      let curr = padStart;
      while (curr <= addDays(padEnd, 1)) {
        d.push(curr);
        curr = addDays(curr, 1);
      }
      setDays(d);
    };
    setup();
  }, [baseDate]);

  return (
    <div className={styles.container}>
      {displayLabel && (
        <span className={styles.label}>
          <TimeDisplay timestamp={baseDate} displayType={'nice-month-year'} />
        </span>
      )}
      <div className={`${styles.grid} ${styles.days_header}`}>
        {DAYS_I18N_KEYS.map((d) => (
          <span key={d}>{t(d)}</span>
        ))}
      </div>
      <div className={styles.grid}>
        {days.map((d, i) => {
          const valid = dateValid(d);
          const isSelected = selectedDate?.toDateString() === d.toDateString();
          const marker = getMarker(d);

          return (
            <button
              key={i}
              className={classNames({
                [styles.day]: true,
                [styles.disabled_day]: !valid,
                [styles.selected_day]: isSelected,
              })}
              onClick={() => {
                onChange && onChange(d);
                setSelectedDate(d);
              }}
              disabled={!valid}
            >
              {d.getDate()}
              {marker && <div className={`${styles.marker} ${marker.className}`}></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
