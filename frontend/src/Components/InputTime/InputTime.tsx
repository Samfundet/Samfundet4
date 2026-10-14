import classNames from 'classnames';
import { type ChangeEvent, type ClipboardEvent, type FocusEvent, useEffect, useRef, useState } from 'react';
import styles from './InputTime.module.scss';

type InputTimeProps = {
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  hourAriaLabel?: string;
  minuteAriaLabel?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  value?: string;
  error?: string;
};

function formatTime(hour: string, minute: string) {
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

export function InputTime({
  className,
  disabled,
  ariaLabel,
  hourAriaLabel,
  minuteAriaLabel,
  onChange,
  onBlur,
  value,
  error,
}: InputTimeProps) {
  const [valueHour = '', valueMinute = ''] = value?.split(':') ?? [];
  const [hour, setHour] = useState(valueHour);
  const [minute, setMinute] = useState(valueMinute);
  const isEditing = useRef(false);

  useEffect(() => {
    // Keep the user's raw input visible while still updating the parent with a normalized value.
    if (isEditing.current) return;
    setHour(valueHour);
    setMinute(valueMinute);
  }, [valueHour, valueMinute]);

  function setFormattedTime(hour: string, minute: string) {
    const formattedTime = formatTime(hour, minute);
    const [formattedHour, formattedMinute] = formattedTime.split(':');
    setHour(formattedHour);
    setMinute(formattedMinute);
    return formattedTime;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>, field: 'hour' | 'minute') {
    let numericValue = e.target.value;
    if (!/^\d{0,2}$/.test(numericValue)) return;
    isEditing.current = true;
    const maximum = field === 'hour' ? 23 : 59;
    if (Number(numericValue) > maximum) numericValue = String(maximum);
    if (field === 'hour') {
      setHour(numericValue);
      onChange?.(formatTime(numericValue, minute));
    } else {
      setMinute(numericValue);
      onChange?.(formatTime(hour, numericValue));
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').trim();
    if (/^\d+$/.test(text)) return;
    e.preventDefault();

    const match = /^(\d{1,2}):(\d{2})$/.exec(text);
    if (!match) return;
    const [, pastedHour, pastedMinute] = match;
    if (Number(pastedHour) > 23 || Number(pastedMinute) > 59) return;

    isEditing.current = true;
    const formattedTime = setFormattedTime(pastedHour, pastedMinute);
    onChange?.(formattedTime);
  }

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) return;
    isEditing.current = false;

    const formattedTime = setFormattedTime(hour, minute);

    if (formattedTime !== value) {
      onChange?.(formattedTime);
    }
    onBlur?.(formattedTime);
  }

  return (
    <div
      className={classNames(styles.inputTime_wrap, className)}
      role="group"
      aria-label={ariaLabel}
      onBlur={handleBlur}
    >
      <div className={classNames(styles.inputTime, error && styles.error)}>
        <input
          type="text"
          inputMode="numeric"
          className={classNames(styles.number, error && styles.error)}
          name="hour"
          value={hour}
          disabled={disabled}
          aria-label={hourAriaLabel}
          aria-invalid={Boolean(error)}
          onChange={(event) => handleChange(event, 'hour')}
          onPaste={handlePaste}
        />
        <p>:</p>
        <input
          type="text"
          inputMode="numeric"
          className={classNames(styles.number, error && styles.error)}
          name="minute"
          value={minute}
          disabled={disabled}
          aria-label={minuteAriaLabel}
          aria-invalid={Boolean(error)}
          onChange={(event) => handleChange(event, 'minute')}
          onPaste={handlePaste}
        />
      </div>
      {error && <div className={styles.errorMessage}> {error}</div>}
    </div>
  );
}
