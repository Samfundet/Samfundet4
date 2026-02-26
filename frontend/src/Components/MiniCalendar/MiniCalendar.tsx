import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { addDays, addMonths, isMonday, isSunday, lastDayOfMonth, nextSunday, previousMonday } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeDisplay } from '~/Components';
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
  /** List of dates to mark with a square dot */
  markers?: CalendarMarker[];
  /** Selected date can be defined on beforehand */
  initialSelectedDate?: Date | null;
  includeTime?: boolean;
};

export function MiniCalendar({
  baseDate,
  minDate,
  maxDate,
  onChange,
  displayLabel,
  markers,
  initialSelectedDate,
  includeTime = false,
}: MiniCalendarProps) {
  const [displayDate, setDisplayDate] = useState<Date>(baseDate);
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialSelectedDate || null);
  const { t } = useTranslation();

  const formatTimeFromDate = (date: Date | null) => {
    if (!date) return '';
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const [timeString, setTimeString] = useState(formatTimeFromDate(initialSelectedDate || null));

  function getMarker(d: Date | null) {
    if (!d || !markers) return null;
    return markers.find((m) => m.date.toDateString() === d.toDateString());
  }

  function dateValid(d: Date) {
    return !((minDate && d.getTime() < minDate.getTime()) || (maxDate && d.getTime() > maxDate.getTime()));
  }

  // --- Time Logic ---

  const parseTime = (str: string): { h: number; m: number } | null => {
    const parts = str.split(':');
    if (parts.length !== 2) return null;
    const h = Number.parseInt(parts[0], 10);
    const m = Number.parseInt(parts[1], 10);
    if (Number.isNaN(h) || Number.isNaN(m) || h > 23 || m > 59) return null;
    return { h, m };
  };

  const updateDateWithTime = (date: Date, tStr: string) => {
    const time = parseTime(tStr);
    if (time) {
      const newD = new Date(date);
      newD.setHours(time.h, time.m, 0, 0);
      return newD;
    }
    const resetD = new Date(date);
    resetD.setHours(0, 0, 0, 0);
    return resetD;
  };

  const handleTimeChange = (val: string) => {
    if (!/^[\d:]*$/.test(val) || val.length > 5) return;

    let newVal = val;

    if (val.length === 2 && timeString.length < 2 && !val.includes(':')) {
      if (Number.parseInt(val) < 24) {
        newVal = `${val}:`;
      }
    }

    setTimeString(newVal);

    if (newVal.length === 5 && selectedDate) {
      const parsed = parseTime(newVal);
      if (parsed) {
        const newD = updateDateWithTime(selectedDate, newVal);
        setSelectedDate(newD);
        onChange?.(newD);
      }
    }
  };

  const handleBlur = () => {
    // Standardize format on blur ("9:30" -> "09:30")
    if (timeString.includes(':')) {
      const [h, m] = timeString.split(':');
      if (h && m) {
        const hh = h.padStart(2, '0');
        const mm = m.padEnd(2, '0');

        if (Number.parseInt(hh) < 24 && Number.parseInt(mm) < 60) {
          const finalStr = `${hh}:${mm.substring(0, 2)}`;
          setTimeString(finalStr);

          if (selectedDate) {
            const newD = updateDateWithTime(selectedDate, finalStr);
            setSelectedDate(newD);
            onChange?.(newD);
          }
        }
      }
    }
  };

  // --- End Time Logic ---

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
          <button
            type="button"
            onClick={() => setDisplayDate(addMonths(displayDate, -1))}
            className={styles.change_month_button}
          >
            <Icon icon="carbon:chevron-left" />
          </button>
        )}
      </div>
      <TimeDisplay className={styles.label} timestamp={displayDate} displayType={'nice-month-year'} />
      <div className={styles.next_month}>
        {showNextMonthButton && (
          <button
            type="button"
            onClick={() => setDisplayDate(addMonths(displayDate, 1))}
            className={styles.change_month_button}
          >
            <Icon icon="carbon:chevron-right" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {monthHeader}

      <div className={`${styles.grid} ${styles.days_header}`}>
        {SHORT_DAY_I18N_KEYS.map((d) => (
          <span key={d}>{t(d)}</span>
        ))}
      </div>

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
                const newDate = isSelected ? null : new Date(d);
                if (newDate) {
                  if (includeTime) {
                    const updated = updateDateWithTime(newDate, timeString);
                    // If time string was empty/invalid, updateDateWithTime defaults to 00:00
                    newDate.setTime(updated.getTime());
                  } else {
                    newDate.setHours(0, 0, 0, 0);
                  }
                }
                onChange?.(newDate);
                setSelectedDate(newDate);
              }}
              disabled={!valid}
            >
              {d.getDate()}
              {marker && <div className={classNames(styles.marker, marker.className)} />}
            </button>
          );
        })}
      </div>

      {includeTime && (
        <div className={styles.time_picker}>
          <label className={styles.time_label}>{t('Time') || 'Time'}</label>
          <div className={styles.time_input_wrapper}>
            <input
              type="text"
              inputMode="numeric"
              className={styles.time_input}
              value={timeString}
              placeholder="00:00"
              onChange={(e) => handleTimeChange(e.target.value)}
              onBlur={handleBlur}
              onFocus={(e) => e.target.select()}
              maxLength={5}
              aria-label={t('Time')}
            />
            <Icon icon="carbon:time" className={styles.time_icon} />
          </div>
        </div>
      )}
    </div>
  );
}
