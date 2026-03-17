import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { format, isValid, parse, set } from 'date-fns';
import { enGB, nb } from 'date-fns/locale';
import { type InputHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import styles from './DateTimeInput.module.scss';

const onlyNums = (str: string) => str.replace(/\D/g, '');

const formatInputDate = (val: string, prev: string): string => {
  const isDeleting = val.length < prev.length;
  if (isDeleting) return prev.endsWith('/') && !val.endsWith('/') ? val.slice(0, -1) : val;

  const nums = onlyNums(val);
  if (nums.length >= 5) return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)}`;
  if (nums.length >= 3) return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/`;
  if (nums.length === 2 && !val.includes('/')) return `${nums}/`;

  return val;
};

const formatInputTime = (val: string, prev: string): string => {
  const isDeleting = val.length < prev.length;
  if (isDeleting) return val;

  const nums = onlyNums(val);
  if (nums.length >= 3) return `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
  if (nums.length === 2) return `${nums}:`;

  return nums;
};

const computeEmittableValue = (dateStr: string, timeStr: string): string => {
  if (!dateStr && !timeStr) return '';

  const dNums = onlyNums(dateStr);
  const tNums = onlyNums(timeStr);

  if (dNums.length === 8 && tNums.length === 4) {
    const parsedDate = parse(dNums, 'ddMMyyyy', new Date());
    const hours = Number.parseInt(tNums.slice(0, 2), 10);
    const minutes = Number.parseInt(tNums.slice(2, 4), 10);

    if (isValid(parsedDate) && hours < 24 && minutes < 60) {
      return set(parsedDate, { hours, minutes }).toISOString();
    }
  }

  return `${dateStr} ${timeStr}`.trim();
};

const deriveLocalStateFromExternalValue = (val: string | undefined): { dateStr: string; timeStr: string } => {
  if (!val) return { dateStr: '', timeStr: '' };

  const parsedDate = new Date(val);
  if (isValid(parsedDate)) {
    return {
      dateStr: format(parsedDate, 'dd/MM/yyyy'),
      timeStr: format(parsedDate, 'HH:mm'),
    };
  }

  const [dateStr = '', timeStr = ''] = val.split(' ');
  return { dateStr, timeStr };
};

const getNativeDateStr = (dateStr: string): string => {
  if (dateStr.length !== 10) return '';
  const [d, m, y] = dateStr.split('/');
  return d && m && y ? `${y}-${m}-${d}` : '';
};

const validateInput = (dateStr: string, timeStr: string, locale: Locale, errorMsg: string) => {
  if (dateStr.length < 10 || timeStr.length < 5) return null;

  const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
  const [hStr, mStr] = timeStr.split(':');
  const h = Number.parseInt(hStr, 10);
  const m = Number.parseInt(mStr, 10);

  const isTimeValid = !Number.isNaN(h) && !Number.isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60;

  if (isValid(parsedDate) && isTimeValid) {
    const finalDate = set(parsedDate, { hours: h, minutes: m });
    return { message: format(finalDate, 'PPPP p', { locale }), isError: false };
  }

  return { message: errorMsg, isError: true };
};

interface DateTimeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string | undefined;
  onChange: (isoString: string) => void;
  className?: string;
}

export function DateTimeInput({
  value,
  onChange,
  className,
  'aria-invalid': isInvalid,
  id,
  name,
  disabled,
  ...restProps
}: DateTimeInputProps) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === 'en' ? enGB : nb;

  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const nativeDateInputRef = useRef<HTMLInputElement>(null);
  const lastEmittedValue = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (value !== lastEmittedValue.current) {
      const { dateStr: newDate, timeStr: newTime } = deriveLocalStateFromExternalValue(value);
      setDateStr(newDate);
      setTimeStr(newTime);
      lastEmittedValue.current = value;
    }
  }, [value]);

  const parseResult = useMemo(
    () => validateInput(dateStr, timeStr, currentLocale, t(KEY.common_invalid_date)),
    [dateStr, timeStr, currentLocale, t],
  );

  const nativeDateValue = useMemo(() => getNativeDateStr(dateStr), [dateStr]);

  const emitChange = (newDateStr: string, newTimeStr: string) => {
    const newValue = computeEmittableValue(newDateStr, newTimeStr);
    lastEmittedValue.current = newValue;
    onChange(newValue);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = formatInputDate(e.target.value, dateStr);
    setDateStr(newDateStr);
    emitChange(newDateStr, timeStr);

    if (newDateStr.length === 10 && newDateStr !== dateStr) {
      timeInputRef.current?.focus();
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeStr = formatInputTime(e.target.value, timeStr);
    setTimeStr(newTimeStr);
    emitChange(dateStr, newTimeStr);
  };

  const handleNativeDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;

    const [y, m, d] = e.target.value.split('-');
    const newDateStr = `${d}/${m}/${y}`;

    setDateStr(newDateStr);
    emitChange(newDateStr, timeStr);
    timeInputRef.current?.focus();
  };

  return (
    <div className={classNames(styles.wrapper, className)} ref={containerRef}>
      <div
        className={classNames(styles.container, {
          [styles.has_error]: isInvalid || parseResult?.isError,
        })}
      >
        <input
          ref={dateInputRef}
          type="text"
          inputMode="numeric"
          className={styles.input_date}
          value={dateStr}
          onChange={handleDateChange}
          placeholder="DD/MM/YYYY"
          maxLength={10}
          id={id}
          name={name}
          disabled={disabled}
          {...restProps}
        />

        <button
          type="button"
          className={styles.icon_button}
          onClick={() => nativeDateInputRef.current?.showPicker()}
          tabIndex={-1}
          aria-label="Open Calendar"
          disabled={disabled}
        >
          <Icon icon="carbon:calendar" />
        </button>

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
          id={id ? `${id}-time` : undefined}
          disabled={disabled}
          {...restProps}
        />
      </div>

      {parseResult && (
        <div className={classNames(styles.hint, parseResult.isError && styles.hint_error)}>{parseResult.message}</div>
      )}
    </div>
  );
}
