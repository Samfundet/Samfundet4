import { ChangeEvent, useEffect, useState } from 'react';
import styles from './InputTime.module.scss';

type InputTimeProps = {
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  value?: string;
};

export function InputTime({ onChange, onBlur, value }: InputTimeProps) {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  useEffect(() => {
    if (value) {
      const [parsedHour, parsedMinute] = value.split(':');
      setHour(parsedHour);
      setMinute(parsedMinute);
    }
  }, [value]);

  useEffect(() => {
    const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    onChange?.(formattedTime);
  }, [hour, minute, onChange]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const inputName = e.target.getAttribute('name');
    let numericValue = e.target.value.replace(/[^0-9]/g, '');
    const parsedValue = parseInt(numericValue, 10);
    if (inputName === 'hour') {
      numericValue = parsedValue > 23 ? '23' : e.target.value;
      // Regex for 00-23, allowing for values without 0 padding
      if (/^(2[0-3]|[0-1]?[0-9])$/.test(numericValue) || numericValue.length === 0) {
        setHour(numericValue);
        onChange?.(numericValue.padStart(2, '0') + ':' + minute.padStart(2, '0'));
      }
    } else if (inputName === 'minute') {
      numericValue = parsedValue > 59 ? '59' : e.target.value;
      // Regex for 00-59, allowing for values without 0 padding
      if (/^([0-5]?[0-9])$/.test(numericValue) || numericValue.length === 0) {
        setMinute(numericValue);
        onChange?.(hour.padStart(2, '0') + ':' + numericValue.padStart(2, '0'));
      }
    }
  }

  function handleBlur() {
    const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    onBlur?.(formattedTime);
  }

  return (
    <div className={styles.inputTime_wrap}>
      <div className={styles.inputTime}>
        <input
          type="text"
          className={styles.number}
          name="hour"
          value={hour}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p>:</p>
        <input
          type="text"
          className={styles.number}
          name="minute"
          value={minute}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div className={styles.error}></div>
    </div>
  );
}
