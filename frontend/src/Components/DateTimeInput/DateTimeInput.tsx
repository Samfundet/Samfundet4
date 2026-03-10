import { Icon } from '@iconify/react';
import { KEY } from '~/i18n/constants';
import classNames from 'classnames';
import { format, isValid, parse } from 'date-fns';
import { enGB, nb } from 'date-fns/locale';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DateTimeInput.module.scss';

type DateTimeInputProps = {
  value: string | undefined;
  onChange: (isoString: string) => void;
  className?: string;
  calendarPopup?: React.ReactNode;
};

export function DateTimeInput({ value, onChange, className, calendarPopup }: DateTimeInputProps) {
  const { t, i18n } = useTranslation();
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const currentLocale = i18n.language === 'en' ? enGB : nb;

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (isValid(d)) {
        setDateStr(format(d, 'dd/MM/yyyy'));
        setTimeStr(format(d, 'HH:mm'));
      }
    }
  }, []);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (isValid(d)) {
        const formattedDate = format(d, 'dd/MM/yyyy');
        const formattedTime = format(d, 'HH:mm');
        if (formattedDate !== dateStr) setDateStr(formattedDate);
        if (formattedTime !== timeStr) setTimeStr(formattedTime);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parseResult = useMemo(() => {
    if (dateStr.length < 10 || timeStr.length < 5) {
      return { valid: true, message: '' };
    }

    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
    const timeParts = timeStr.split(':');

    if (isValid(parsedDate) && timeParts.length === 2) {
      const h = parseInt(timeParts[0], 10);
      const m = parseInt(timeParts[1], 10);
      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
        parsedDate.setHours(h, m);
        return {
          valid: true,
          message: format(parsedDate, 'PPPP p', { locale: currentLocale }),
          date: parsedDate,
        };
      }
    }
    return { valid: false, message: t(KEY.common_invalid_date) || 'Invalid date' };
  }, [dateStr, timeStr, currentLocale, t]);

  const tryEmit = (d: string, t: string) => {
    const dNums = d.replace(/\D/g, '');
    const tNums = t.replace(/\D/g, '');
    if (dNums.length === 8 && tNums.length === 4) {
      const dateObj = parse(dNums, 'ddMMyyyy', new Date());
      const hh = parseInt(tNums.slice(0, 2), 10);
      const min = parseInt(tNums.slice(2, 4), 10);

      if (isValid(dateObj) && hh < 24 && min < 60) {
        dateObj.setHours(hh, min);
        onChange(dateObj.toISOString());
      }
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
    if (isDeleting) {
      setTimeStr(val);
      tryEmit(dateStr, val);
      return;
    }

    const nums = val.replace(/\D/g, '');
    let formatted = nums;
    if (nums.length > 2) formatted = `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
    else if (nums.length === 2) formatted = `${nums}:`;

    setTimeStr(formatted);
    tryEmit(dateStr, formatted);
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
        <button
          type="button"
          className={styles.icon_button}
          onClick={() => setShowCalendar(!showCalendar)}
          tabIndex={-1}
        >
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

      <div
        className={classNames(
          styles.hint,
          !parseResult.valid && styles.hint_error,
          parseResult.message === '' && styles.hint_hidden,
        )}
      >
        {parseResult.message}
      </div>

      {showCalendar && calendarPopup && (
        <div className={styles.calendar_popup} onClick={() => setShowCalendar(false)}>
          {calendarPopup}
        </div>
      )}
    </div>
  );
}
