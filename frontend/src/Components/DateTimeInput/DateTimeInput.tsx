import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './DateTimeInput.module.scss';

type DateTimeInputProps = {
  value: string | undefined;
  onChange: (isoString: string) => void;
  className?: string;
};

export function DateTimeInput({ value, onChange, className }: DateTimeInputProps) {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

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
      onChange(''); // Allow clearing the form
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const isDeleting = val.length < dateStr.length;
    const nums = val.replace(/\D/g, '');

    let formatted = val;

    if (!isDeleting) {
      if (nums.length === 2 && !val.includes('/')) {
        formatted = `${nums}/`;
      } else if (nums.length === 4 && (val.match(/\//g) || []).length === 1) {
        formatted = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/`;
      } else if (nums.length > 4) {
        formatted = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)}`;
      }
    } else {
      if (dateStr.endsWith('/') && !val.endsWith('/')) {
        formatted = val.slice(0, -1);
      }
    }

    setDateStr(formatted);
    tryEmit(formatted, timeStr);

    if (formatted.length === 10) {
      timeInputRef.current?.focus();
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const isDeleting = val.length < timeStr.length;
    const nums = val.replace(/\D/g, '');

    let formatted = val;

    if (!isDeleting) {
      if (nums.length === 2 && !val.includes(':')) {
        formatted = `${nums}:`;
      } else if (nums.length > 2) {
        formatted = `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
      }
    } else {
      if (timeStr.endsWith(':') && !val.endsWith(':')) {
        formatted = val.slice(0, -1);
      }
    }

    setTimeStr(formatted);
    tryEmit(dateStr, formatted);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && timeStr === '') {
      e.preventDefault();
      dateInputRef.current?.focus();
    }
  };

  const handleBlur = () => {
    let t = timeStr;
    const tNums = t.replace(/\D/g, '');
    if (tNums.length === 3 && t.includes(':')) {
      const parts = t.split(':');
      t = `${parts[0].padStart(2, '0')}:${parts[1].padEnd(2, '0')}`;
    }
    setTimeStr(t);
    tryEmit(dateStr, t);
  };

  return (
    <div className={classNames(styles.container, className)} onClick={() => dateInputRef.current?.focus()}>
      <input
        ref={dateInputRef}
        type="text"
        inputMode="numeric"
        className={styles.input_date}
        value={dateStr}
        onChange={handleDateChange}
        onBlur={handleBlur}
        placeholder="DD/MM/YYYY"
        maxLength={10}
      />
      <div className={styles.separator}>
        <Icon icon="carbon:calendar" />
      </div>
      <input
        ref={timeInputRef}
        type="text"
        inputMode="numeric"
        className={styles.input_time}
        value={timeStr}
        onChange={handleTimeChange}
        onKeyDown={handleTimeKeyDown}
        onBlur={handleBlur}
        placeholder="HH:MM"
        maxLength={5}
      />
    </div>
  );
}
