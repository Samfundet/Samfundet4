import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { format, isValid, parse } from 'date-fns';
import { enGB, nb } from 'date-fns/locale';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import styles from './DateTimeInput.module.scss';

type DateTimeInputProps = {
  value: string | undefined;
  onChange: (isoString: string) => void;
  className?: string;
};

export function DateTimeInput({ value, onChange, className }: DateTimeInputProps) {
  const { t, i18n } = useTranslation();
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const nativeDateInputRef = useRef<HTMLInputElement>(null);

  const lastSyncedValue = useRef<string | undefined>(undefined);
  const currentLocale = i18n.language === 'en' ? enGB : nb;

  useEffect(() => {
    if (value !== lastSyncedValue.current) {
      if (value) {
        const d = new Date(value);
        if (isValid(d)) {
          setDateStr(format(d, 'dd/MM/yyyy'));
          setTimeStr(format(d, 'HH:mm'));
        }
      } else {
        setDateStr('');
        setTimeStr('');
      }
      lastSyncedValue.current = value;
    }
  }, [value]);

  const parseResult = useMemo(() => {
    if (dateStr.length < 10) {
      return { valid: true, message: '' };
    }

    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());

    if (!isValid(parsedDate)) {
      return { valid: false, message: t(KEY.common_invalid_date) };
    }

    if (timeStr.length === 5) {
      const timeParts = timeStr.split(':');
      const h = Number.parseInt(timeParts[0], 10);
      const m = Number.parseInt(timeParts[1], 10);

      if (!Number.isNaN(h) && !Number.isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60) {
        parsedDate.setHours(h, m);
        return {
          valid: true,
          message: format(parsedDate, 'PPPP p', { locale: currentLocale }),
        };
      }
      return { valid: false, message: t(KEY.common_invalid_date) };
    }

    return {
      valid: true,
      message: format(parsedDate, 'PPPP', { locale: currentLocale }),
    };
  }, [dateStr, timeStr, currentLocale, t]);

  const tryEmit = (d: string, t: string) => {
    const dNums = d.replace(/\D/g, '');
    const tNums = t.replace(/\D/g, '');
    if (dNums.length === 8 && tNums.length === 4) {
      const dateObj = parse(dNums, 'ddMMyyyy', new Date());
      const hh = Number.parseInt(tNums.slice(0, 2), 10);
      const min = Number.parseInt(tNums.slice(2, 4), 10);

      if (isValid(dateObj) && hh < 24 && min < 60) {
        dateObj.setHours(hh, min);
        const iso = dateObj.toISOString();
        lastSyncedValue.current = iso;
        onChange(iso);
      }
    } else if (d === '' && t === '') {
      lastSyncedValue.current = '';
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

  // Convert DD/MM/YYYY into YYYY-MM-DD so the native picker opens to the correct month
  const nativeDateValue = useMemo(() => {
    if (dateStr.length === 10) {
      const [d, m, y] = dateStr.split('/');
      if (d && m && y) return `${y}-${m}-${d}`;
    }
    return '';
  }, [dateStr]);

  const handleNativeDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const [y, m, d] = val.split('-');
      const newDateStr = `${d}/${m}/${y}`;
      setDateStr(newDateStr);
      tryEmit(newDateStr, timeStr);
      timeInputRef.current?.focus();
    }
  };

  return (
    <div className={classNames(styles.wrapper, className)}>
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
          onClick={() => nativeDateInputRef.current?.showPicker()}
          tabIndex={-1}
          aria-label="Open Calendar"
        >
          <Icon icon="carbon:calendar" />
        </button>

        {/* native date picker */}
        <input
          type="date"
          ref={nativeDateInputRef}
          value={nativeDateValue}
          onChange={handleNativeDateSelect}
          className={styles.hidden_native_picker}
          tabIndex={-1}
        />

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
    </div>
  );
}
