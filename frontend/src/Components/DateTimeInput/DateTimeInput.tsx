import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { MiniCalendar } from '~/Components';
import styles from './DateTimeInput.module.scss';

type DateTimeInputProps = {
  value: string | undefined;
  onChange: (isoString: string) => void;
  className?: string;
};

export function DateTimeInput({ value, onChange, className }: DateTimeInputProps) {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Sync initial/external value to local strings
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        const HH = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        setDateStr(`${dd}/${mm}/${yyyy}`);
        setTimeStr(`${HH}:${min}`);
      }
    }
  }, [value]);

  // Click outside logic to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tryEmit = (d: string, t: string) => {
    const dNums = d.replace(/\D/g, '');
    const tNums = t.replace(/\D/g, '');
    if (dNums.length === 8 && tNums.length >= 3) {
      const dateObj = new Date(
        Number.parseInt(dNums.slice(4, 8)), // YYYY
        Number.parseInt(dNums.slice(2, 4)) - 1, // MM
        Number.parseInt(dNums.slice(0, 2)), // DD
        Number.parseInt(tNums.slice(0, 2)), // HH
        Number.parseInt(tNums.slice(2, 4)), // min
      );
      if (!Number.isNaN(dateObj.getTime())) onChange(dateObj.toISOString());
    } else if (d === '' && t === '') {
      onChange('');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const isDeleting = val.length < dateStr.length;
    const nums = val.replace(/\D/g, '');
    let formatted = val;

    if (!isDeleting) {
      if (nums.length === 2 && !val.includes('/')) formatted = `${nums}/`;
      else if (nums.length === 4 && (val.match(/\//g) || []).length === 1)
        formatted = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/`;
      else if (nums.length > 4) formatted = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)}`;
    } else if (dateStr.endsWith('/') && !val.endsWith('/')) {
      formatted = val.slice(0, -1);
    }
    setDateStr(formatted);
    tryEmit(formatted, timeStr);
    if (formatted.length === 10) timeInputRef.current?.focus();
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const isDeleting = val.length < timeStr.length;
    const nums = val.replace(/\D/g, '');
    let formatted = val;

    if (!isDeleting) {
      if (nums.length === 2 && !val.includes(':')) formatted = `${nums}:`;
      else if (nums.length > 2) formatted = `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
    } else if (timeStr.endsWith(':') && !val.endsWith(':')) {
      formatted = val.slice(0, -1);
    }
    setTimeStr(formatted);
    tryEmit(dateStr, formatted);
  };

  // When a date is clicked in the MiniCalendar
  const onCalendarSelect = (date: Date | null) => {
    if (date) {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const newDateStr = `${dd}/${mm}/${yyyy}`;

      setDateStr(newDateStr);
      tryEmit(newDateStr, timeStr);
      setShowCalendar(false); // Close after picking
      timeInputRef.current?.focus(); // Move to time
    }
  };

  return (
    <div className={classNames(styles.wrapper, className)} ref={containerRef}>
      <div className={styles.container}>
        <input
          ref={dateInputRef}
          type="text"
          inputMode="numeric"
          className={styles.input_date}
          value={dateStr}
          onChange={handleDateChange}
          placeholder="DD/MM/YYYY"
          maxLength={10}
        />

        <button type="button" className={styles.icon_button} onClick={() => setShowCalendar(!showCalendar)}>
          <Icon icon="carbon:calendar" />
        </button>

        <div className={styles.separator} />

        <input
          ref={timeInputRef}
          type="text"
          inputMode="numeric"
          className={styles.input_time}
          value={timeStr}
          onChange={handleTimeChange}
          onKeyDown={(e) => e.key === 'Backspace' && timeStr === '' && dateInputRef.current?.focus()}
          placeholder="HH:MM"
          maxLength={5}
        />
      </div>

      {showCalendar && (
        <div className={styles.calendar_popup}>
          <MiniCalendar
            baseDate={new Date()}
            initialSelectedDate={value ? new Date(value) : null}
            onChange={onCalendarSelect}
            displayLabel
          />
        </div>
      )}
    </div>
  );
}
