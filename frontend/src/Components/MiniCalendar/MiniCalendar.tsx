import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { addDays, addMonths, isMonday, isSunday, lastDayOfMonth, nextSunday, previousMonday } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TimeDisplay } from '~/Components';
import type { CalendarMarker } from '~/types';
import { SHORT_DAY_I18N_KEYS } from '~/utils';
import styles from './MiniCalendar.module.scss';

type MiniCalendarProps = {
  /** Decides which month to display */
  baseDate: Date;
  /** If set, cannot select date before this */
  minDate?: Date;
  /** If set, cannot select date after this */
  maxDate?: Date;
  /** Called when user selects a date */
  onChange?: (date: Date | null) => void;
  /** If true, displays the current month and year */
  displayLabel?: boolean;
  /** List of dates to mark with a dot */
  markers?: CalendarMarker[];
};

export function MiniCalendar({ baseDate, minDate, maxDate, onChange, displayLabel, markers }: MiniCalendarProps) {
  const [displayDate, setDisplayDate] = useState<Date>(baseDate);
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { t } = useTranslation();

  function getMarker(d: Date | null) {
    if (!d || !markers) {
      return null;
    }
    return markers.find((m) => m.date.toDateString() === d.toDateString());
  }

  function dateValid(d: Date) {
    return !((minDate && d.getTime() < minDate.getTime()) || (maxDate && d.getTime() > maxDate.getTime()));
  }

  useEffect(() => {
    const monthStart = new Date(displayDate);
    monthStart.setDate(1);
    const monthEnd = lastDayOfMonth(displayDate);

    const padStart = isMonday(monthStart) ? monthStart : previousMonday(monthStart);
    const padEnd = isSunday(monthEnd) ? monthEnd : nextSunday(monthEnd);

    const d = [];
    let curr = padStart;
    while (curr < addDays(padEnd, 1)) {
      d.push(curr);
      curr = addDays(curr, 1);
    }
    setDays(d);
  }, [displayDate]);

  useEffect(() => {
    setDisplayDate(baseDate);
  }, [baseDate]);

  const showPrevMonthButton =
    minDate === undefined ||
    new Date(minDate.getFullYear(), minDate.getMonth()) < new Date(displayDate.getFullYear(), displayDate.getMonth());

  const showNextMonthButton =
    maxDate === undefined ||
    new Date(maxDate.getFullYear(), maxDate.getMonth()) > new Date(displayDate.getFullYear(), displayDate.getMonth());

  const monthHeader = displayLabel && (
    <div className={styles.month_header}>
      <div className={styles.previous_month}>
        {showPrevMonthButton && (
          <Button onClick={() => setDisplayDate(addMonths(displayDate, -1))} className={styles.change_month_button}>
            <Icon icon="carbon:chevron-left" />
          </Button>
        )}
      </div>
      <TimeDisplay className={styles.label} timestamp={displayDate} displayType={'nice-month-year'} />
      <div className={styles.next_month}>
        {showNextMonthButton && (
          <Button onClick={() => setDisplayDate(addMonths(displayDate, 1))} className={styles.change_month_button}>
            <Icon icon="carbon:chevron-right" />
          </Button>
        )}
      </div>
    </div>
  );

  const daysHeader = (
    <div className={`${styles.grid} ${styles.days_header}`}>
      {SHORT_DAY_I18N_KEYS.map((d) => (
        <span key={d}>{t(d)}</span>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {monthHeader}
      {daysHeader}
      <div className={styles.grid}>
        {days.map((d) => {
          const valid = dateValid(d);
          const isSelected = selectedDate?.toDateString() === d.toDateString();
          const marker = getMarker(d);
          const outsideDay = displayDate.getFullYear() !== d.getFullYear() || displayDate.getMonth() !== d.getMonth();

          return (
            <button
              key={d.toISOString()}
              type="button"
              className={classNames({
                [styles.day]: true,
                [styles.disabled_day]: !valid,
                [styles.outside_month_day]: outsideDay,
                [styles.selected_day]: isSelected,
              })}
              onClick={() => {
                onChange?.(d);
                setSelectedDate(d);
              }}
              disabled={!valid}
            >
              {d.getDate()}
              {marker && <div className={`${styles.marker} ${marker.className}`} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
